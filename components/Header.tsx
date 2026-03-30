'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AgendarDemoButton } from './ui/AgendarDemoButton'

/**
 * Header — exact clone of mazehq.com <header>
 *
 * Layout:  CSS Grid  1fr  auto  1fr  (logo | nav | button)
 * Scroll:  absolute → fixed, hide at header-height, reveal at 75vh
 * Mobile:  hamburger → overlay menu with scale animation
 */

const NAV_LINKS = [
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#contacto', label: 'Contacto' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollState, setScrollState] = useState<'top' | 'hidden' | 'fixed'>('top')
  const headerRef = useRef<HTMLElement>(null)

  // ── Scroll behaviour: hide after header height, reveal at 75vh ──
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const vh75 = window.innerHeight * 0.75
        const headerH = headerRef.current?.offsetHeight ?? 50

        if (y < headerH)       setScrollState('top')
        else if (y < vh75)     setScrollState('hidden')
        else                   setScrollState('fixed')

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Close menu on desktop resize ──
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = () => { if (mq.matches) setMenuOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Lock body scroll when menu open ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = useCallback(() => setMenuOpen(false), [])

  const headerCls = [
    's-header',
    scrollState === 'hidden' ? 's-header--hidden' : '',
    scrollState === 'fixed'  ? 's-header--fixed'  : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      <header ref={headerRef} className={headerCls}>
        <div className="s-header__wrap wrap">
          {/* Logo */}
          <a href="#inicio" className="s-header__logo" onClick={close}>
            MONITORINC
          </a>

          {/* Nav — centered via grid col 2 */}
          <ul className="s-header__nav">
            {NAV_LINKS.map((l, i) => (
              <li
                key={l.href}
                className="s-header__nav-item"
                style={{ '--nav-index': i + 1 } as React.CSSProperties}
              >
                <a href={l.href} className="s-header__nav-link">{l.label}</a>
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <div className="s-header__button">
            <AgendarDemoButton href="#contacto" />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={`s-header__toggle ${menuOpen ? 'is-active' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Dotted separator line */}
          <div className="s-header__underline dotted-line" />
        </div>
      </header>

      {/* Gradient overlay behind fixed header */}
      <div className={`s-header__bg ${scrollState === 'fixed' ? 's-header__bg--visible' : ''}`} />

      {/* Mobile menu */}
      <nav className={`s-menu ${menuOpen ? 's-menu--open' : ''}`}>
        <div className="s-menu__content">
          <ul className="s-menu__nav">
            {[{ href: '#inicio', label: 'Inicio' }, ...NAV_LINKS].map((l) => (
              <li key={l.href} className="s-menu__nav-item">
                <a href={l.href} className="s-menu__nav-link" onClick={close}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}
