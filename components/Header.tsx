'use client'

import { useState, useEffect, useCallback } from 'react'

const NAV_LINKS = [
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#contacto', label: 'Contacto' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  // Close menu on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)')
    const handler = () => { if (mq.matches) setOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  return (
    <header className="s-header">
      <div className="wrap s-header__inner">
        {/* Logo — always left */}
        <a href="#inicio" className="s-header__logo" onClick={close}>
          MONITORINC
        </a>

        {/* Desktop nav — centered */}
        <nav className="s-header__desktop-nav">
          <ul className="s-header__nav">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA — right */}
        <a href="#contacto" className="a-button a-button--secondary s-header__cta">
          Agendar Demo
        </a>

        {/* Mobile hamburger */}
        <button
          className="s-header__burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <span className={`s-header__burger-line ${open ? 's-header__burger-line--open' : ''}`} />
        </button>
      </div>

      {/* Mobile overlay menu */}
      <div className={`s-header__mobile ${open ? 's-header__mobile--open' : ''}`}>
        <nav>
          <ul className="s-header__mobile-nav">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={close}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href="#contacto"
          className="a-button a-button--secondary"
          onClick={close}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Agendar Demo
        </a>
      </div>
    </header>
  )
}
