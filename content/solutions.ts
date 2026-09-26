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
  security: '/images/tech-back.png',
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

/**
 * Home "Soluciones" video storytelling — one slide per category, in the same
 * order and with the same keys as SOLUTION_CATEGORIES. Everything a slide
 * shows (index, title, subtitle, short list, clip and its still) lives here,
 * so the component only renders whichever slide is active.
 *
 * `bullets` is editorial shorthand for the Home, not the service titles of
 * the accordion (those stay in PDF_SERVICES).
 */
export type SolutionSlide = {
  id: CategoryKey
  index: string
  title: string
  subtitle: string
  bullets: string[]
  videoSrc: string
  posterSrc: string
  /**
   * Only for a clip whose real picture does not fill its frame (black bars or
   * padding baked into the pixels): the encoded frame and the centred picture
   * inside it, in px. `object-fit: cover` treats the padding as picture, so
   * the player zooms just enough to push it out of the box.
   */
  crop?: { frame: [number, number]; content: [number, number] }
}

export const SOLUTION_SLIDES: SolutionSlide[] = [
  {
    id: 'security',
    index: '01',
    title: 'Seguridad',
    subtitle: 'Vigilancia, intrusión y protección perimetral.',
    bullets: [
      'CCTV y grabación',
      'Alarmas de intrusión',
      'Seguridad perimetral',
      'Detección de incendios',
    ],
    videoSrc: '/videos/security-monitorinc.mp4',
    posterSrc: '/images/security-monitorinc.jpg',
    // The real picture is a 406×228 window centred in the 1280×720 frame —
    // black bars above and below it, a blurred copy on either side (a vertical
    // 360×640 phone clip re-exported into 16:9). Zooming to that window is the
    // only way to show it full-bleed, and it will look soft until the clip is
    // re-exported from the original footage at full frame; then drop `crop`.
    crop: { frame: [1280, 720], content: [406, 228] },
  },
  {
    id: 'automation',
    index: '02',
    title: 'Automatización',
    subtitle: 'Acceso, puertas y hogar inteligente.',
    bullets: [
      'Control de acceso',
      'Citofonía',
      'Automatización de puertas',
      'Domótica',
    ],
    videoSrc: '/videos/automation-monitorinc.mp4',
    posterSrc: '/images/automation-monitorinc.jpg',
  },
  {
    id: 'monitoring',
    index: '03',
    title: 'Monitoreo',
    subtitle: 'Rastreo, drones e ingeniería especial.',
    bullets: [
      'GPS y rastreo',
      'Drones',
      'Monitoreo remoto',
      'Proyectos especiales',
    ],
    videoSrc: '/videos/monitoring-monitorinc.mp4',
    posterSrc: '/images/monitoring-monitorinc.jpg',
    // 1280×576 picture letterboxed into a 1280×720 frame: 72 px of black
    // above and below, measured off decoded frames and the poster.
    crop: { frame: [1280, 720], content: [1280, 576] },
  },
]

/** Running 01–11 across the categories, so numbering never restarts. */
export function solutionNumber(categoryIndex: number, itemIndex: number) {
  let n = 0
  for (let c = 0; c < categoryIndex; c++) n += SOLUTION_CATEGORIES[c].items.length
  return String(n + itemIndex + 1).padStart(2, '0')
}
