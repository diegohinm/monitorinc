import { CONTACT } from '../../config/contact'
import { telHref, mailtoHref, buildWhatsAppUrl } from '../../lib/whatsapp'
import { ConsultationForm } from '../../components/site/ConsultationForm'
import { AgendarDemoButton } from '../../components/ui/AgendarDemoButton'

export const metadata = {
  title: 'MONITORINC | Contacto',
  description:
    'Habla con MONITORINC sobre tu proyecto de seguridad electrónica. Teléfonos, WhatsApp, correo y formulario de asesoría sin costo.',
}

const WHATSAPP_MESSAGE =
  'Hola, estoy interesado en una solución de seguridad de MONITORINC. Quisiera recibir asesoría.'

/* Every number and address comes from config/contact.ts — never inline. */
const CHANNELS = [
  {
    k: 'Teléfono',
    v: CONTACT.whatsappPrimary.label,
    href: telHref(CONTACT.whatsappPrimary.digits),
  },
  ...(CONTACT.phoneSecondary
    ? [{
        k: 'Teléfono',
        v: CONTACT.phoneSecondary.label,
        href: telHref(CONTACT.phoneSecondary.digits),
      }]
    : []),
  {
    k: 'Correo',
    v: CONTACT.emailPrimary,
    href: mailtoHref(),
  },
  {
    k: 'Sitio web',
    v: CONTACT.website.label,
    href: CONTACT.website.url,
    ext: true,
  },
]

export default function ContactoPage() {
  return (
    <main>
      <section className="section consult" aria-labelledby="contacto-title">
        <div className="container consult__grid">
          <div className="consult__aside">
            <span className="eyebrow">Asesoría sin costo</span>
            <h1 id="contacto-title" className="h2" style={{ marginTop: 16 }}>
              Conversemos sobre tu <em>proyecto.</em>
            </h1>
            <p>
              Cuéntanos qué espacio necesitas proteger y qué solución estás
              buscando. Te ayudamos a elegir e integrar la solución adecuada
              para tu espacio, operación o infraestructura.
            </p>

            <div className="consult__contactline">
              {CHANNELS.map((c) => (
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

            <AgendarDemoButton
              href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
              label="Escribir por WhatsApp"
              variant="secondary"
              arrow={false}
              style={{ marginTop: 26 }}
            />
          </div>

          <ConsultationForm />
        </div>
      </section>
    </main>
  )
}
