import { Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400'],
  display: 'swap',
})

export const metadata = {
  title: 'MONITORINC | Seguridad electrónica y comunicación',
  description:
    'Distribuimos e integramos equipos de seguridad electrónica y de comunicación. CCTV, control de acceso, alarmas, domótica, GPS, citofonía, drones y proyectos especiales.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
