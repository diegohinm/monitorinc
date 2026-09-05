/**
 * MONITORINC "Atendemos a" band — editorial label plus four audience icons.
 *
 * Server Component: static markup, no interaction. The icons are local SVGs
 * loaded with a plain <img>, decorative only (`alt=""` + `aria-hidden`), since
 * the visible label already names each audience.
 */

type Audience = {
  label: string
  icon: string
}

const AUDIENCES: Audience[] = [
  { label: 'Hogares', icon: '/icons/audience/home.svg' },
  { label: 'Empresas', icon: '/icons/audience/business.svg' },
  { label: 'Fincas', icon: '/icons/audience/farm.svg' },
  { label: 'Instituciones', icon: '/icons/audience/institution.svg' },
]

export function AudienceStrip() {
  return (
    <section className="audience" aria-labelledby="audience-label">
      <div className="container audience__inner">
        <h2 className="audience__label" id="audience-label">Atendemos a</h2>

        <ul className="audience__items">
          {AUDIENCES.map((a) => (
            <li className="audience__item" key={a.label}>
              <span className="audience__icon">
                <img src={a.icon} alt="" aria-hidden="true" width={32} height={32} />
              </span>
              <span className="audience__text">{a.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
