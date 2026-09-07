import Link from 'next/link'
import Image from 'next/image'

import { CONTACT } from '../../config/contact'
import { telHref, mailtoHref } from '../../lib/whatsapp'
import { SECTORS } from '../../content/site'

/**
 * Global footer, rendered from app/layout.js so every route shares it.
 *
 * The brand lockup uses the same SVG as the header — its `-dark` variant,
 * which only re-colours the grey areas so the wordmark keeps contrast on the
 * dark footer. Geometry is identical; no wordmark is rebuilt in HTML.
 */

/* Inline outline glyphs — no icon package is installed and nothing is
   hotlinked. They inherit `currentColor` so the footer controls the tint. */
const SOCIALS = [
  {
    net: 'instagram',
    label: 'Instagram de MONITORINC',
    href: 'https://www.instagram.com/monitorinc_/',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    net: 'facebook',
    label: 'Facebook de MONITORINC',
    href: 'https://www.facebook.com/MONITORINC',
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
]

const SOLUTION_LINKS = [
  'CCTV y grabación',
  'Control de acceso',
  'Alarmas de intrusión',
  'Seguridad perimetral',
  'GPS y drones',
]

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <Link href="/" className="footer__brand" aria-label="MONITORINC — inicio">
              <Image
                src="/logos/monitorinc-logo-horizontal-dark.svg"
                alt="MONITORINC"
                width={187}
                height={40}
                unoptimized
                className="footer__logo"
              />
            </Link>
            <p className="footer__desc">
              Distribuimos e integramos equipos de seguridad electrónica y de
              comunicación para hacer de cada lugar un espacio más seguro.
            </p>

            <div className="footer__follow">
              <span className="footer__social-label">Síguenos</span>
              <div className="footer__social">
                {SOCIALS.map((s) => (
                  <a
                    key={s.net}
                    href={s.href}
                    data-net={s.net}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer__col">
            <h4>Soluciones</h4>
            <ul>
              {SOLUTION_LINKS.map((label) => (
                <li key={label}>
                  <Link href="/proyectos#soluciones">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Sectores</h4>
            <ul>
              {SECTORS.map((s) => (
                <li key={s.slug}>
                  <Link href={`/sectores#${s.slug}`}>{s.title}</Link>
                </li>
              ))}
              <li><Link href="/proyectos">Proyectos especiales</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contacto</h4>
            <ul>
              <li><a href={telHref(CONTACT.whatsappPrimary.digits)}>{CONTACT.whatsappPrimary.label}</a></li>
              {CONTACT.phoneSecondary && (
                <li><a href={telHref(CONTACT.phoneSecondary.digits)}>{CONTACT.phoneSecondary.label}</a></li>
              )}
              <li><a href={mailtoHref()}>{CONTACT.emailPrimary}</a></li>
              <li><a href={CONTACT.website.url} target="_blank" rel="noreferrer">{CONTACT.website.label}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 MONITORINC. Seguridad electrónica y comunicación.</span>
          <span>Colombia</span>
        </div>
      </div>
    </footer>
  )
}
