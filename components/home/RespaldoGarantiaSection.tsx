import Image from 'next/image'

import { StatsStrip, type Stat } from './StatsStrip'

/**
 * Home "Respaldo y garantía" block — sits between the hero and the suppliers
 * marquee, so the brand statement lands right before the brands that back it.
 *
 * Editorial copy on the left, the field photo on the right (stacked, copy
 * first, below 1024px), then the metrics band. Server Component; only the
 * metrics band hydrates, for its count-up.
 *
 * The photo is a 1586×992 PNG of ~3 MB, so it goes through next/image: the
 * browser gets a WebP/AVIF sized to the column instead of the source file.
 * The frame has a fixed height / aspect ratio, so nothing shifts on load.
 */

/** Module-level so StatsStrip's effect sees a stable reference. */
const STATS: Stat[] = [
  { value: 10, label: 'años de experiencia' },
  { value: 1500, label: 'clientes satisfechos' },
  { value: 300, label: 'proyectos exitosos' },
]

export function RespaldoGarantiaSection() {
  return (
    <section className="respaldo" aria-labelledby="respaldo-title">
      <div className="container">
        <div className="respaldo__grid">
          <div className="respaldo__copy">
            <span className="eyebrow">MONITORINC</span>
            <h2 id="respaldo-title" className="h2 respaldo__title">
              Respaldo y <em>garantía</em>
            </h2>
            <p className="respaldo__text">
              En Monitorinc SAS integramos soluciones de seguridad electrónica y
              comunicación con enfoque técnico, equipos confiables y
              acompañamiento profesional. Nuestra experiencia en hogares,
              empresas, fincas e instituciones nos permite desarrollar proyectos
              con altos estándares de calidad, instalación cuidadosa y soporte
              permanente. Trabajamos con marcas reconocidas para ofrecer mayor
              respaldo, continuidad y confianza en cada implementación.
            </p>
          </div>

          <div className="respaldo__media">
            <Image
              src="/images/tech-back.png"
              alt="Equipo y respaldo tecnológico de Monitorinc"
              fill
              sizes="(max-width: 1024px) calc(100vw - 56px), 640px"
              className="respaldo__img"
            />
          </div>
        </div>

        <StatsStrip stats={STATS} />
      </div>
    </section>
  )
}
