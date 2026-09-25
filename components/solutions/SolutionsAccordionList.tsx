'use client'

import { useState } from 'react'
import Link from 'next/link'

import { PDF_SERVICES } from '../../app/components/PdfContent'
import {
  CATEGORY_BACKGROUNDS,
  SOLUTION_CATEGORIES,
  solutionNumber,
  type SolutionCategory,
} from '../../content/solutions'

/**
 * The three solution categories rendered as editorial accordions.
 *
 * Every category holds its own open row, so opening something under
 * Automatización never collapses what the visitor left open under Seguridad.
 *
 * With `withBackgrounds`, an expanded panel paints its *category's*
 * photograph behind the copy — every item in a category shares one image,
 * resolved from CATEGORY_BACKGROUNDS rather than repeated per item. The image
 * is attached via inline style *only while open*, so a closed panel never
 * downloads it: the picture appears on click and disappears on close.
 */

type Props = {
  /** Show a photographic background inside expanded panels. */
  withBackgrounds?: boolean
  /** Prefix for the generated element ids, so two lists can coexist. */
  idPrefix?: string
}

function CategoryBlock({
  category,
  categoryIndex,
  withBackgrounds,
  idPrefix,
}: {
  category: SolutionCategory
  categoryIndex: number
  withBackgrounds: boolean
  idPrefix: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // One background per category, shared by all of its items.
  const categoryImage = withBackgrounds ? CATEGORY_BACKGROUNDS[category.key] : undefined

  return (
    <div className="sol-cat">
      <div className="sol-cat__head">
        <span className="sol-cat__kicker">{category.title}</span>
        <span className="sol-cat__hint">{category.hint}</span>
      </div>

      <div className="sol-list">
        {category.items.map((item, i) => {
          const svc = PDF_SERVICES[item.index]
          const isOpen = openIndex === i
          const panelId = `${idPrefix}-${category.slug}-${i}-panel`
          const buttonId = `${idPrefix}-${category.slug}-${i}-button`
          const isProjects = item.index === 10
          const image = categoryImage
          const hasImage = Boolean(image)

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
                  <span className="sol-item__num">{solutionNumber(categoryIndex, i)}</span>
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
                  <div
                    className={`sol-item__body${hasImage ? ' sol-item__body--media' : ''}`}
                    // Attached only while open, so the file is never fetched
                    // for a collapsed row.
                    style={isOpen && image ? { backgroundImage: `url(${image})` } : undefined}
                  >
                    <p className="sol-item__desc">{svc.desc}</p>
                    {isProjects && (
                      <Link className="sol-item__link" href="/proyectos">
                        Conocer proyectos especiales →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SolutionsAccordionList({ withBackgrounds = false, idPrefix = 'sol' }: Props) {
  return (
    <>
      {SOLUTION_CATEGORIES.map((category, i) => (
        <CategoryBlock
          key={category.slug}
          category={category}
          categoryIndex={i}
          withBackgrounds={withBackgrounds}
          idPrefix={idPrefix}
        />
      ))}
    </>
  )
}
