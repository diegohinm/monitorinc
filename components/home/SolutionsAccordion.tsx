'use client'

import { useState } from 'react'
import Link from 'next/link'

import { PDF_SERVICES } from '../../app/components/PdfContent'

/**
 * "02 — Soluciones" — the eleven services grouped into three categories, each
 * row an accordion that starts closed.
 *
 * Every category keeps its own open row, so opening something under
 * Automatización does not collapse what the visitor left open under Seguridad.
 *
 * Copy is read straight from PDF_SERVICES; `index` points into that array, so
 * the descriptions are never restated here.
 */

type Category = {
  slug: string
  title: string
  hint: string
  /** Indices into PDF_SERVICES, in display order. */
  indices: number[]
}

const CATEGORIES: Category[] = [
  {
    slug: 'seguridad',
    title: 'Seguridad',
    hint: 'Vigilancia, intrusión y protección perimetral',
    // CCTV · alarmas de intrusión · perimetral · incendios
    indices: [0, 2, 3, 4],
  },
  {
    slug: 'automatizacion',
    title: 'Automatización',
    hint: 'Puertas y hogar inteligente',
    // control de acceso · citofonía · puertas · domótica
    indices: [1, 8, 6, 7],
  },
  {
    slug: 'monitoreo',
    title: 'Monitoreo',
    hint: 'Rastreo, drones e ingeniería especial',
    // GPS · drones · proyectos especiales
    indices: [5, 9, 10],
  },
]

/** Running 01–11 across the categories, so numbering never restarts. */
function numberFor(categoryIndex: number, itemIndex: number) {
  let n = 0
  for (let c = 0; c < categoryIndex; c++) n += CATEGORIES[c].indices.length
  return String(n + itemIndex + 1).padStart(2, '0')
}

function CategoryBlock({ category, categoryIndex }: { category: Category; categoryIndex: number }) {
  // One open row per category — state deliberately lives here, not above.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="sol-cat">
      <div className="sol-cat__head">
        <span className="sol-cat__kicker">{category.title}</span>
        <span className="sol-cat__hint">{category.hint}</span>
      </div>

      <div className="sol-list">
        {category.indices.map((serviceIndex, i) => {
          const svc = PDF_SERVICES[serviceIndex]
          const isOpen = openIndex === i
          const panelId = `sol-${category.slug}-${i}-panel`
          const buttonId = `sol-${category.slug}-${i}-button`
          const isProjects = serviceIndex === 10

          return (
            <div className={`sol-item${isOpen ? ' is-open' : ''}`} key={svc.title}>
              <h3 className="sol-item__heading">
                <button
                  type="button"
                  id={buttonId}
                  className="sol-item__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="sol-item__num">{numberFor(categoryIndex, i)}</span>
                  <span className="sol-item__title">{svc.title}</span>
                  <span className="sol-item__icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
              </h3>

              <div id={panelId} role="region" aria-labelledby={buttonId} className="sol-item__panel">
                <div className="sol-item__panel-inner">
                  <p className="sol-item__desc">{svc.desc}</p>
                  {isProjects && (
                    <Link className="sol-item__link" href="/proyectos">
                      Conocer proyectos especiales →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

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

        {CATEGORIES.map((category, i) => (
          <CategoryBlock key={category.slug} category={category} categoryIndex={i} />
        ))}
      </div>
    </section>
  )
}
