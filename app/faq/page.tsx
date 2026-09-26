import { FaqSection } from '../../components/sections/FaqSection'

export const metadata = {
  title: 'MONITORINC | Preguntas frecuentes',
  description:
    'Respuestas a preguntas frecuentes sobre seguridad electrónica, cámaras, alarmas, control de acceso y soluciones integradas de MONITORINC.',
}

/* Header, footer and the WhatsApp button come from app/layout.js. */
export default function FaqPage() {
  return (
    <main>
      <FaqSection />
    </main>
  )
}
