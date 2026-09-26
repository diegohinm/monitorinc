'use client'

import { useEffect, useState, type FocusEvent, type PointerEvent } from 'react'

import { CATEGORY_BACKGROUNDS, SOLUTION_CATEGORIES } from '../../content/solutions'
import { useReducedMotionSafe } from '../hero/useReducedMotionSafe'

/**
 * Auto-rotating visual introduction to the three solution categories, placed
 * right above the "Soluciones" section on Home.
 *
 * Slides are stacked in one fixed-height stage and cross-fade (opacity plus a
 * very slight scale), so the block never changes height and every background
 * is in the DOM from the first paint — the first rotation cannot flash.
 *
 * Titles, subtitles and images come from content/solutions.ts, the same
 * source the accordion below reads, so the two can never drift apart.
 *
 * Rotation (every INTERVAL_MS) follows the APG carousel pattern: it pauses
 * while a real mouse hovers the block or keyboard focus is inside it, stops
 * for good once the visitor picks a slide, can be paused/resumed with the
 * small control next to the dots, starts paused when the OS asks for reduced
 * motion, and skips ticks while the tab is hidden.
 */
const INTERVAL_MS = 5000

export function SolutionsRoulette() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const reducedMotion = useReducedMotionSafe()
  const count = SOLUTION_CATEGORIES.length

  // Reduced motion only sets the initial state: the visitor can still opt in
  // through the play control.
  useEffect(() => {
    if (reducedMotion) setPlaying(false)
  }, [reducedMotion])

  const rotating = playing && !hovered && !focused

  useEffect(() => {
    if (!rotating) return
    const id = window.setInterval(() => {
      if (document.hidden) return
      setActive((i) => (i + 1) % count)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
    // `active` is a dependency on purpose: any change restarts the countdown.
  }, [rotating, active, count])

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
    setPlaying(false)
  }

  return (
    <section
      className="roulette on-dark"
      aria-roledescription="carrusel"
      aria-label="Soluciones por categoría"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {/* Announce slide changes only when the visitor drives them. */}
      <div className="roulette__stage" aria-live={rotating ? 'off' : 'polite'}>
        {SOLUTION_CATEGORIES.map((category, i) => {
          const isActive = i === active
          const image = CATEGORY_BACKGROUNDS[category.key]
          return (
            <div
              key={category.key}
              className={`roulette__slide${isActive ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${count}`}
              aria-hidden={!isActive}
            >
              <div
                className="roulette__image"
                style={image ? { backgroundImage: `url(${image})` } : undefined}
                aria-hidden="true"
              />
              <div className="roulette__overlay" aria-hidden="true" />

              <div className="container roulette__content">
                <div className="roulette__text">
                  <h2 className="roulette__title">{category.title}</h2>
                  <p className="roulette__sub">{category.hint}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="roulette__dots">
        <div className="container roulette__dots-inner" role="group" aria-label="Elegir categoría">
          {SOLUTION_CATEGORIES.map((category, i) => (
            <button
              key={category.key}
              type="button"
              className={`roulette__dot${i === active ? ' is-active' : ''}`}
              aria-label={`Mostrar ${category.title}`}
              aria-pressed={i === active}
              onClick={() => pick(i)}
            />
          ))}
          <button
            type="button"
            className="roulette__toggle"
            aria-label={playing ? 'Pausar rotación' : 'Reanudar rotación'}
            onClick={() => setPlaying((p) => !p)}
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
