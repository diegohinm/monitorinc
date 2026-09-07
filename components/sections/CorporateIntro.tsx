import { PDF_ABOUT } from '../../app/components/PdfContent'

/**
 * Corporate statement — moved here from /nosotros so it can sit on Home as
 * the bridge between "Atendemos a" and "01 — Qué hacemos".
 *
 * Copy comes straight from PDF_ABOUT, unchanged. Rendered as an h2 because
 * Home's single h1 belongs to the hero.
 */
export function CorporateIntro() {
  return (
    <section className="section section--tight" aria-labelledby="corporate-intro-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">MONITORINC</span>
          <h2 id="corporate-intro-title" className="h2" style={{ marginTop: 16 }}>
            Seguridad electrónica e integración <em>tecnológica.</em>
          </h2>
          <p className="lede" style={{ marginTop: 18 }}>{PDF_ABOUT.body}</p>
        </div>
      </div>
    </section>
  )
}
