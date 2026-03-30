'use client'

import { PDF_BRANDS } from '../../app/components/PdfContent'
import '../../app/components/Marquee.css'

/**
 * Partner-logos marquee — exact clone of ngrok.com's
 * `<section aria-label="Partner logos">` component.
 *
 * Structure: two identical <ul> lists inside a flex wrapper that
 * translates -50% to create a seamless infinite scroll.
 * Edge fade uses CSS mask-image (not pseudo-elements).
 */

const LOGO_GAP = 50   // px between items
const LOGO_H   = 48   // px height per item
const SPEED    = 30    // px/s — adjust to taste

export function BrandsMarquee() {
  const items = PDF_BRANDS?.list
  if (!items?.length) return null

  // Duration = total track width / speed.
  // Track width ≈ items × (avg item width + gap). We approximate with
  // a per-item estimate; the actual width doesn't matter because the
  // animation translates -50% of the doubled flex container.
  const duration = (items.length * (140 + LOGO_GAP)) / SPEED

  return (
    <div
      className="m-marquee"
      style={{
        '--logoloop-gap': `${LOGO_GAP}px`,
        '--logoloop-logoHeight': `${LOGO_H}px`,
        '--logoloop-duration': `${duration}s`,
      } as React.CSSProperties}
    >
      <section aria-label="Partner logos" className="m-marquee__section">
        <div className="m-marquee__track">
          {/* First list — visible to assistive tech */}
          <ul className="m-marquee__list" aria-hidden="false">
            {items.map((name) => (
              <li key={name} className="m-marquee__item">
                {name}
              </li>
            ))}
          </ul>

          {/* Duplicate for seamless loop — hidden from a11y */}
          <ul className="m-marquee__list" aria-hidden="true">
            {items.map((name) => (
              <li key={name} className="m-marquee__item">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
