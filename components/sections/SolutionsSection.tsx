import { SolutionsAccordionList } from '../solutions/SolutionsAccordionList'

/**
 * "Soluciones" — the opening section of /soluciones: eyebrow, the page's h1
 * "Tecnologías integrables", the intro line and the same eleven services as
 * /proyectos, grouped into the three categories the Home roulette introduces,
 * presented as accordions whose expanded panel carries a photographic
 * background. It used to sit on Home; the roulette stayed there as the teaser.
 */
export function SolutionsSection() {
  return (
    <section className="section" id="soluciones" aria-labelledby="tecnologias-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Soluciones</span>
          <h1 id="tecnologias-title" className="h2" style={{ marginTop: 16 }}>
            Tecnologías integrables
          </h1>
          <p className="lede" style={{ marginTop: 18 }}>
            Un proyecto especial combina las mismas soluciones que
            distribuimos e integramos, ajustadas al requerimiento.
          </p>
        </div>

        <SolutionsAccordionList withBackgrounds idPrefix="tec" />
      </div>
    </section>
  )
}
