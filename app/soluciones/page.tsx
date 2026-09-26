import { SolutionsSection } from '../../components/sections/SolutionsSection'
import { FinalCta } from '../../components/site/FinalCta'

export const metadata = {
  title: 'MONITORINC | Soluciones',
  description:
    'Tecnologías integrables de MONITORINC: CCTV, alarmas, seguridad perimetral, detección de incendios, control de acceso, citofonía, automatización de puertas, domótica, GPS, drones y proyectos especiales.',
}

/* Header, footer and the WhatsApp button come from app/layout.js. */
export default function SolucionesPage() {
  return (
    <main>
      <SolutionsSection />
      <FinalCta />
    </main>
  )
}
