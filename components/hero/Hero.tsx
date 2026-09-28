'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { SOLUTION_SLIDES, type SolutionSlide } from '../../content/solutions'
import { AgendarDemoButton } from '../ui/AgendarDemoButton'
import { useReducedMotionSafe } from './useReducedMotionSafe'

/**
 * MONITORINC Home hero — editorial video storytelling, one full-bleed clip per
 * solution category (Seguridad, Automatización, Monitoreo) with a minimal
 * text layer: title, subtitle and a short list. Everything a slide shows comes
 * from SOLUTION_SLIDES (content/solutions.ts); the component only decides
 * which slide is active.
 *
 * The two CTAs are part of the hero, not of any slide: they sit in their own
 * layer above the stage and never fade with the cycle. There are no carousel
 * controls or indicators — it plays as one continuous film.
 *
 * The cycle is driven by the clips themselves: no loop, no timers. Every clip
 * shares one `onEnded` handler, so whichever slide is on stage hands over to
 * the next when its video finishes — Seguridad → Automatización → Monitoreo →
 * Seguridad … indefinitely, each clip for its real duration.
 *
 * Slides are stacked in one fixed-height stage, so switching never reflows.
 * The incoming slide dissolves in on top of the outgoing one (whose clip is
 * paused on its current frame underneath), and its copy arrives with a short
 * fade + rise once the outgoing copy has gone.
 *
 * Loading: the first poster is in the server HTML; the clips of the active
 * and next slides attach right after hydration, the rest as the cycle
 * reaches them. Clips play only while the hero is on screen and the tab is
 * visible. With reduced motion, or if the browser refuses autoplay, the hero
 * stays on the first slide's poster.
 */
const COUNT = SOLUTION_SLIDES.length

/**
 * Extra zoom (on top of `object-fit: cover`) that pushes a clip's baked-in
 * padding out of a box of the given size. 1 when there is nothing to hide or
 * `cover` already crops it away on its own.
 */
function barCropScale(slide: SolutionSlide, box: { w: number; h: number }) {
  if (!slide.crop || !box.w || !box.h) return 1
  const [fw, fh] = slide.crop.frame
  const [cw, ch] = slide.crop.content
  const cover = Math.max(box.w / fw, box.h / fh)
  const needed = Math.max(box.w / cw, box.h / ch)
  const scale = needed / cover
  // Nudge past the padding so subpixel rounding can't leave a dark hairline.
  return scale > 1.001 ? scale * 1.006 : 1
}

