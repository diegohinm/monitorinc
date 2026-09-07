import { AgendarDemoButton } from '../ui/AgendarDemoButton'
import { HeroVideoBackground } from './HeroVideoBackground'

/**
 * MONITORINC hero — editorial commercial dark section.
 * No WebGL / particle sphere. Optional status chips are secondary,
 * kept to three and clearly subordinate to the headline and CTAs.
 */

const CHIPS = [
  { label: 'CCTV', status: 'IP · análogo' },
  { label: 'Alarmas', status: 'monitoreo remoto' },
  { label: 'GPS', status: 'posicionamiento' },
]

export function Hero() {
  return (
    <section id="inicio" className="hero on-dark">
      <HeroVideoBackground transitionMs={650} />

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow hero__eyebrow">Integrador de seguridad electrónica</span>

          <h1>
            Haz de cada espacio<br />
            <em>un lugar seguro.</em>
          </h1>

          <p className="hero__sub">
            Distribuimos e integramos equipos de seguridad electrónica y
            comunicación para hogares, empresas, fincas e instituciones.
          </p>

          <div className="hero__actions">
            <AgendarDemoButton href="/contacto" label="Agenda una cita" />
            <AgendarDemoButton
              href="#soluciones"
              label="Ver soluciones"
              variant="secondary"
              arrow={false}
            />
          </div>
        </div>

        <aside className="hero__panel" aria-label="Áreas de monitoreo">
          <div className="hero__panel-head">
            <span className="hero__panel-dot" aria-hidden="true" />
            Seguridad integrada
          </div>
          {CHIPS.map((c) => (
            <div key={c.label} className="chip">
              <span className="chip__label">{c.label}</span>
              <span className="chip__status">{c.status}</span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  )
}
