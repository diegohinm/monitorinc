'use client'

import { PDF_BRANDS } from '../../app/components/PdfContent'

export function BrandsMarquee() {
  if (!PDF_BRANDS?.list?.length) return null

  return (
    <div
      aria-label="Marcas"
      style={{
        marginTop: 18,
        width: 'min(760px, 100%)',
        border: '1px solid rgba(242, 244, 245, 0.12)',
        borderRadius: 10,
        background: 'rgba(242, 244, 245, 0.02)',
        overflow: 'hidden',
      }}
    >
      <div className="m-marquee">
        <div className="m-marquee__track">
          {[...PDF_BRANDS.list, ...PDF_BRANDS.list].map((name, i) => (
            <span key={name + i} className="m-marquee__item">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
