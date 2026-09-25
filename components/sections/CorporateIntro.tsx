import { PDF_ABOUT } from '../../app/components/PdfContent'

/**
 * Corporate statement — the first section of /nosotros, right after the
 * global header. It used to sit on Home between "Atendemos a" and
 * "01 — Qué hacemos"; the markup and copy are the same, only the location
 * changed.
 *
 * Copy comes straight from PDF_ABOUT, unchanged. The title is the page's
 * only h1 and keeps the `h2` class so it looks exactly as it did on Home.
 * `page-intro` is the inner pages' opening-section rhythm: full top padding,
 * no bottom padding, so the next section supplies the gap.
 */
export function CorporateIntro() {
  return (
    <section className="section page-intro" aria-labelledby="corporate-intro-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">MONITORINC</span>
          <h1 id="corporate-intro-title" className="h2" style={{ marginTop: 16 }}>
            Seguridad electrónica e integración <em>tecnológica.</em>
          </h1>
          <p className="lede" style={{ marginTop: 18 }}>{PDF_ABOUT.body}</p>
        </div>
      </div>
    </section>
  )
}
