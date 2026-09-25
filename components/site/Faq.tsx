'use client'

import { useState } from 'react'

/**
 * FAQ accordion. Questions and answers stay strictly within MONITORINC's
 * documented capabilities — no invented certifications, metrics or claims.
 */

const FAQS = [
  {
    q: '¿Instalan cámaras de seguridad para mi espacio?',
    a: 'Sí. Ofrecemos cámaras y grabadores de video en tecnología IP y análoga, útiles para combatir la inseguridad, prevenir la pérdida de elementos y apoyar el control de personal y de procesos en distintos ambientes.',
  },
  {
    q: '¿Puedo monitorear mis alarmas desde el celular?',
    a: 'Contamos con sistemas de alarmas de intrusión alámbricas e inalámbricas para interior o exterior, con tecnologías de monitoreo remoto que te permiten estar al tanto desde tu celular.',
  },
  {
    q: '¿Manejan control de acceso con huella o reconocimiento facial?',
    a: 'Sí. Nuestros equipos de control de acceso regulan la entrada y salida de personas y vehículos, y soportan desde tarjetas RFID y código de barras hasta huellas dactilares y detección de rostros.',
  },
  {
    q: '¿Atienden fincas, conjuntos cerrados y empresas?',
    a: 'Trabajamos con hogares, empresas, fincas e instituciones. Para propiedades como fincas, conjuntos cerrados e instituciones educativas ofrecemos seguridad perimetral con cercas eléctricas, concertinas, alarmas sonoras y control de usuarios.',
  },
  {
    q: '¿Pueden integrar cámaras, control de acceso y alarmas en un mismo proyecto?',
    a: 'Sí. Distribuimos e integramos equipos de seguridad electrónica y comunicación, de manera que las soluciones de CCTV, control de acceso, alarmas y otras tecnologías trabajen de forma coordinada dentro de tu proyecto.',
  },
  {
    q: '¿Qué información necesitan para asesorarme?',
    a: 'Nos ayuda conocer qué espacio necesitas proteger, qué solución estás buscando y algunos datos de contacto. Con eso te ayudamos a elegir e integrar la solución adecuada para tu espacio, operación o infraestructura.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="faq__list">
      {FAQS.map((item, i) => {
        const isOpen = open === i
        const panelId = `faq-panel-${i}`
        const btnId = `faq-btn-${i}`
        return (
          <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <button
              id={btnId}
              className="faq-item__btn"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>{item.q}</span>
              <span className="faq-item__icon" aria-hidden="true" />
            </button>
            <div id={panelId} role="region" aria-labelledby={btnId} className="faq-item__panel">
              <div>
                <p className="faq-item__answer">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
