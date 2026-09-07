'use client'

import { useEffect, useRef, useState } from 'react'

import { CONTACT } from '../../config/contact'
import { buildWhatsAppUrl } from '../../lib/whatsapp'

/**
 * Consultation form — submits to Netlify Forms over fetch, with no mail
 * client involved.
 *
 * Netlify registers forms by parsing static HTML at deploy time, and a
 * Next.js page is rendered by a serverless function, so this component is
 * invisible to that scanner. `public/__forms.html` declares the form and its
 * fields instead, and this is why the POST targets `/__forms.html` rather
 * than `/` — that is the documented path for Netlify Forms on Next.js.
 * Field names here must stay in sync with that file.
 */

const FORM_NAME = 'monitorinc-contact'

const PROJECT_TYPES = [
  'Hogar / vivienda',
  'Empresa / oficina',
  'Finca / conjunto cerrado',
  'Institución',
  'Proyecto especial',
  'Otro',
]

const WHATSAPP_FALLBACK =
  'Hola, intenté enviar el formulario de asesoría de MONITORINC y no pude. Quisiera recibir asesoría.'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function ConsultationForm() {
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Guard against a second submit while the first is still in flight.
    if (status === 'submitting') return

    const form = e.currentTarget
    // `noValidate` suppresses the browser's automatic pass, so run the native
    // check explicitly: it focuses the first invalid field and shows its message.
    if (!form.reportValidity()) return

    setStatus('submitting')
    try {
      const data = new FormData(form)
      data.set('form-name', FORM_NAME)

      const body = new URLSearchParams()
      data.forEach((value, key) => body.append(key, String(value)))

      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) throw new Error(`Netlify Forms responded ${res.status}`)

      setStatus('success')
      form.reset()
      timerRef.current = window.setTimeout(() => setStatus('idle'), 8000)
    } catch {
      // Keep whatever the visitor typed so they can retry without re-entering it.
      setStatus('error')
    }
  }

  const submitting = status === 'submitting'

  return (
    <form
      ref={formRef}
      className="form"
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p hidden>
        <label>
          No llenar: <input name="bot-field" />
        </label>
      </p>

      <div className="form__row">
        <div className="field">
          <label htmlFor="cf-name">Nombre</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="cf-company">Empresa</label>
          <input id="cf-company" name="company" type="text" autoComplete="organization" />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="cf-phone">Teléfono</label>
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Correo</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-projectType">Tipo de proyecto</label>
        <select id="cf-projectType" name="projectType" defaultValue="" required>
          <option value="" disabled>Selecciona una opción</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="cf-message">Mensaje</label>
        <textarea
          id="cf-message"
          name="message"
          required
          placeholder="Cuéntanos qué espacio necesitas proteger y qué solución estás buscando."
        />
      </div>

      <button
        type="submit"
        className="btn btn--primary"
        style={{ width: '100%' }}
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? 'Enviando…' : 'Solicitar asesoría'}
        {!submitting && (
          <svg className="btn__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h9M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <p className="form__note">
        Enviamos tu solicitud directamente a MONITORINC. También puedes
        escribirnos por WhatsApp o a {CONTACT.emailPrimary}.
      </p>

      <div aria-live="polite">
        {status === 'success' && (
          <p className="form__status">
            Gracias. Recibimos tu solicitud y nos pondremos en contacto contigo.
          </p>
        )}
        {status === 'error' && (
          <p className="form__status form__status--error">
            No pudimos enviar tu solicitud. Inténtalo nuevamente o{' '}
            <a href={buildWhatsAppUrl(WHATSAPP_FALLBACK)} target="_blank" rel="noopener noreferrer">
              escríbenos por WhatsApp
            </a>
            .
          </p>
        )}
      </div>
    </form>
  )
}