function rewind(video: HTMLVideoElement) {
  try {
    video.currentTime = 0
  } catch {
    /* seeking can throw before metadata is loaded */
  }
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  /** Mirror of `active` for event handlers, so a stale `ended` is ignored. */
  const activeRef = useRef(0)
  /** Slide whose clip has already been started from 0 in its current turn. */
  const startedRef = useRef<number | null>(null)
  const failedRef = useRef<Set<number>>(new Set())

  const [active, setActive] = useState(0)
  /** Clips may move. Reduced motion or a refused autoplay clears it for good. */
  const [playing, setPlaying] = useState(true)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [attached, setAttached] = useState<number[]>([])
  const [box, setBox] = useState({ w: 0, h: 0 })
  const reducedMotion = useReducedMotionSafe()

  useEffect(() => {
    activeRef.current = active
  }, [active])

  /* ── environment: viewport proximity, visibility, stage size ── */

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      setInView(true)
      return
    }
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '600px 0px' },
    )
    const viewObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    nearObserver.observe(el)
    viewObserver.observe(el)
    return () => {
      nearObserver.disconnect()
      viewObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState !== 'hidden')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => {
      const w = Math.round(el.clientWidth)
      const h = Math.round(el.clientHeight)
      if (w && h) setBox((b) => (b.w === w && b.h === h ? b : { w, h }))
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

  useEffect(() => {
    if (reducedMotion) setPlaying(false)
  }, [reducedMotion])

  // Once the hero is near: the active clip and the next one.
  useEffect(() => {
    if (!near) return
    setAttached((prev) => {
      const wanted = [active, (active + 1) % COUNT].filter((i) => !prev.includes(i))
      return wanted.length ? [...prev, ...wanted] : prev
    })
  }, [near, active])

  /* ── the cycle: one handler for every clip ─────────────────── */

  const handleVideoEnded = useCallback((index: number) => {
    // Only the clip on stage may advance the cycle, and only once.
    if (index !== activeRef.current) return
    activeRef.current = (index + 1) % COUNT
    setActive((current) => (current + 1) % COUNT)
  }, [])

  const handleVideoError = useCallback(
    (index: number) => {
      failedRef.current.add(index)
      // Skip a broken clip instead of stalling on it — unless none works.
      if (failedRef.current.size < COUNT) handleVideoEnded(index)
    },
    [handleVideoEnded],
  )

  /* ── playback ──────────────────────────────────────────────── */

  const motion = playing && inView && pageVisible

  useEffect(() => {
    const videos = videoRefs.current
    const next = (active + 1) % COUNT

    videos.forEach((video, i) => {
      if (!video || i === active) return
      // The outgoing clip stays on its current frame under the dissolve. The
      // next one is off stage, so it can be parked at frame 0 right away.
      video.pause()
      if (i === next) rewind(video)
    })

    const video = videos[active]
    if (!video) return

    if (failedRef.current.has(active) && failedRef.current.size < COUNT) {
      handleVideoEnded(active)
      return
    }

    // Each turn on stage starts from the top.
    if (startedRef.current !== active) {
      startedRef.current = active
      rewind(video)
    }

    if (!motion || !attached.includes(active)) {
      video.pause()
      return
    }

    video.muted = true
    let cancelled = false
    try {
      const p = video.play()
      if (p && typeof p.catch === 'function') {
        p.catch((err: unknown) => {
          // Autoplay refused (e.g. power saving): hold on the poster.
          if (!cancelled && err instanceof DOMException && err.name === 'NotAllowedError') {
            setPlaying(false)
          }
        })
      }
    } catch {
      /* element detached — nothing to do */
    }
    return () => {
      cancelled = true
    }
  }, [active, motion, attached, handleVideoEnded])

  return (
    <section ref={sectionRef} id="inicio" className="roulette on-dark">
      {/* The page's one h1, for assistive tech and search; the visible titles
          are the per-category h2s below. */}
      <h1 className="sr-only">MONITORINC — Seguridad electrónica y comunicación</h1>

      <div ref={stageRef} className="roulette__stage">
        {SOLUTION_SLIDES.map((slide, i) => {
          const isActive = i === active
          const hasClip = attached.includes(i)
          const scale = barCropScale(slide, box)
          return (
            <div
              key={slide.id}
              className={`roulette__slide${isActive ? ' is-active' : ''}`}
              aria-hidden={!isActive}
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el
                }}
                className="roulette__video"
                style={scale > 1 ? { transform: `scale(${scale.toFixed(4)})` } : undefined}
                src={hasClip ? slide.videoSrc : undefined}
                poster={near || i === 0 ? slide.posterSrc : undefined}
                preload={hasClip ? 'auto' : 'none'}
                muted
                playsInline
                disablePictureInPicture
                tabIndex={-1}
                aria-hidden="true"
                onEnded={() => handleVideoEnded(i)}
                onError={() => handleVideoError(i)}
              />
              <div className="roulette__overlay" aria-hidden="true" />

              <div className="container roulette__frame">
                <div className="roulette__main">
                  <h2 className="roulette__title">{slide.title}</h2>
                  <p className="roulette__sub">{slide.subtitle}</p>
                  <ul className="roulette__list">
                    {slide.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="roulette__cta">
        <div className="container">
          <div className="hero__actions">
            <AgendarDemoButton href="/contacto" label="Agenda una cita" />
            <AgendarDemoButton
              href="/soluciones"
              label="Ver soluciones"
              variant="secondary"
              arrow={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
