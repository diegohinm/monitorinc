import { CONTACT } from '../../config/contact'
import { telHref } from '../../lib/whatsapp'
import { AgendarDemoButton } from '../ui/AgendarDemoButton'
import { PDF_ABOUT } from '../../app/components/PdfContent'

/**
 * Closing call to action, shared by Home and the inner pages so the block is
 * defined once. Contact details come from the global CONTACT config.
 */
export function FinalCta() {
  return (
    <section className="section final-cta on-dark" aria-labelledby="cta-title">
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
            <AgendarDemoButton href="/contacto" label="Agenda una cita" />
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
  )
}
