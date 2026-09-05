/* ─────────────────────────────────────────────────────────────
   MONITORINC — original editorial commercial landing page.
   Content sourced only from MONITORINC (see PdfContent.js).
   ───────────────────────────────────────────────────────────── */
import { CONTACT } from '../config/contact'
import { telHref } from '../lib/whatsapp'
import { Hero } from '../components/hero/Hero'
import { SuppliersMarquee } from '../components/home/SuppliersMarquee'
import { AudienceStrip } from '../components/home/AudienceStrip'
import { Header } from '../components/Header'
import { AgendarDemoButton } from '../components/ui/AgendarDemoButton'
import { ConsultationForm } from '../components/site/ConsultationForm'
import { Faq } from '../components/site/Faq'
import {
  PDF_ABOUT,
  PDF_SERVICES,
} from './components/PdfContent'

/* ─── Service grouping (editorial rows, not 11 giant cards) ──── */
const SERVICE_GROUPS = [
  {
    kicker: 'Seguridad',
    hint: 'Vigilancia, intrusión y protección perimetral',
    indices: [0, 2, 3, 4],
  },
  {
    kicker: 'Acceso',
    hint: 'Entrada de personas y comunicación',
    indices: [1, 8],
  },
  {
    kicker: 'Automatización',
    hint: 'Puertas y hogar inteligente',
    indices: [6, 7],
  },
  {
    kicker: 'Monitoreo y proyectos',
    hint: 'Rastreo, aéreo e ingeniería especial',
    indices: [5, 9, 10],
  },
]

const SECTORS = [
  { title: 'Hogares', desc: 'Cámaras, alarmas, domótica y citofonía para vivir con tranquilidad en casa.' },
  { title: 'Empresas', desc: 'CCTV, control de acceso y comunicación para proteger operación y personal.' },
  { title: 'Fincas', desc: 'Seguridad perimetral, cercas eléctricas y alarmas para propiedades y conjuntos cerrados.' },
  { title: 'Instituciones', desc: 'Detección de incendios, control de acceso y monitoreo para espacios educativos y públicos.' },
]

const PROJECTS = [
  {
    icon: 'Ie',
    title: 'Ingeniería electrónica y de telecomunicaciones',
    desc: 'Profesionales expertos que diseñan e implementan proyectos de alto nivel a la medida de cada operación e infraestructura.',
  },
  {
    icon: 'Ec',
    title: 'Equipos y comunicaciones especiales',
    desc: 'Integración de equipos y comunicaciones específicas para requerimientos que van más allá de una instalación estándar.',
  },
  {
    icon: 'Ah',
    title: 'Ambientes hostiles y de difícil acceso',
    desc: 'Soluciones para ciudades, pueblos, corregimientos e incluso ambientes hostiles y de difícil acceso.',
  },
]

/* Running number across the grouped service list */
function serviceNumber(groupIdx, itemIdx) {
  let n = 0
  for (let g = 0; g < groupIdx; g++) n += SERVICE_GROUPS[g].indices.length
  return String(n + itemIdx + 1).padStart(2, '0')
}

