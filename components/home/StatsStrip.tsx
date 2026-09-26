'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * Editorial metrics band with a one-shot count-up.
 *
 * The server renders the final values, so no-JS visitors, crawlers and the
 * first paint all get real numbers. After hydration the band drops to 0 and
 * waits (it sits below the full-screen hero, so that reset is never seen);
 * the first time it scrolls into view the items fade up and each number
 * counts to its target in one requestAnimationFrame loop. The observer is
 * disconnected on that first hit, so scrolling back never replays it.
 *
 * prefers-reduced-motion, or no IntersectionObserver: nothing is reset, the
 * final values simply stay put.
 */

export type Stat = { value: number; label: string }

/** Count-up length per number. */
const COUNT_MS = 1800
/** Delay between items, for both the fade-up and the count. */
const STAGGER_MS = 140

/** Decelerating curve: quick start, long soft landing on the final value. */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

type Phase = 'static' | 'idle' | 'run'

export function StatsStrip({ stats }: { stats: Stat[] }) {
  const listRef = useRef<HTMLUListElement | null>(null)
  const [phase, setPhase] = useState<Phase>('static')
  const [shown, setShown] = useState<number[]>(() => stats.map((s) => s.value))

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    setPhase('idle')
    setShown(stats.map(() => 0))

    let raf = 0
    const run = () => {
      setPhase('run')
      const start = performance.now()
      const tick = (now: number) => {
        let done = true
        setShown(
          stats.map((s, i) => {
            const t = Math.min(1, Math.max(0, (now - start - i * STAGGER_MS) / COUNT_MS))
            if (t < 1) done = false
            return Math.round(s.value * easeOutCubic(t))
          }),
        )
        if (!done) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()
        run()
      },
      // Fire once the band is properly on screen, not on its first pixel.
      { threshold: 0.4, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(list)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [stats])

  return (
    <ul ref={listRef} className="stats" data-phase={phase}>
      {stats.map((s, i) => (
        <li key={s.label} className="stats__item" style={{ '--i': i } as CSSProperties}>
          {/* The ticking figure is hidden from assistive tech, which gets the
              final value once instead of a stream of intermediate numbers. */}
          <span className="stats__value" aria-hidden="true">
            <span className="stats__plus">+</span>
            {shown[i]}
          </span>
          <span className="sr-only">+{s.value}</span>
          <span className="stats__label">{s.label}</span>
        </li>
      ))}
    </ul>
  )
}
