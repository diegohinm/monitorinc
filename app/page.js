/* ─────────────────────────────────────────────────────────────
   MONITORINC — original editorial commercial landing page.
   Content sourced only from MONITORINC (see PdfContent.js).
   ───────────────────────────────────────────────────────────── */
import { CONTACT } from '../config/contact'
import { telHref } from '../lib/whatsapp'
import { Hero } from '../components/hero/Hero'
import { SuppliersMarquee } from '../components/home/SuppliersMarquee'
import { AudienceStrip } from '../components/home/AudienceStrip'
import { AgendarDemoButton } from '../components/ui/AgendarDemoButton'
import { ConsultationForm } from '../components/site/ConsultationForm'
import { Faq } from '../components/site/Faq'
import { FinalCta } from '../components/site/FinalCta'
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

export const metadata = {
  title: 'MONITORINC | Seguridad electrónica y comunicación',
  description:
    'Distribuimos e integramos equipos de seguridad electrónica y de comunicación: CCTV, control de acceso, alarmas, seguridad perimetral, domótica, GPS, citofonía, drones y proyectos especiales.',
}

export default function Home() {
  return (
    <main>
        {/* ── HERO ─────────────────────────────────────────── */}
        <Hero />

        {/* ── PROVEEDORES marquee ──────────────────────────── */}
        <SuppliersMarquee />

        {/* ── ATENDEMOS A band ─────────────────────────────── */}
        <AudienceStrip />

        {/* ── CONSULTATION FORM ────────────────────────────── */}
        <section className="section consult" id="asesoria" aria-labelledby="consult-title">
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

        {/* ── PROYECTOS teaser → /proyectos ───────────────── */}
        <section className="section" aria-labelledby="proyectos-teaser-title">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow eyebrow--num">03 — Proyectos especiales</span>
              <h2 id="proyectos-teaser-title" className="h2">
                Ingeniería para proyectos que exigen más que una <em>instalación estándar.</em>
              </h2>
              <p className="lede">
                Contamos con profesionales expertos en ingeniería electrónica y de
                telecomunicaciones para diseñar e implementar proyectos de alto nivel
                que requieran equipos y comunicaciones especiales.
              </p>
              <AgendarDemoButton
                href="/proyectos"
                label="Ver proyectos especiales"
                variant="secondary"
                arrow={false}
                style={{ marginTop: 24 }}
              />
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
              <AgendarDemoButton href="/contacto" className="" style={{ marginTop: 24 }} />
            </div>
            <Faq />
          </div>
        </section>

        <FinalCta />
      </main>
  )
}
