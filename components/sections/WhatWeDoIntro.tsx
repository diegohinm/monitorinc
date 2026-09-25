import { PDF_ABOUT } from '../../app/components/PdfContent'

/**
 * "01 — Qué hacemos" as an editorial statement on /nosotros, between the
 * corporate intro and "Cómo trabajamos". The copy used to sit over the
 * parallax photograph on Home (components/home/WhatWeDo), which now renders
 * the image alone. Eyebrow and title are the same strings; the paragraph
 * comes straight from PDF_ABOUT, unchanged.
 *
 * Nothing follows the head inside this section, so its default bottom margin
 * is zeroed and the next section's own padding supplies the gap.
 */
export function WhatWeDoIntro() {
  return (
    <section className="section section--tight" aria-labelledby="whatwedo-title">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 0 }}>
          <span className="eyebrow eyebrow--num">01 — Qué hacemos</span>
          <h2 id="whatwedo-title" className="h2" style={{ marginTop: 16 }}>
            Seguridad, acceso y monitoreo desde un solo <em>integrador.</em>
          </h2>
          <p className="lede" style={{ marginTop: 18 }}>{PDF_ABOUT.body}</p>
        </div>
      </div>
    </section>
  )
}
