/* ─────────────────────────────────────────────────────────────
   MONITORINC — original editorial commercial landing page.
   Content sourced only from MONITORINC (see PdfContent.js).
   ───────────────────────────────────────────────────────────── */
import { CONTACT } from '../config/contact'
import { telHref, mailtoHref } from '../lib/whatsapp'
import { Hero } from '../components/hero/Hero'
import { SuppliersMarquee } from '../components/home/SuppliersMarquee'
import { AudienceStrip } from '../components/home/AudienceStrip'
import { CorporateIntro } from '../components/sections/CorporateIntro'
import { WhatWeDo } from '../components/home/WhatWeDo'
import { IntegrableTechnologiesSection } from '../components/sections/IntegrableTechnologiesSection'
import { AgendarDemoButton } from '../components/ui/AgendarDemoButton'
import { ConsultationForm } from '../components/site/ConsultationForm'
import { Faq } from '../components/site/Faq'
import { FinalCta } from '../components/site/FinalCta'

const CONTACT_LINES = [
  { k: 'Teléfono', v: CONTACT.whatsappPrimary.label, href: telHref(CONTACT.whatsappPrimary.digits) },
  ...(CONTACT.phoneSecondary
    ? [{ k: 'Teléfono', v: CONTACT.phoneSecondary.label, href: telHref(CONTACT.phoneSecondary.digits) }]
    : []),
  { k: 'Correo', v: CONTACT.emailPrimary, href: mailtoHref() },
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

        {/* ── MONITORINC — bloque corporativo (desde /nosotros) ─ */}
        <CorporateIntro />

        {/* ── CONSULTATION FORM ────────────────────────────── */}
        {/* <section className="section consult" id="asesoria" aria-labelledby="consult-title">
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
        </section> */}

        {/* ── §01 QUÉ HACEMOS (parallax) ───────────────── */}
        <WhatWeDo />

        {/* ── TECNOLOGÍAS INTEGRABLES (desde /proyectos) ───── */}
        <IntegrableTechnologiesSection />

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
