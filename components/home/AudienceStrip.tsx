/**
 * MONITORINC "Atendemos a" band — editorial label plus four audience icons.
 *
 * Server Component: static markup, no interaction. The icons are local SVGs
 * loaded with a plain <img>, decorative only (`alt=""` + `aria-hidden`), since
 * the visible label already names each audience.
 *
 * Each item now links into its section on /sectores, so this band doubles as
 * the Home teaser for that page — no separate teaser block needed.
 */

import Link from 'next/link'

import { SECTORS } from '../../content/site'

export function AudienceStrip() {
  return (
    <section className="audience" aria-labelledby="audience-label">
      <div className="container audience__inner">
        <h2 className="audience__label" id="audience-label">Atendemos a</h2>

        <ul className="audience__items">
          {SECTORS.map((s) => (
            <li className="audience__item" key={s.slug}>
              <Link className="audience__link" href={`/sectores#${s.slug}`}>
                <span className="audience__icon">
                  <img src={s.icon} alt="" aria-hidden="true" width={32} height={32} />
                </span>
                <span className="audience__text">{s.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