const CONTACT_LINES = [
  { k: 'Teléfono', v: CONTACT.whatsappPrimary.label, href: telHref(CONTACT.whatsappPrimary.digits) },
  { k: 'Teléfono', v: CONTACT.phoneSecondary.label, href: telHref(CONTACT.phoneSecondary.digits) },
  { k: 'Correo', v: CONTACT.emailPrimary, href: `mailto:${CONTACT.emailPrimary}` },
  { k: 'Web', v: CONTACT.website.label, href: CONTACT.website.url, ext: true },
]

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* ── HERO ─────────────────────────────────────────── */}
        <Hero />

        {/* ── PROVEEDORES marquee ──────────────────────────── */}
        <SuppliersMarquee />

        {/* ── ATENDEMOS A band ─────────────────────────────── */}
        <AudienceStrip />

        {/* ── CONSULTATION FORM ────────────────────────────── */}
        <section className="section consult" id="contacto" aria-labelledby="consult-title">
          <div className="container consult__grid">
            <div className="consult__aside">
              <span className="eyebrow">Asesoría sin costo</span>
              <h2 id="consult-title" className="h2" style={{ marginTop: 16 }}>
                Planifica tu sistema de <em>seguridad.</em>
              </h2>
              <p>
                Cuéntanos qué espacio necesitas proteger y qué solución estás
                buscando. Te ayudamos a elegir e integrar la solución adecuada
                para tu espacio, operación o infraestructura.
              </p>
              <div className="consult__contactline">
                {CONTACT_LINES.map((c) => (
                  <a
                    key={c.href + c.v}
                    href={c.href}
                    target={c.ext ? '_blank' : undefined}
                    rel={c.ext ? 'noreferrer' : undefined}
                  >
                    <strong style={{ color: 'var(--muted)', fontWeight: 600 }}>{c.k}: </strong>
                    {c.v}
                  </a>
                ))}
              </div>
            </div>

            <ConsultationForm />
          </div>
        </section>

        {/* ── §01 QUÉ HACEMOS / SOLUCIONES ─────────────────── */}
        <section className="section" id="soluciones" aria-labelledby="soluciones-title">
          <div className="container">
            <div className="services__intro">
              <div>
                <span className="eyebrow eyebrow--num">01 — Qué hacemos</span>
                <h2 id="soluciones-title" className="h2" style={{ marginTop: 16 }}>
                  Seguridad, acceso y monitoreo desde un solo <em>integrador.</em>
                </h2>
              </div>
              <p className="lede">{PDF_ABOUT.body}</p>
            </div>

            <div className="svc-groups">
              {SERVICE_GROUPS.map((group, gi) => (
                <div className="svc-group" key={group.kicker}>
                  <div className="svc-group__head">
                    <span className="svc-group__kicker">{group.kicker}</span>
                    <span className="svc-group__hint">{group.hint}</span>
                  </div>
                  {group.indices.map((si, ii) => {
                    const svc = PDF_SERVICES[si]
                    return (
                      <article className="svc-row" key={svc.title}>
                        <div className="svc-row__num">{serviceNumber(gi, ii)}</div>
                        <h3 className="svc-row__title">{svc.title}</h3>
                        <p className="svc-row__desc">{svc.desc}</p>
                      </article>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── §02 SECTORES ─────────────────────────────────── */}
        <section className="section sectors on-dark" id="sectores" aria-labelledby="sectores-title">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">02 — Sectores</span>
              <h2 id="sectores-title" className="h2">
                Sistemas de seguridad para los espacios que operas, habitas y <em>proteges.</em>
              </h2>
            </div>
            <div className="sector-grid">
              {SECTORS.map((s, i) => (
                <div className="sector-card" key={s.title}>
                  <span className="sector-card__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="sector-card__title">{s.title}</h3>
                  <p className="sector-card__desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── §03 PROYECTOS ESPECIALES ─────────────────────── */}
        <section className="section" id="proyectos" aria-labelledby="proyectos-title">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow eyebrow--num">03 — Proyectos especiales</span>
              <h2 id="proyectos-title" className="h2">
                Ingeniería para proyectos que exigen más que una <em>instalación estándar.</em>
              </h2>
              <p className="lede">
                Contamos con profesionales expertos en ingeniería electrónica y de
                telecomunicaciones para diseñar e implementar proyectos de alto nivel
                que requieran equipos y comunicaciones especiales.
              </p>
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

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="section faq" id="faq" aria-labelledby="faq-title">
          <div className="container faq__grid">
            <div>
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2 id="faq-title" className="h2" style={{ marginTop: 16 }}>
                Resolvemos tus dudas antes de <em>instalar.</em>
              </h2>
              <p className="lede" style={{ marginTop: 18 }}>
                ¿Tienes otra pregunta? Escríbenos y con gusto te asesoramos.
              </p>
              <AgendarDemoButton href="#contacto" className="" style={{ marginTop: 24 }} />
            </div>
            <Faq />
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <section className="section final-cta on-dark" id="nosotros" aria-labelledby="cta-title">
          <div className="container final-cta__inner">
            <div>
              <span className="eyebrow">Hablemos</span>
              <h2 id="cta-title" style={{ marginTop: 16 }}>
                Planeemos la seguridad de tu <em>espacio.</em>
              </h2>
              <p className="final-cta__sub">
                {PDF_ABOUT.body.split('.')[0]}. Agenda una cita y te ayudamos a
                elegir e integrar la solución adecuada.
              </p>
              <div className="final-cta__actions">
                <AgendarDemoButton href="#contacto" label="Agenda una cita" />
                <AgendarDemoButton
                  href={`mailto:${CONTACT.emailPrimary}`}
                  label="Escríbenos"
                  variant="secondary"
                  arrow={false}
                />
              </div>
            </div>

            <div className="final-cta__contact">
              <span className="k">Teléfonos</span>
              <a href={telHref(CONTACT.whatsappPrimary.digits)}>{CONTACT.whatsappPrimary.label}</a>
              <a href={telHref(CONTACT.phoneSecondary.digits)}>{CONTACT.phoneSecondary.label}</a>
              <span className="k">Correo</span>
              <a href={`mailto:${CONTACT.emailPrimary}`}>{CONTACT.emailPrimary}</a>
              <span className="k">Sitio web</span>
              <a href={CONTACT.website.url} target="_blank" rel="noreferrer">{CONTACT.website.label}</a>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div>
              <span className="footer__brand">
                <span className="brand__mark" aria-hidden="true" />
                MONITORINC
              </span>
              <p className="footer__desc">
                Distribuimos e integramos equipos de seguridad electrónica y de
                comunicación para hacer de cada lugar un espacio más seguro.
              </p>
            </div>

            <div className="footer__col">
              <h4>Soluciones</h4>
              <ul>
                <li><a href="#soluciones">CCTV y grabación</a></li>
                <li><a href="#soluciones">Control de acceso</a></li>
                <li><a href="#soluciones">Alarmas de intrusión</a></li>
                <li><a href="#soluciones">Seguridad perimetral</a></li>
                <li><a href="#soluciones">GPS y drones</a></li>
              </ul>
            </div>

            <div className="footer__col">
              <h4>Sectores</h4>
              <ul>
                {SECTORS.map((s) => (
                  <li key={s.title}><a href="#sectores">{s.title}</a></li>
                ))}
                <li><a href="#proyectos">Proyectos especiales</a></li>
              </ul>
            </div>

            <div className="footer__col">
              <h4>Contacto</h4>
              <ul>
                <li><a href={telHref(CONTACT.whatsappPrimary.digits)}>{CONTACT.whatsappPrimary.label}</a></li>
                <li><a href={telHref(CONTACT.phoneSecondary.digits)}>{CONTACT.phoneSecondary.label}</a></li>
                <li><a href={`mailto:${CONTACT.emailPrimary}`}>{CONTACT.emailPrimary}</a></li>
                <li><a href={CONTACT.website.url} target="_blank" rel="noreferrer">{CONTACT.website.label}</a></li>
              </ul>
            </div>
          </div>

          <div className="footer__bottom">
            <span>© 2026 MONITORINC. Seguridad electrónica y comunicación.</span>
            <span>Colombia</span>
          </div>
        </div>
      </footer>
    </>
  )
}
