import Image from 'next/image'

import { SECTORS } from '../../content/site'
import { PDF_SERVICES } from '../components/PdfContent'
import { FinalCta } from '../../components/site/FinalCta'
import { AgendarDemoButton } from '../../components/ui/AgendarDemoButton'

export const metadata = {
  title: 'MONITORINC | Seguridad para hogares, empresas, fincas e instituciones',
  description:
    'Sistemas de seguridad electrónica para hogares, empresas, fincas e instituciones: CCTV, control de acceso, alarmas, seguridad perimetral, domótica y citofonía.',
}

export default function SectoresPage() {
  return (
    <main>
      <section className="section page-intro">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Sectores</span>
            <h1 className="h2" style={{ marginTop: 16 }}>
              Seguridad diseñada para cada tipo de <em>espacio.</em>
            </h1>
            <p className="lede" style={{ marginTop: 18 }}>
              Distribuimos e integramos equipos de seguridad electrónica y de
              comunicación para hogares, empresas, fincas e instituciones. Cada
              espacio tiene riesgos distintos, y la integración se define a partir
              de ellos.
            </p>
          </div>
        </div>
      </section>

      {SECTORS.map((sector, i) => (
        <section
          key={sector.slug}
          id={sector.slug}
          className={`section section--tight sector-page${i % 2 === 1 ? ' sector-page--alt' : ''}`}
          aria-labelledby={`${sector.slug}-title`}
        >
          <div className="container">
            <div className="section-head">
              <span className="sector-page__icon" aria-hidden="true">
                <Image src={sector.icon} alt="" width={32} height={32} unoptimized />
              </span>
              <span className="eyebrow eyebrow--num">
                {String(i + 1).padStart(2, '0')} — Sector
              </span>
              <h2 id={`${sector.slug}-title`} className="h2">{sector.title}</h2>
              <p className="lede">{sector.desc}</p>
            </div>

            <div className="svc-group">
              <div className="svc-group__head">
                <span className="svc-group__kicker">Soluciones relevantes</span>
                <span className="svc-group__hint">Integrables según el espacio</span>
              </div>
              {sector.serviceIndices.map((si, ii) => {
                const svc = PDF_SERVICES[si]
                return (
                  <article className="svc-row" key={svc.title}>
                    <div className="svc-row__num">{String(ii + 1).padStart(2, '0')}</div>
                    <h3 className="svc-row__title">{svc.title}</h3>
                    <p className="svc-row__desc">{svc.desc}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ))}

      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">¿No sabes cuál se ajusta a tu <em>espacio?</em></h2>
            <p className="lede" style={{ marginTop: 18 }}>
              Cuéntanos qué necesitas proteger y te ayudamos a elegir e integrar
              la solución adecuada.
            </p>
            <AgendarDemoButton href="/contacto" style={{ marginTop: 24 }} />
          </div>
        </div>
      </section>

      <FinalCta />
    </main>
  )
}
