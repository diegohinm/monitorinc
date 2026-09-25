import { AgendarDemoButton } from '../ui/AgendarDemoButton'
import { Faq } from '../site/Faq'

/**
 * "Preguntas frecuentes" — the two-column FAQ band (intro + CTA on the left,
 * accordion on the right). It used to sit inline on Home and is now the body
 * of /faq; markup, copy and the Faq accordion are unchanged.
 *
 * The title is an h1 because it is the only heading of its page, but it keeps
 * the `h2` class so the visual scale is identical to the old Home section.
 */
export function FaqSection() {
  return (
    <section className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div>
          <span className="eyebrow">Preguntas frecuentes</span>
          <h1 id="faq-title" className="h2" style={{ marginTop: 16 }}>
            Resolvemos tus dudas antes de <em>instalar.</em>
          </h1>
          <p className="lede" style={{ marginTop: 18 }}>
            ¿Tienes otra pregunta? Escríbenos y con gusto te asesoramos.
          </p>
          <AgendarDemoButton href="/contacto" className="" style={{ marginTop: 24 }} />
        </div>
        <Faq />
      </div>
    </section>
  )
}
