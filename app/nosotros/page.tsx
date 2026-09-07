import Link from 'next/link'

import { PDF_ABOUT } from '../components/PdfContent'
import { SECTORS } from '../../content/site'
import { FinalCta } from '../../components/site/FinalCta'
import { AgendarDemoButton } from '../../components/ui/AgendarDemoButton'

export const metadata = {
  title: 'MONITORINC | Nosotros',
  description:
    'MONITORINC distribuye e integra equipos de seguridad electrónica y de comunicación, con profesionales en ingeniería electrónica y de telecomunicaciones.',
}

/*
 * Institutional page built strictly from what MONITORINC already states about
 * itself (PDF_ABOUT). Deliberately no founding year, headcount, certifications,
 * years of experience or market claims — none of that exists in the source
 * content, so none of it is asserted here.
 */

const FOCUS = [
  {
    kicker: 'Integración',
    body:
      'Distribuimos e integramos equipos de seguridad electrónica y de comunicación, de modo que las distintas soluciones operen como un solo sistema y no como instalaciones sueltas.',
  },
  {
    kicker: 'Ingeniería',
    body:
      'Contamos con profesionales expertos en ingeniería electrónica y de telecomunicaciones para diseñar e implementar proyectos de alto nivel.',
  },
  {
    kicker: 'Proyectos especiales',
    body:
      'Atendemos requerimientos que necesitan equipos y comunicaciones especiales, más allá de una instalación estándar.',
  },
  {
    kicker: 'Alcance',
    body:
      'Trabajamos en ciudades, pueblos y corregimientos, e incluso en ambientes hostiles y de difícil acceso.',
  },
]

export default function NosotrosPage() {
  return (
    <main>
      {/* The corporate statement now opens Home; this existing heading is
          promoted to h1 so the page still has exactly one. */}
      <section className="section page-intro" aria-labelledby="enfoque-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow--num">{PDF_ABOUT.title}</span>
            <h1 id="enfoque-title" className="h2">Cómo trabajamos</h1>
          </div>
          <div className="svc-group">
            {FOCUS.map((f, i) => (
              <article className="svc-row" key={f.kicker}>
                <div className="svc-row__num">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="svc-row__title">{f.kicker}</h3>
                <p className="svc-row__desc">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="entornos-title">
        <div className="container">
          <div className="section-head">
            <h2 id="entornos-title" className="h2">Entornos que atendemos</h2>
            <p className="lede">
              Hogares, empresas, fincas e instituciones, además de proyectos
              especiales de ingeniería y telecomunicaciones.
            </p>
          </div>
          <div className="svc-group">
            {SECTORS.map((s, i) => (
              <article className="svc-row" key={s.slug}>
                <div className="svc-row__num">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="svc-row__title">
                  <Link href={`/sectores#${s.slug}`}>{s.title}</Link>
                </h3>
                <p className="svc-row__desc">{s.desc}</p>
              </article>
            ))}
          </div>
          <AgendarDemoButton
            href="/sectores"
            label="Ver sectores"
            variant="secondary"
            arrow={false}
            style={{ marginTop: 32 }}
          />
        </div>
      </section>

      <FinalCta />
    </main>
  )
}
