'use client'

import { useEffect, useRef } from 'react'

import { PDF_ABOUT } from '../../app/components/PdfContent'

/**
 * "01 — Qué hacemos" — editorial statement over a parallaxed photograph.
 *
 * The image sits in an oversized absolute layer (inset -12%) so it can slide
 * without ever exposing an edge. Movement is written straight to the node's
 * `transform` inside a rAF tick, never through React state, so scrolling does
 * not re-render the tree. An IntersectionObserver keeps the scroll listener's
 * work idle while the section is off-screen.
 *
 * `background-attachment: fixed` was avoided deliberately: it repaints badly
 * on desktop and is effectively broken on iOS Safari.
 *
 * `apply()` also runs on mount, so reloading mid-page starts at the right
 * offset instead of snapping on the first scroll.
 */

/**
 * Peak offset in each direction, so the image travels 2x these values across
 * the whole pass. Previously this held the *total* travel, which halved the
 * effective range and made the effect read as static.
 */
const MAX_DESKTOP = 65
const MAX_TABLET = 40
const MAX_MOBILE = 24
const MOBILE_MAX = 767

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const layerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const layer = layerRef.current
    if (!section || !layer) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const tabletQuery = window.matchMedia('(max-width: 1024px)')

    let frame = 0
    let visible = false

    const maxOffset = () => {
      if (motionQuery.matches) return 0
      if (mobileQuery.matches) return MAX_MOBILE
      return tabletQuery.matches ? MAX_TABLET : MAX_DESKTOP
    }

    const apply = () => {
      frame = 0
      const max = maxOffset()
      if (max === 0) {
        layer.style.transform = ''
        return
      }
      // Measured from the section's own centre against the viewport's, so the
      // offset is correct wherever the section sits in the document — not tied
      // to absolute scrollY.
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const distance = rect.top + rect.height / 2 - viewportHeight / 2
      // Roughly -0.5 .. +0.5 across a full pass.
      const progress = distance / (viewportHeight + rect.height)
      // Negated so the image lags behind the content: scrolling down slides it
      // down, scrolling up reverses it.
      const y = Math.min(Math.max(-progress * 2 * max, -max), max)
      layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (!visible || frame) return
      frame = window.requestAnimationFrame(apply)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) onScroll()
      },
      { rootMargin: '120px 0px' },
    )
    observer.observe(section)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    motionQuery.addEventListener('change', apply)
    apply()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      motionQuery.removeEventListener('change', apply)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="whatwedo on-dark"
      id="que-hacemos"
      aria-labelledby="whatwedo-title"
    >
      <div ref={layerRef} className="whatwedo__layer" aria-hidden="true" />
      <div className="whatwedo__overlay" aria-hidden="true" />

      <div className="container whatwedo__inner">
        <span className="eyebrow eyebrow--num whatwedo__eyebrow">01 — Qué hacemos</span>
        <h2 id="whatwedo-title" className="h2 whatwedo__title">
          Seguridad, acceso y monitoreo desde un solo <em>integrador.</em>
        </h2>
        <p className="whatwedo__body">{PDF_ABOUT.body}</p>
      </div>
    </section>
  )
}
