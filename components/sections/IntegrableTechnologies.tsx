import { PDF_SERVICES } from '../../app/components/PdfContent'
import { AgendarDemoButton } from '../ui/AgendarDemoButton'

/**
 * "Tecnologías integrables" — moved here from /proyectos so it can live on
 * Home directly under "01 — Qué hacemos". Markup and copy are unchanged;
 * only the anchor id was added so links can reach it.
 */

/* Technologies MONITORINC already lists as part of its own offering. */
const INTEGRABLE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export function IntegrableTechnologies() {
  return (
    <section
      className="section section--tight"
      id="tecnologias-integrables"
      aria-labelledby="tecnologias-title"
    >
      <div className="container">
        <div className="section-head">
          <h2 id="tecnologias-title" className="h2">Tecnologías integrables</h2>
          <p className="lede">
            Un proyecto especial combina las mismas soluciones que
            distribuimos e integramos, ajustadas al requerimiento.
          </p>
        </div>
        <div className="svc-group">
          {INTEGRABLE.map((si, ii) => {
            const svc = PDF_SERVICES[si]
            return (
              <article className="svc-row" key={svc.title}>
                <div className="svc-row__num">{String(ii + 1).padStart(2, '0')}</div>
                <h3 className="svc-row__title">{svc.title}</h3>
                <p className="svc-row__desc">{svc.desc}</p>
              </article>
            )
          })}
        </div>
        <AgendarDemoButton
          href="/contacto"
          label="Hablemos de tu proyecto"
          style={{ marginTop: 32 }}
        />
      </div>
    </section>
  )
}
