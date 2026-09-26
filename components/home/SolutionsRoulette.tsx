'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { SOLUTION_SLIDES, type SolutionSlide } from '../../content/solutions'
import { useReducedMotionSafe } from '../hero/useReducedMotionSafe'

/**
 * Home "Soluciones" — editorial video storytelling, one full-bleed clip per
 * category (Seguridad, Automatización, Monitoreo) with a minimal text layer:
 * eyebrow, title, subtitle, a short list and a "01 / 03" index. Everything a
 * slide shows comes from SOLUTION_SLIDES (content/solutions.ts); the component
 * only decides which slide is active.
 *
 * The cycle is driven by the clips themselves: no loop, no timers. Every clip
 * shares one `onEnded` handler, so whichever slide is on stage hands over to
 * the next when its video finishes — 01 → 02 → 03 → 01 … indefinitely, each
 * clip for its real duration. Picking a slide starts that clip from 0 and the
 * cycle carries on from there.
 *
 * Slides are stacked in one fixed-height stage, so switching never reflows.
 * The incoming slide dissolves in on top of the outgoing one (whose clip is
 * paused on its current frame underneath), and its copy arrives with a short
 * fade + rise once the outgoing copy has gone. The progress line under the
 * index reads the active clip's currentTime / duration every frame.
 *
 * Loading: nothing is fetched until the section is about to enter the
 * viewport; then all posters, and the clips of the active and next slides.
 * Clips play only while the section is on screen and the tab is visible.
 * The pause control freezes the clip (and so the cycle). With reduced motion
 * everything starts paused on the posters. If autoplay is refused, the section
 * shows the poster with the play control; a clip that fails to load is skipped.
 */
const COUNT = SOLUTION_SLIDES.length
const TOTAL = String(COUNT).padStart(2, '0')

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

export function SolutionsRoulette() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const fillRef = useRef<HTMLSpanElement | null>(null)
  /** Mirror of `active` for event handlers, so a stale `ended` is ignored. */
  const activeRef = useRef(0)
  /** Slide whose clip has already been started from 0 in its current turn. */
  const startedRef = useRef<number | null>(null)
  const failedRef = useRef<Set<number>>(new Set())

  const [active, setActive] = useState(0)
  /** Clips move. The pause control (or a refused autoplay) clears it. */
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

  // Reduced motion only sets the initial state: the visitor can still opt in
  // through the play control.
  useEffect(() => {
    if (reducedMotion) setPlaying(false)
  }, [reducedMotion])

  // Once the section is near: the active clip and the next one.
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
          // Autoplay refused (e.g. power saving): show the play control.
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

  // Progress line: the active clip's real position, drawn every frame while
  // it plays and once whenever it stops.
  useEffect(() => {
    const fill = fillRef.current
    const video = videoRefs.current[active]
    if (!fill || !video) return
    let raf = 0
    const draw = () => {
      const d = video.duration
      const p = d && Number.isFinite(d) ? Math.min(1, video.currentTime / d) : 0
      fill.style.transform = `scaleX(${p.toFixed(4)})`
    }
    const loop = () => {
      draw()
      raf = window.requestAnimationFrame(loop)
    }
    if (motion) raf = window.requestAnimationFrame(loop)
    else draw()
    return () => window.cancelAnimationFrame(raf)
  }, [active, motion])

  /* ── input ─────────────────────────────────────────────────── */

  // Picking a slide starts that clip from 0; the cycle continues from it.
  const pick = (i: number) => {
    if (i !== active) {
      activeRef.current = i
      setActive(i)
    } else {
      const video = videoRefs.current[i]
      if (video) rewind(video)
    }
    if (!reducedMotion) setPlaying(true)
  }

  const togglePlaying = () => setPlaying((p) => !p)

  return (
    <section
      ref={sectionRef}
      className="roulette on-dark"
      aria-roledescription="carrusel"
      aria-label="Soluciones por categoría"
    >
      {/* Announce slide changes only while the cycle is not running. */}
      <div ref={stageRef} className="roulette__stage" aria-live={motion ? 'off' : 'polite'}>
        {SOLUTION_SLIDES.map((slide, i) => {
          const isActive = i === active
          const hasClip = attached.includes(i)
          const scale = barCropScale(slide, box)
          return (
            <div
              key={slide.id}
              className={`roulette__slide${isActive ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${COUNT}`}
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
                <span className="eyebrow roulette__eyebrow">{slide.index} — Soluciones</span>
                <div className="roulette__main">
                  <h2 className="roulette__title">{slide.title}</h2>
                  <p className="roulette__sub">{slide.subtitle}</p>
                  <ul className="roulette__list">
                    {slide.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <p className="roulette__index" aria-hidden="true">
                  <span className="roulette__index-now">{slide.index}</span> / {TOTAL}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="roulette__controls">
        <div className="container roulette__controls-inner">
          <div className="roulette__segs" role="group" aria-label="Elegir categoría">
            {SOLUTION_SLIDES.map((slide, i) => {
              const isActive = i === active
              return (
                <button
                  key={slide.id}
                  type="button"
                  className={`roulette__seg${isActive ? ' is-active' : ''}`}
                  aria-label={`Mostrar ${slide.title}`}
                  aria-pressed={isActive}
                  onClick={() => pick(i)}
                >
                  <span className="roulette__seg-track" aria-hidden="true">
                    {isActive && (
                      <span key={slide.id} ref={fillRef} className="roulette__seg-fill" />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="roulette__toggle"
            aria-label={playing ? 'Pausar presentación' : 'Reproducir presentación'}
            onClick={togglePlaying}
          >
            {playing ? (
              <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
                <rect x="1" y="1" width="3" height="8" rx="0.5" />
                <rect x="6" y="1" width="3" height="8" rx="0.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
                <path d="M2 1l7 4-7 4z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
