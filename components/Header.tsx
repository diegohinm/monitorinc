'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AgendarDemoButton } from './ui/AgendarDemoButton'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/sectores', label: 'Sectores' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = useCallback(() => setMenuOpen(false), [])
  const pathname = usePathname()
  // Active state is driven by pathname only, so a hash such as
  // /proyectos#soluciones still marks "Proyectos", never "Home".
  const isActive = (href: string) => !href.includes('#') && pathname === href

  // Close menu when viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)')
    const handler = () => { if (mq.matches) setMenuOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Lock body scroll while the mobile menu is open. The body class is also how
  // the floating WhatsApp button (a separate component) knows to get out of
  // the way — see .wa-fab in globals.css.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    document.body.classList.toggle('has-mobile-menu', menuOpen)
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('has-mobile-menu')
    }
  }, [menuOpen])

  // Escape closes the menu.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    /* The panel is a sibling of <header>, never a child: the header carries a
       backdrop-filter, which makes it the containing block for any
       position:fixed descendant — that is what previously collapsed the menu
       to the header's own height and spilled the links over the hero. */
    <>
      <header className="header">
        <div className="container header__inner">
          <Link href="/" className="brand" onClick={close} aria-label="MONITORINC — inicio">
            {/* `unoptimized` serves the SVG straight from /public: the image
                optimizer refuses SVG unless `dangerouslyAllowSVG` is enabled
                globally, and a vector logo gains nothing from raster resizing.
                Height comes from CSS with width:auto, so the intrinsic ratio
                always wins and the mark can never be stretched. */}
            <Image
              src="/logos/monitorinc-logo-horizontal.svg"
              alt="MONITORINC"
              width={168}
              height={36}
              priority
              unoptimized
              className="brand__logo"
            />
          </Link>

          <nav className="nav" aria-label="Principal">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav__link${isActive(l.href) ? ' is-active' : ''}`}
                aria-current={isActive(l.href) ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="header__cta">
            <AgendarDemoButton href="/contacto" />
          </div>

          <button
            className={`header__toggle ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <nav
        id="mobile-navigation"
          className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
          aria-label="Principal (móvil)"
          aria-hidden={!menuOpen}
        >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`mobile-menu__link${isActive(l.href) ? ' is-active' : ''}`}
            aria-current={isActive(l.href) ? 'page' : undefined}
            onClick={close}
          >
            {l.label}
          </Link>
        ))}
        <AgendarDemoButton href="/contacto" className="mobile-menu__cta" onClick={close} />
      </nav>
    </>
    )
  }
