'use client'

import { useState } from 'react'

/**
 * Consultation form. Does NOT fake a successful backend submission —
 * on submit it opens the user's email client with a prefilled message
 * to MONITORINC and shows an honest confirmation of that action.
 */

const PROJECT_TYPES = [
  'Hogar / vivienda',
  'Empresa / oficina',
  'Finca / conjunto cerrado',
  'Institución',
  'Proyecto especial',
  'Otro',
]

export function ConsultationForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    // Reject incomplete required data before starting the email action.
    // `noValidate` suppresses the browser's automatic pass, so trigger the
    // native check explicitly: this focuses the first invalid field and
    // shows its message, and we stop before opening any mail handler.
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const nombre = String(data.get('nombre') || '')
    const empresa = String(data.get('empresa') || '')
    const telefono = String(data.get('telefono') || '')
    const correo = String(data.get('correo') || '')
    const tipo = String(data.get('tipo') || '')
    const mensaje = String(data.get('mensaje') || '')

    const body = [
      `Nombre: ${nombre}`,
      `Empresa: ${empresa}`,
      `Teléfono: ${telefono}`,
      `Correo: ${correo}`,
      `Tipo de proyecto: ${tipo}`,
      '',
      mensaje,
    ].join('\n')

    const mailto =
      `mailto:info@monitorinc.com.co` +
      `?subject=${encodeURIComponent('Solicitud de asesoría — ' + (nombre || 'MONITORINC'))}` +
      `&body=${encodeURIComponent(body)}`

    window.location.href = mailto
    setSent(true)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__row">
        <div className="field">
          <label htmlFor="cf-nombre">Nombre</label>
          <input id="cf-nombre" name="nombre" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="cf-empresa">Empresa</label>
          <input id="cf-empresa" name="empresa" type="text" autoComplete="organization" />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="cf-telefono">Teléfono</label>
          <input id="cf-telefono" name="telefono" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="cf-correo">Correo</label>
          <input id="cf-correo" name="correo" type="email" autoComplete="email" required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-tipo">Tipo de proyecto</label>
        <select id="cf-tipo" name="tipo" defaultValue="" required>
          <option value="" disabled>Selecciona una opción</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="cf-mensaje">Mensaje</label>
        <textarea
          id="cf-mensaje"
          name="mensaje"
          placeholder="Cuéntanos qué espacio necesitas proteger y qué solución estás buscando."
        />
      </div>

      <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
        Solicitar asesoría
        <svg className="btn__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h9M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <p className="form__note">
        Al enviar se abrirá tu correo con los datos listos para enviarnos a
        info@monitorinc.com.co. También puedes escribirnos directamente por WhatsApp.
      </p>

      {sent && (
        <p className="form__status" role="status">
          Abrimos tu cliente de correo con la solicitud. Si no se abrió, escríbenos a
          info@monitorinc.com.co.
        </p>
      )}
    </form>
  )
}
