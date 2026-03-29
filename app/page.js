/* ─────────────────────────────────────────────────────────────
   MONITORINC — design copied from mazehq.com
   ───────────────────────────────────────────────────────────── */
import { Hero } from '../components/hero/Hero'
import { PDF_ABOUT, PDF_SERVICES, PDF_BRANDS, PDF_CONTACT } from './components/PdfContent'

const SERVICES = PDF_SERVICES.map((s, idx) => {
  const num = String(idx + 1).padStart(2, '0')
  // Badges/colors are UI-only; keep generic.
  return {
    num,
    title: s.title,
    badge: 'SERVICIO',
    color: idx % 2 === 0 ? 'cyan' : 'green',
    desc: s.desc,
  }
})

// Nota: el PDF no incluye testimonios ni cifras (años, cobertura, 24/7, etc.).
// Para cumplir "únicamente la información del PDF", se dejan vacíos.
const TESTIMONIALS = []

const STATS = []

/* ─── Hotspot data (hero graphic, like Maze CVE hotspots) ─── */
// Nota: el PDF no incluye datos como "Zona A", "4K", "Sensor P2", etc.
// Para cumplir "únicamente la información del PDF", no se inventan hotspots.
const HOTSPOTS = []

/* ─── Component: Hero graphic panel ─────────────────────────── */
function HeroGraphic() {
  return (
    <div className="m-welcome__graphic" aria-hidden="true">
      {/* Outer panel card */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(242,244,245,0.03)',
        border: '1px solid var(--card-border)',
        borderRadius: '1rem',
        backdropFilter: 'blur(4px)',
        overflow: 'hidden',
      }}>
        {/* Inner grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(214,216,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(214,216,216,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '36px',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex', alignItems: 'center',
          padding: '0 14px', gap: '8px',
        }}>
          {['#E42269','#2FD48D','rgba(214,216,216,0.2)'].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          ))}
          <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-sans)', letterSpacing: '0.06em' }}>
            MONITORINC · Panel de monitoreo
          </span>
        </div>

        {/* Hotspot indicators */}
        {HOTSPOTS.map((h, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: h.top,
              left: h.left,
              '--delay': `${h.delay}ms`,
            }}
          >
            <div className={`hotspot hotspot--${h.color}`}>
              <div className="hotspot__inner" />
              <div className="hotspot__ring" />
            </div>
            {/* Label card — Maze-style UI box */}
            <div style={{
              position: 'absolute',
              top: '-2px', left: '20px',
              background: 'rgba(15,21,35,0.92)',
              border: '1px solid var(--card-border)',
              borderRadius: 6,
              padding: '6px 10px',
              minWidth: 140,
              backdropFilter: 'blur(8px)',
              animation: `hotspot-inner 5s var(--easing) infinite`,
              animationDelay: `${h.delay}ms`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--text)' }}>{h.label}</span>
                <span className={`a-badge a-badge--${h.color}`}>{h.badge}</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{h.status}</span>
            </div>
          </div>
        ))}

        {/* Bottom summary strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          borderTop: '1px solid var(--card-border)',
          padding: '10px 14px',
          display: 'flex', gap: 16, alignItems: 'center',
          background: 'rgba(15,21,35,0.7)',
        }}>
          {[
            { label: 'Cámaras activas', val: '14/14', c: 'var(--green)' },
            { label: 'Alertas hoy',     val: '2',     c: 'var(--red)' },
            { label: 'GPS en línea',    val: '3/3',   c: 'var(--cyan)' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 15, fontFamily: 'var(--font-sans)', fontWeight: 500, color: s.c }}>{s.val}</span>
              <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Component: Section label (Maze-style numbered) ─────────── */
function SectionLabel({ num, text }) {
  return (
    <div className="m-story__section-label">
      {num} — {text}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* ── Alert bar ─────────────────────────────────────── */}
      <div className="s-alert">
        <span className="s-alert__dot" />
        <span>Distribuimos e integramos equipos de seguridad electrónica y de comunicación</span>
        <span className="s-alert__accent">Somos los mejores en seguridad electrónica</span>
      </div>

      {/* ── Header ────────────────────────────────────────── */}
      <header className="s-header">
        <div className="wrap s-header__inner">
          <a href="#inicio" className="s-header__logo">MONITORINC</a>

          <nav>
            <ul className="s-header__nav">
              <li><a href="#quienes-somos">Quiénes somos</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#marcas">Marcas</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </nav>

          <a href="#contacto" className="a-button a-button--secondary">
            Agenda una cita para asesorar tu proyecto
          </a>
        </div>
      </header>

      <main>
        {/* Anchor */}
        <div id="inicio" />

        {/* ══════════════════════════════════════════════════
            HERO — canvas particle halo
        ══════════════════════════════════════════════════ */}
        <Hero />

        {/* ══════════════════════════════════════════════════
            QUIÉNES SOMOS (PDF)
        ══════════════════════════════════════════════════ */}
        <section className="module--story" id="quienes-somos">
          <div className="wrap">
            <SectionLabel num="01" text={PDF_ABOUT.title} />
            <h2 className="m-story__title" style={{ maxWidth: '55ch' }}>
              {PDF_ABOUT.title}
            </h2>
            <p className="m-story__body" style={{ maxWidth: '85ch' }}>
              {PDF_ABOUT.body}
            </p>
          </div>
        </section>

        {/* Nota: El PDF no incluye estadísticas/cifras. Se omite barra de stats. */}

        {/* ══════════════════════════════════════════════════
            SECTION 01 — SERVICES
        ══════════════════════════════════════════════════ */}
        <section className="module--story" id="servicios">
          <div className="wrap">
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem', alignItems: 'end' }}>
              <div>
                <SectionLabel num="02" text="Servicios" />
                <h2 className="m-story__title" style={{ maxWidth: '100%' }}>
                  Un portafolio completo para seguridad y monitoreo.
                </h2>
              </div>
              <p className="m-story__body">
                {PDF_ABOUT.body}
              </p>
            </div>

            {/* Services grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--card-border)', borderRadius: '0.625rem', overflow: 'hidden' }}>
              {SERVICES.map((s) => (
                <article key={s.num} className="c-service" style={{ borderRadius: 0, border: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div className="c-service__num">{s.num}</div>
                    <span className={`a-badge a-badge--${s.color}`}>{s.badge}</span>
                  </div>
                  <div className="c-service__title">{s.title}</div>
                  <p className="c-service__desc">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Nota: marcas se muestran en el HERO directamente bajo "Atendemos a". */}

        {/* Nota: el PDF no incluye testimonios. Se omite sección de testimonios. */}

        {/* ══════════════════════════════════════════════════
            CTA (PDF)
        ══════════════════════════════════════════════════ */}
        <div className="module--cta">
          <div className="wrap">
            <div className="m-cta__box">
              <div className="m-cta__glow" />

              <div style={{ position: 'relative' }}>
                <div className="m-welcome__eyebrow" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span className="s-alert__dot" />
                  Asesoría sin costo
                </div>

                <h2 className="m-cta__title">
                  Agenda una cita para asesorar tu proyecto.
                </h2>
                <p className="m-cta__sub">
                  Cuéntanos qué necesitas y te ayudamos a elegir e integrar
                  la solución adecuada para tu espacio, operación o
                  infraestructura.
                </p>

                <div className="m-cta__actions">
                  <a
                    href="https://wa.me/573138407090"
                    target="_blank"
                    rel="noreferrer"
                    className="a-button a-button--primary"
                  >
                    <span className="a-button__dot" />
                    WhatsApp 313&nbsp;8407090
                  </a>
                  <a
                    href="mailto:info@monitorinc.com.co"
                    className="a-button a-button--secondary"
                  >
                    info@monitorinc.com.co
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            CONTACT
        ══════════════════════════════════════════════════ */}
        <section className="module--story" id="contacto">
          <div className="wrap">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
              {/* Left */}
              <div>
                <SectionLabel num="05" text="Contacto" />
                <h2 className="m-story__title">
                  Estamos listos para hacer de cada lugar un espacio más
                  seguro.
                </h2>
                <p className="m-story__body" style={{ marginBottom: '2rem' }}>
                  {PDF_CONTACT.cta}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { label: 'Celular 1',        val: PDF_CONTACT.phones[0], href: 'https://wa.me/573138407090', blank: true },
                    { label: 'Celular 2',        val: PDF_CONTACT.phones[1], href: 'https://wa.me/573213002548', blank: true },
                    { label: 'Correo principal', val: PDF_CONTACT.emails[0].toLowerCase(), href: 'mailto:info@monitorinc.com.co' },
                    { label: 'Correo adicional', val: PDF_CONTACT.emails[2], href: 'mailto:ing.jimenez@outlook.com' },
                    { label: 'Correo adicional', val: PDF_CONTACT.emails[1], href: 'mailto:luquesarmiento@gmail.com' },
                    { label: 'Sitio web',        val: PDF_CONTACT.website, href: 'https://www.monitorinc.com.co', blank: true },
                  ].map((c) => (
                    <div key={c.label} className="c-contact-line">
                      <span className="c-contact-line__label">{c.label}</span>
                      <a
                        className="c-contact-line__value"
                        href={c.href}
                        target={c.blank ? '_blank' : undefined}
                        rel={c.blank ? 'noreferrer' : undefined}
                      >
                        {c.val}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — capability summary */}
              <div>
                <div className="c-ui-box" style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', fontFamily: 'var(--font-sans)' }}>
                    Resumen de capacidades
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--card-border)', borderRadius: 6, overflow: 'hidden' }}>
                    {[
                      { title: 'Seguridad',      desc: 'CCTV · Alarmas · Perimetral · Incendios', badge: 'red' },
                      { title: 'Acceso',         desc: 'RFID · Biometría · Gestión vehicular',    badge: 'cyan' },
                      { title: 'Automatización', desc: 'Puertas automáticas · Domótica',           badge: 'green' },
                      { title: 'Monitoreo',      desc: 'GPS · Drones · Comunicaciones especiales', badge: 'cyan' },
                    ].map((item) => (
                      <div key={item.title} style={{ padding: '1rem', background: 'var(--bg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.title}</span>
                          <span className={`a-badge a-badge--${item.badge}`} style={{ fontSize: 9 }}>▸</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact quick links */}
                <div className="c-ui-box" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href="https://wa.me/573138407090" target="_blank" rel="noreferrer" className="a-button a-button--primary" style={{ flex: 1, minWidth: 'fit-content', justifyContent: 'center' }}>
                    <span className="a-button__dot" />
                    WhatsApp
                  </a>
                  <a href="mailto:info@monitorinc.com.co" className="a-button a-button--secondary" style={{ flex: 1, minWidth: 'fit-content', justifyContent: 'center' }}>
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="s-footer">
        <div className="wrap s-footer__inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="s-footer__brand">MONITORINC</span>
            <span className="s-footer__copy">
              Distribuimos e integramos equipos de seguridad electrónica y comunicación.
            </span>
          </div>

          <nav>
            <ul className="s-footer__links">
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#proyectos">Proyectos</a></li>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="mailto:info@monitorinc.com.co">info@monitorinc.com.co</a></li>
            </ul>
          </nav>

          <span className="s-footer__copy">© 2026 MONITORINC</span>
        </div>
      </footer>
    </>
  )
}
