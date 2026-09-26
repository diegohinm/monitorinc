'use client'

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react'

import { SOLUTION_SLIDES, type SolutionSlide } from '../../content/solutions'
import { useReducedMotionSafe } from '../hero/useReducedMotionSafe'

/**
 * Home "Soluciones" — editorial video storytelling, one full-bleed clip per
 * category (Seguridad, Automatización, Monitoreo) with a minimal text layer:
 * eyebrow, title, subtitle, a short list and a "01 / 03" index. Everything a
 * slide shows comes from SOLUTION_SLIDES (content/solutions.ts); the component
 * only decides which slide is active.
 *
 * Slides are stacked in one fixed-height stage, so switching never reflows.
 * The incoming slide dissolves in on top of the outgoing one (whose clip keeps
 * playing underneath until the fade ends, then parks at frame 0), and its
 * copy arrives with a short fade + rise once the outgoing copy has gone.
 *
 * Loading: nothing is fetched until the section is about to enter the
 * viewport; then all posters, and the clips of the active and next slides.
 * A slide keeps its clip once attached. Clips play only while the section is
 * on screen and the tab is visible.
 *
 * Rotation (every INTERVAL_MS, shown by the progress line under the index
 * controls) follows the APG carousel pattern: it pauses while a real mouse
 * hovers the block or keyboard focus is inside it — the progress line freezes
 * and later resumes where it stopped —, stops for good once the visitor picks
 * a slide, and the pause control freezes both the rotation and the clips. An
 * explicit "Reproducir" overrides the hover/focus pause. With reduced motion
 * everything starts paused on the posters.
 */
const INTERVAL_MS = 6000
/** Must match the `.roulette__slide.is-active` opacity transition in globals.css. */
const FADE_MS = 500
const COUNT = SOLUTION_SLIDES.length
const TOTAL = String(COUNT).padStart(2, '0')

/**
 * Extra zoom (on top of `object-fit: cover`) that pushes a clip's baked-in
 * bars out of a box of the given size. 1 when there is nothing to hide or
 * `cover` already crops the bars away on its own.
 */
function barCropScale(slide: SolutionSlide, box: { w: number; h: number }) {
  if (!slide.crop || !box.w || !box.h) return 1
  const [fw, fh] = slide.crop.frame
  const [cw, ch] = slide.crop.content
  const cover = Math.max(box.w / fw, box.h / fh)
  const needed = Math.max(box.w / cw, box.h / ch)
  const scale = needed / cover
  // Nudge past the bars so subpixel rounding can't leave a dark hairline.
  return scale > 1.001 ? scale * 1.006 : 1
}

function safePlay(video: HTMLVideoElement | null) {
  if (!video) return
  video.muted = true
  try {
    const p = video.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  } catch {
    /* autoplay blocked or element detached — the poster stays visible */
  }
}

export function SolutionsRoulette() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  // Time left on the current slide, so a hover/focus pause resumes the
  // countdown (and the progress line) where it stopped instead of restarting.
  const remainingRef = useRef(INTERVAL_MS)
  const startedAtRef = useRef(0)

  const [active, setActive] = useState(0)
  /** Clips move and rotation is allowed. The pause control clears it. */
  const [playing, setPlaying] = useState(true)
  /** Automatic advance. Picking a slide clears it for good. */
  const [autoRotate, setAutoRotate] = useState(true)
  /** An explicit "Reproducir" overrides the hover/focus pause (APG). */
  const [userStarted, setUserStarted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [attached, setAttached] = useState<number[]>([])
  const [box, setBox] = useState({ w: 0, h: 0 })
  const reducedMotion = useReducedMotionSafe()

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
    if (reducedMotion) {
      setPlaying(false)
      setUserStarted(false)
    }
  }, [reducedMotion])

  // Once the section is near: the active clip and the next one.
  useEffect(() => {
    if (!near) return
    setAttached((prev) => {
      const wanted = [active, (active + 1) % COUNT].filter((i) => !prev.includes(i))
      return wanted.length ? [...prev, ...wanted] : prev
    })
  }, [near, active])

  /* ── rotation ──────────────────────────────────────────────── */

  const rotating =
    playing && autoRotate && inView && pageVisible && (userStarted || (!hovered && !focused))

  // A new slide gets the full interval. Declared before the timer effect so
  // it runs first when `active` changes.
  useEffect(() => {
    remainingRef.current = INTERVAL_MS
  }, [active])

  useEffect(() => {
    if (!rotating) return
    startedAtRef.current = performance.now()
    const id = window.setTimeout(() => setActive((i) => (i + 1) % COUNT), remainingRef.current)
    return () => {
      window.clearTimeout(id)
      const elapsed = performance.now() - startedAtRef.current
      remainingRef.current = Math.max(0, remainingRef.current - elapsed)
    }
  }, [rotating, active])

  /* ── playback ──────────────────────────────────────────────── */

  const motion = playing && inView && pageVisible

  useEffect(() => {
    const timers: number[] = []
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active) {
        if (motion) safePlay(video)
        else video.pause()
        return
      }
      // Let the outgoing clip run under the dissolve, then park it at frame 0
      // so it starts from the top the next time it comes round.
      timers.push(
        window.setTimeout(() => {
          video.pause()
          try {
            video.currentTime = 0
          } catch {
            /* seeking can throw before metadata is loaded */
          }
        }, FADE_MS + 100),
      )
    })
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [active, motion, attached])

  /* ── input ─────────────────────────────────────────────────── */

  // Only a real pointer that can hover pauses the rotation. A touch tap emits
  // emulated mouse events but never a matching leave, which would freeze it.
  const onPointerEnter = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'touch') setHovered(true)
  }
  const onPointerLeave = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'touch') setHovered(false)
  }
  // Keyboard focus pauses; focus left behind by a click or tap does not.
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).matches(':focus-visible')) setFocused(true)
  }
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
  }

  // Picking a slide is an explicit choice, so the rotation stops there.
  const pick = (i: number) => {
    setActive(i)
    setAutoRotate(false)
    setUserStarted(false)
  }

  const togglePlaying = () => {
    if (playing) {
      setPlaying(false)
      setUserStarted(false)
      return
    }
    remainingRef.current = INTERVAL_MS
    setPlaying(true)
    setAutoRotate(true)
    setUserStarted(true)
  }

  // The progress line animates while rotation is on (frozen during a pause)
  // and shows as a solid marker once rotation is off.
  const showProgress = playing && autoRotate

  return (
    <section
      ref={sectionRef}
      className="roulette on-dark"
      aria-roledescription="carrusel"
      aria-label="Soluciones por categoría"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {/* Announce slide changes only when the visitor drives them. */}
      <div ref={stageRef} className="roulette__stage" aria-live={rotating ? 'off' : 'polite'}>
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
                loop
                playsInline
                disablePictureInPicture
                tabIndex={-1}
                aria-hidden="true"
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
                      <span
                        // Remount per slide and per mode so the line restarts
                        // exactly when the countdown does.
                        key={`${slide.id}-${showProgress ? 'run' : 'idle'}`}
                        className={`roulette__seg-fill${showProgress ? ' is-running' : ''}`}
                        style={
                          showProgress
                            ? {
                                animationDuration: `${INTERVAL_MS}ms`,
                                animationPlayState: rotating ? 'running' : 'paused',
                              }
                            : undefined
                        }
                      />
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
