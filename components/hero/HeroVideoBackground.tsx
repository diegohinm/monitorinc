'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * MONITORINC hero background — two local MP4s played as one continuous loop:
 * video1 → video2 → video1 → …
 *
 * Both <video> elements stay mounted at all times (never remounted, never
 * src-swapped), stacked in the same box. The active one is opacity 1, the
 * other is preloaded, paused at frame 0 and opacity 0. When the active clip
 * fires `ended` we only flip the opacity *after* the next clip is actually
 * playable (readyState >= HAVE_FUTURE_DATA or a `canplay` event), so there is
 * never a black/white frame between clips.
 *
 * prefers-reduced-motion: no alternation at all. video1 loads and stays paused
 * on its first frame, so the hero keeps the cinematic still without motion.
 */

type HeroVideoSource = {
  src: string
  objectPosition?: string
  /**
   * Set these only when a clip ships with letter/pillarbox bars baked into its
   * pixels. `object-fit: cover` treats those bars as picture content, so the
   * only way to lose them is to crop in past them.
   *
   * `contentAspect` is the aspect ratio of the actual picture, `frameAspect`
   * that of the encoded frame.
   */
  contentAspect?: number
  frameAspect?: number
}

const VIDEO_SOURCES: HeroVideoSource[] = [
  // 4:3 footage pillarboxed into a 1280x720 frame: 159px of black on the left,
  // 160px on the right, measured off a decoded frame.
  {
    src: '/videos/video1.mp4',
    objectPosition: 'center center',
    contentAspect: 961 / 720,
    frameAspect: 1280 / 720,
  },
  // Native 16:9, no bars — no zoom, no needless upscaling.
  { src: '/videos/video2.mp4', objectPosition: 'center center' },
]

/**
 * Zoom needed to push a clip's baked-in side bars past the edges of a box.
 *
 * `cover` already crops the bars away on its own whenever the box is narrower
 * than the picture, which is what happens on portrait phones — so this returns
 * 1 there and we avoid a pointless upscale. Past that, the zoom grows with the
 * box until `cover` becomes width-driven at the frame's own aspect ratio, which
 * is where the requirement tops out.
 */
function barCropScale(source: HeroVideoSource, boxAspect: number) {
  const { contentAspect, frameAspect } = source
  if (!contentAspect || !frameAspect || !boxAspect || !Number.isFinite(boxAspect)) return 1
  const needed = Math.max(1, boxAspect / contentAspect)
  const max = frameAspect / contentAspect
  const scale = Math.min(needed, max)
  // Nudge past the bars so subpixel rounding can't leave a black hairline.
  return scale > 1 ? scale * 1.006 : 1
}

/** How long we wait for the next clip to become playable before giving up. */
const READY_TIMEOUT_MS = 4000

type Props = {
  className?: string
  transitionMs?: number
}

