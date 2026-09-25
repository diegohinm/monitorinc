import { SolutionsAccordionList } from '../solutions/SolutionsAccordionList'

/**
 * "Tecnologías integrables" on Home — the same eleven services as
 * /proyectos, but presented as accordions whose expanded panel carries a
 * photographic background.
 */
export function IntegrableTechnologiesSection() {
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

        <SolutionsAccordionList withBackgrounds idPrefix="tec" />
      </div>
    </section>
  )
}
