import Link from 'next/link'
import Image from 'next/image'

import { CONTACT } from '../../config/contact'
import { telHref } from '../../lib/whatsapp'
import { SECTORS } from '../../content/site'

/**
 * Global footer, rendered from app/layout.js so every route shares it.
 *
 * The brand lockup uses the same SVG as the header — its `-dark` variant,
 * which only re-colours the grey areas so the wordmark keeps contrast on the
 * dark footer. Geometry is identical; no wordmark is rebuilt in HTML.
 */

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
          </div>

          <div className="footer__col">
            <h4>Soluciones</h4>
            <ul>
              {SOLUTION_LINKS.map((label) => (
                <li key={label}>
                  <Link href="/#soluciones">{label}</Link>
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
              <li><a href={telHref(CONTACT.phoneSecondary.digits)}>{CONTACT.phoneSecondary.label}</a></li>
              <li><a href={`mailto:${CONTACT.emailPrimary}`}>{CONTACT.emailPrimary}</a></li>
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
