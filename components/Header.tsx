'use client'

import { useState, useEffect, useCallback } from 'react'
import { AgendarDemoButton } from './ui/AgendarDemoButton'

const NAV_LINKS = [
  { href: '#soluciones', label: 'Soluciones' },
  { href: '#sectores', label: 'Sectores' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#contacto', label: 'Contacto' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = useCallback(() => setMenuOpen(false), [])

  // Close menu when viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)')
    const handler = () => { if (mq.matches) setMenuOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#inicio" className="brand" onClick={close} aria-label="MONITORINC — inicio">
          <span className="brand__mark" aria-hidden="true" />
          MONITORINC
        </a>

        <nav className="nav" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav__link">{l.label}</a>
          ))}
        </nav>

        <div className="header__cta">
          <AgendarDemoButton href="#contacto" />
        </div>

        <button
          className={`header__toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="mobile-menu__link" onClick={close}>
            {l.label}
          </a>
        ))}
        <AgendarDemoButton href="#contacto" className="mobile-menu__cta" />
      </div>
    </header>
  )
}
