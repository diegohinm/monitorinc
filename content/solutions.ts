/**
 * The eleven MONITORINC services, grouped into the three categories used by
 * both the Home "Tecnologías integrables" band and the /proyectos
 * "02 — Soluciones" section.
 *
 * Single source of truth so the two never drift apart. `index` points into
 * PDF_SERVICES, so titles and descriptions are never restated here.
 */

export type CategoryKey = 'security' | 'automation' | 'monitoring'

/**
 * One photograph per category, shared by every item inside it — the panel
 * background is resolved from the item's category, never repeated per item.
 *
 * `automation` is a TEMPORARY placeholder: the project has no image of access
 * control, door automation or home automation. It currently points at a
 * MONITORINC building/installation photo, which reads as "building systems"
 * but is not a real automation shot. Drop a proper file at this same path to
 * replace it — no code change needed.
 */
// Partial on purpose: drop a category here and its panels fall back to the
// plain text style, with no type error and no broken image.
export const CATEGORY_BACKGROUNDS: Partial<Record<CategoryKey, string>> = {
  security: '/images/solutions/cctv-camera.png',
  automation: '/images/technologies/automation-bg.png',
  monitoring: '/images/technologies/monitoring-bg.png',
}

export type SolutionItem = {
  /** Index into PDF_SERVICES. */
  index: number
}

export type SolutionCategory = {
  slug: string
  key: CategoryKey
  title: string
  hint: string
  items: SolutionItem[]
}

export const SOLUTION_CATEGORIES: SolutionCategory[] = [
  {
    slug: 'seguridad',
    key: 'security',
    title: 'Seguridad',
    hint: 'Vigilancia, intrusión y protección perimetral',
    items: [
      { index: 0 }, // CCTV y grabación
      { index: 2 }, // Alarmas de intrusión
      { index: 3 }, // Seguridad perimetral
      { index: 4 }, // Detección de incendios
    ],
  },
  {
    slug: 'automatizacion',
    key: 'automation',
    title: 'Automatización',
    hint: 'Acceso, puertas y hogar inteligente',
    items: [
      { index: 1 }, // Control de acceso
      { index: 8 }, // Citofonía y videocitofonía
      { index: 6 }, // Automatización de puertas
      { index: 7 }, // Domótica
    ],
  },
  {
    slug: 'monitoreo',
    key: 'monitoring',
    title: 'Monitoreo',
    hint: 'Rastreo, drones e ingeniería especial',
    items: [
      { index: 5 },  // GPS
      { index: 9 },  // Drones
      { index: 10 }, // Proyectos especiales
    ],
  },
]

/** Running 01–11 across the categories, so numbering never restarts. */
export function solutionNumber(categoryIndex: number, itemIndex: number) {
  let n = 0
  for (let c = 0; c < categoryIndex; c++) n += SOLUTION_CATEGORIES[c].items.length
  return String(n + itemIndex + 1).padStart(2, '0')
}
