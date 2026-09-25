import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import { WhatsAppFloatingButton } from '../components/global/WhatsAppFloatingButton'
import { Header } from '../components/Header'
import { SiteFooter } from '../components/site/SiteFooter'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display-var',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body-var',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'MONITORINC | Seguridad electrónica y comunicación',
    template: '%s',
  },
  description:
    'Distribuimos e integramos equipos de seguridad electrónica y de comunicación. CCTV, control de acceso, alarmas, seguridad perimetral, domótica, GPS, citofonía, drones y proyectos especiales.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Header />
        {children}
        <SiteFooter />
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}
