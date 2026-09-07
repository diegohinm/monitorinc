import { SolutionsAccordionList } from '../solutions/SolutionsAccordionList'

/**
 * "02 — Soluciones" on /proyectos. Shares its data and accordion behaviour
 * with the Home "Tecnologías integrables" band via SolutionsAccordionList;
 * this variant renders plain panels, without photographic backgrounds.
 */
export function SolutionsAccordion() {
  return (
    <section className="section" id="soluciones" aria-labelledby="soluciones-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--num">02 — Soluciones</span>
          <h2 id="soluciones-title" className="h2">
            Un portafolio completo para seguridad y <em>monitoreo.</em>
          </h2>
        </div>

        <SolutionsAccordionList idPrefix="sol" />
      </div>
    </section>
  )
}