export function HeroVideoBackground({ className = '', transitionMs = 650 }: Props) {
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([null, null])
  const activeIndexRef = useRef(0)
  const swappingRef = useRef(false)
  const reducedRef = useRef(false)
  const timeoutsRef = useRef<Set<number>>(new Set())
  const disposersRef = useRef<Set<() => void>>(new Set())
  const failedRef = useRef<boolean[]>([false, false])
  const mountedRef = useRef(true)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [firstFrameReady, setFirstFrameReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [boxAspect, setBoxAspect] = useState(0)

  /* ── small helpers ─────────────────────────────────────────── */

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timeoutsRef.current.delete(id)
      if (mountedRef.current) fn()
    }, ms)
    timeoutsRef.current.add(id)
    return id
  }, [])

  const safePlay = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return
    video.muted = true
    try {
      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch {
      /* autoplay blocked or element detached — keep the current frame visible */
    }
  }, [])

  const rewind = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return
    try {
      video.currentTime = 0
    } catch {
      /* seeking can throw before metadata is loaded */
    }
  }, [])

  /* ── prefers-reduced-motion ────────────────────────────────── */

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = (matches: boolean) => {
      reducedRef.current = matches
      setReduced(matches)
    }
    apply(mql.matches)
    const onChange = (e: MediaQueryListEvent) => apply(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  /* ── mount / unmount bookkeeping ───────────────────────────── */

  useEffect(() => {
    mountedRef.current = true
    const timeouts = timeoutsRef.current
    const disposers = disposersRef.current
    return () => {
      mountedRef.current = false
      timeouts.forEach((id) => window.clearTimeout(id))
      timeouts.clear()
      disposers.forEach((dispose) => dispose())
      disposers.clear()
    }
  }, [])

  /* ── kick off the first clip ───────────────────────────────── */

  useEffect(() => {
    const first = videoRefs.current[0]
    if (!first) return
    first.muted = true
    // `loadeddata` can fire before React hydrates and attaches onLoadedData,
    // which would leave the clip playing at opacity 0 forever. Catch up here.
    if (first.readyState >= 2) setFirstFrameReady(true)
    if (reduced) {
      first.pause()
      rewind(first)
    } else {
      safePlay(first)
    }
  }, [reduced, safePlay, rewind])

  /* ── track the box ratio so the bar crop follows the layout ── */

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width > 0 && height > 0) setBoxAspect(width / height)
    }
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* ── pause everything while the tab is hidden ──────────────── */

  useEffect(() => {
    const onVisibility = () => {
      const videos = videoRefs.current
      if (document.visibilityState === 'hidden') {
        videos.forEach((v) => v && v.pause())
      } else if (!reducedRef.current) {
        safePlay(videos[activeIndexRef.current])
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [safePlay])

  /* ── sequencing: video1 → video2 → video1 → … ──────────────── */

  const handleEnded = useCallback(
    (index: number) => {
      if (reducedRef.current) return
      if (index !== activeIndexRef.current) return
      if (swappingRef.current) return

      const current = videoRefs.current[index]
      const nextIndex = index === 0 ? 1 : 0
      const next = videoRefs.current[nextIndex]

      // Next clip unusable → simply loop the current one, never go dark.
      if (!next || failedRef.current[nextIndex]) {
        rewind(current)
        safePlay(current)
        return
      }

      swappingRef.current = true

      const startNext = () => {
        rewind(next)
        safePlay(next)
        activeIndexRef.current = nextIndex
        setActiveIndex(nextIndex)
        // Stop the outgoing clip only once the crossfade has finished.
        addTimeout(() => {
          if (activeIndexRef.current !== index && current) {
            current.pause()
            rewind(current)
          }
          swappingRef.current = false
        }, transitionMs + 80)
      }

      // HAVE_FUTURE_DATA or better → safe to flip right away.
      if (next.readyState >= 3) {
        startNext()
        return
      }

      let settled = false
      const dispose = () => {
        if (settled) return
        settled = true
        next.removeEventListener('canplay', onReady)
        next.removeEventListener('canplaythrough', onReady)
        next.removeEventListener('loadeddata', onReady)
        disposersRef.current.delete(dispose)
      }
      function onReady() {
        dispose()
        if (mountedRef.current) startNext()
      }

      disposersRef.current.add(dispose)
      next.addEventListener('canplay', onReady)
      next.addEventListener('canplaythrough', onReady)
      next.addEventListener('loadeddata', onReady)

      // Safety net: if the next clip never becomes playable, keep the hero
      // alive by replaying the current one instead of freezing on a still.
      addTimeout(() => {
        if (settled) return
        dispose()
        swappingRef.current = false
        rewind(current)
        safePlay(current)
      }, READY_TIMEOUT_MS)
    },
    [addTimeout, rewind, safePlay, transitionMs],
  )

  return (
    <div
      ref={containerRef}
      className={`hero-video${className ? ` ${className}` : ''}`}
      style={{ '--hero-video-fade': `${transitionMs}ms` } as React.CSSProperties}
      aria-hidden="true"
    >
      {VIDEO_SOURCES.map((source, index) => {
        const scale = barCropScale(source, boxAspect)
        return (
        <video
          key={source.src}
          ref={(el) => {
            videoRefs.current[index] = el
          }}
          className={`hero-video__el${
            index === activeIndex && firstFrameReady ? ' hero-video__el--active' : ''
          }`}
          style={{
            objectPosition: source.objectPosition ?? 'center center',
            transform: scale > 1 ? `scale(${scale.toFixed(4)})` : undefined,
          }}
          src={source.src}
          autoPlay={index === 0}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={() => {
            if (index === 0) setFirstFrameReady(true)
          }}
          onEnded={() => handleEnded(index)}
          onError={() => {
            failedRef.current[index] = true
            // If the opening clip is unusable, promote the other one instead
            // of leaving the hero on the flat fallback colour.
            if (index === 0 && !failedRef.current[1]) {
              activeIndexRef.current = 1
              setActiveIndex(1)
              setFirstFrameReady(true)
              if (!reducedRef.current) safePlay(videoRefs.current[1])
            }
          }}
        />
        )
      })}

      <div className="hero-video__overlay hero-video__overlay--flat" />
      <div className="hero-video__overlay hero-video__overlay--h" />
      <div className="hero-video__overlay hero-video__overlay--v" />
    </div>
  )
}

export default HeroVideoBackground
