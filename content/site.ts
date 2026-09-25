/**
 * Shared MONITORINC content used by more than one route.
 *
 * All copy here already existed on the site (see app/components/PdfContent.js);
 * nothing is invented. `serviceIndices` points into PDF_SERVICES and lists only
 * the solutions each sector's own description already names — no claims are
 * added on MONITORINC's behalf.
 */

export type Sector = {
  slug: string
  title: string
  desc: string
  icon: string
  serviceIndices: number[]
}

export const SECTORS: Sector[] = [
  {
    slug: 'hogares',
    title: 'Hogares',
    desc: 'Cámaras, alarmas, domótica y citofonía para vivir con tranquilidad en casa.',
    icon: '/icons/audience/home.svg',
    // cámaras · alarmas · domótica · citofonía
    serviceIndices: [0, 2, 7, 8],
  },
  {
    slug: 'empresas',
    title: 'Empresas',
    desc: 'CCTV, control de acceso y comunicación para proteger operación y personal.',
    icon: '/icons/audience/business.svg',
    // CCTV · control de acceso · comunicación
    serviceIndices: [0, 1, 8],
  },
  {
    slug: 'fincas',
    title: 'Fincas',
    desc: 'Seguridad perimetral, cercas eléctricas y alarmas para propiedades y conjuntos cerrados.',
    icon: '/icons/audience/farm.svg',
    // seguridad perimetral · alarmas
    serviceIndices: [3, 2],
  },
  {
    slug: 'instituciones',
    title: 'Instituciones',
    desc: 'Detección de incendios, control de acceso y monitoreo para espacios educativos y públicos.',
    icon: '/icons/audience/institution.svg',
    // detección de incendios · control de acceso · monitoreo
    serviceIndices: [4, 1, 0],
  },
]

export const PROJECTS = [
  {
    icon: 'Ie',
    title: 'Ingeniería electrónica y de telecomunicaciones',
    desc: 'Profesionales expertos que diseñan e implementan proyectos de alto nivel a la medida de cada operación e infraestructura.',
  },
  {
    icon: 'Ec',
    title: 'Equipos y comunicaciones especiales',
    desc: 'Integración de equipos y comunicaciones específicas para requerimientos que van más allá de una instalación estándar.',
  },
  {
    icon: 'Ah',
    title: 'Ambientes hostiles y de difícil acceso',
    desc: 'Soluciones para ciudades, pueblos, corregimientos e incluso ambientes hostiles y de difícil acceso.',
  },
]
