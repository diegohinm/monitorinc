import { PROJECTS } from '../../content/site'
import { PDF_SERVICES } from '../components/PdfContent'
import { FinalCta } from '../../components/site/FinalCta'
import { AgendarDemoButton } from '../../components/ui/AgendarDemoButton'

export const metadata = {
  title: 'MONITORINC | Proyectos especiales de seguridad electrónica',
  description:
    'Ingeniería electrónica y de telecomunicaciones para proyectos que requieren equipos y comunicaciones especiales, en ciudades, pueblos, corregimientos y ambientes de difícil acceso.',
}

/* Technologies MONITORINC already lists as part of its own offering. */
const INTEGRABLE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function ProyectosPage() {
  return (
    <main>
      <section className="section page-intro">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow--num">Proyectos especiales</span>
            <h1 className="h2" style={{ marginTop: 16 }}>
              Ingeniería para proyectos que exigen más que una{' '}
              <em>instalación estándar.</em>
            </h1>
            <p className="lede" style={{ marginTop: 18 }}>
              Contamos con profesionales expertos en ingeniería electrónica y de
              telecomunicaciones para diseñar e implementar proyectos de alto
              nivel que requieran equipos y comunicaciones especiales.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="tipos-title">
        <div className="container">
          <div className="section-head">
            <h2 id="tipos-title" className="h2">Tipos de proyecto</h2>
          </div>
          <div className="projects__grid">
            {PROJECTS.map((p) => (
              <article className="proj-card" key={p.title}>
                <span className="proj-card__icon" aria-hidden="true">{p.icon}</span>
                <h3 className="proj-card__title">{p.title}</h3>
                <p className="proj-card__desc">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="entornos-title">
        <div className="container">
          <div className="section-head">
            <h2 id="entornos-title" className="h2">Dónde trabajamos</h2>
            <p className="lede">
              Diseñamos e implementamos proyectos en ciudades, pueblos y
              corregimientos, e incluso en ambientes hostiles y de difícil
              acceso.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="tecnologias-title">
        <div className="container">
          <div className="section-head">
            <h2 id="tecnologias-title" className="h2">Tecnologías integrables</h2>
            <p className="lede">
              Un proyecto especial combina las mismas soluciones que
              distribuimos e integramos, ajustadas al requerimiento.
            </p>
          </div>
          <div className="svc-group">
            {INTEGRABLE.map((si, ii) => {
              const svc = PDF_SERVICES[si]
              return (
                <article className="svc-row" key={svc.title}>
                  <div className="svc-row__num">{String(ii + 1).padStart(2, '0')}</div>
                  <h3 className="svc-row__title">{svc.title}</h3>
                  <p className="svc-row__desc">{svc.desc}</p>
                </article>
              )
            })}
          </div>
          <AgendarDemoButton
            href="/contacto"
            label="Hablemos de tu proyecto"
            style={{ marginTop: 32 }}
          />
        </div>
      </section>

      <FinalCta />
    </main>
  )
}
