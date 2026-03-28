/* ─────────────────────────────────────────────────────────────
   MONITORINC — design copied from mazehq.com
   ───────────────────────────────────────────────────────────── */
import { Hero } from '../components/hero/Hero'

const SERVICES = [
  { num: '01', title: 'Circuito cerrado de televisión',       badge: 'CCTV',    color: 'cyan',  desc: 'Cámaras IP y análogas para prevención, disuasión y control de riesgos. Combate la inseguridad, pérdida de elementos y permite control de personal y procesos.' },
  { num: '02', title: 'Control de acceso',                    badge: 'Acceso',  color: 'cyan',  desc: 'Regulación de entrada y salida de personas y vehículos. RFID, código de barras, huellas dactilares y reconocimiento facial.' },
  { num: '03', title: 'Alarmas de intrusión',                 badge: 'Alarma',  color: 'red',   desc: 'Sistemas alámbricos e inalámbricos para interior y exterior con monitoreo remoto desde el celular.' },
  { num: '04', title: 'Seguridad perimetral',                 badge: 'Perímetro', color: 'red', desc: 'Cercas eléctricas y concertinas con alarmas sonoras para fincas, conjuntos cerrados e instituciones educativas.' },
  { num: '05', title: 'Detección de incendios y evacuación',  badge: 'Incendio', color: 'red',  desc: 'Sistemas automáticos de detección y audio evacuación con equipos regidos por normas europeas.' },
  { num: '06', title: 'GPS y rastreo',                        badge: 'GPS',     color: 'cyan',  desc: 'Posicionamiento y rastreo de automóviles, motos y bicicletas con monitoreo GSM vía SMS o internet.' },
  { num: '07', title: 'Automatización de puertas',            badge: 'Auto',    color: 'green', desc: 'Motores de última generación para puertas batientes, basculantes y corredizas con controles inalámbricos.' },
  { num: '08', title: 'Domótica',                             badge: 'Smart',   color: 'green', desc: 'Control inalámbrico de luces, temperatura, electrodomésticos y sensores. Gestión de energía en tiempo real.' },
  { num: '09', title: 'Citofonía y videocitofonía',           badge: 'IP',      color: 'cyan',  desc: 'Sistemas IP y análogos con o sin video para casas, apartamentos, oficinas y empresas sin límite de usuarios.' },
  { num: '10', title: 'Drones',                               badge: 'UAV',     color: 'cyan',  desc: 'Vigilancia rural y urbana, cartografía aérea en alta definición e inspección de construcciones.' },
]

const TESTIMONIALS = [
  { quote: 'MONITORINC diseñó e integró todo el sistema de CCTV y control de acceso de nuestra planta. Profesionales expertos y tecnología de primera.', author: 'Director de Seguridad', role: 'Empresa industrial · Medellín' },
  { quote: 'Instalaron cercas eléctricas y alarmas en nuestra finca. El resultado superó nuestras expectativas en calidad y tiempo de respuesta.', author: 'Propietario', role: 'Finca privada · Antioquia' },
  { quote: 'El sistema de detección de incendios cumplió todas las normas requeridas por el ente certificador. Muy recomendados.', author: 'Gerente Administrativo', role: 'Institución educativa · Colombia' },
]

const STATS = [
  { num: '10+', label: 'Soluciones integradas' },
  { num: '24/7', label: 'Monitoreo continuo' },
  { num: '360°', label: 'Cobertura total' },
  { num: '∞',    label: 'Usuarios citofonía' },
]

/* ─── Hotspot data (hero graphic, like Maze CVE hotspots) ─── */
const HOTSPOTS = [
  { color: 'red',   delay: 0,     top: '18%', left: '12%', label: 'Zona A',   status: 'Alarma activa',     badge: 'ALERTA' },
  { color: 'cyan',  delay: 1200,  top: '55%', left: '8%',  label: 'Cámara 01', status: 'En línea · 4K',    badge: 'ACTIVO' },
  { color: 'green', delay: 2400,  top: '30%', left: '65%', label: 'Acceso',    status: 'Autorizado',       badge: 'OK' },
  { color: 'red',   delay: 600,   top: '70%', left: '55%', label: 'Sensor P2', status: 'Movimiento detectado', badge: 'ALERTA' },
  { color: 'cyan',  delay: 1800,  top: '12%', left: '45%', label: 'GPS Flota', status: 'Rastreando · 3 veh', badge: 'ACTIVO' },
]

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
        <span>Distribuimos e integramos equipos de seguridad electrónica y comunicación</span>
        <span className="s-alert__accent">Making life safer</span>
      </div>

      {/* ── Header ────────────────────────────────────────── */}
      <header className="s-header">
        <div className="wrap s-header__inner">
          <a href="#inicio" className="s-header__logo">MONITORINC</a>

          <nav>
            <ul className="s-header__nav">
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#proyectos">Proyectos</a></li>
              <li><a href="#ventajas">Ventajas</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </nav>

          <a href="#contacto" className="a-button a-button--secondary">
            Agenda una cita
          </a>
        </div>
      </header>

      <main>
        {/* ══════════════════════════════════════════════════
            HERO — canvas particle halo
        ══════════════════════════════════════════════════ */}
        <Hero />

        {/* ══════════════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════════════ */}
        <div style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
          <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--card-border)' }}>
            {STATS.map((s) => (
              <div key={s.label} className="c-stat-box" style={{ borderRadius: 0, border: 'none', padding: '2rem 1.5rem', textAlign: 'center' }}>
                <div className="c-stat-box__number">{s.num}</div>
                <div className="c-stat-box__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            SECTION 01 — SERVICES
        ══════════════════════════════════════════════════ */}
        <section className="module--story" id="servicios">
          <div className="wrap">
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem', alignItems: 'end' }}>
              <div>
                <SectionLabel num="01" text="Servicios" />
                <h2 className="m-story__title" style={{ maxWidth: '100%' }}>
                  Un portafolio completo para seguridad y monitoreo.
                </h2>
              </div>
              <p className="m-story__body">
                Desde hogares y oficinas hasta proyectos de alto nivel en
                ciudades, pueblos, corregimientos y zonas de difícil acceso.
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

        {/* ══════════════════════════════════════════════════
            SECTION 02 — SPECIAL PROJECTS
        ══════════════════════════════════════════════════ */}
        <section className="module--story" id="proyectos">
          <div className="wrap">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
              {/* Left — copy */}
              <div>
                <SectionLabel num="02" text="Proyectos especiales" />
                <h2 className="m-story__title">
                  Diseño e implementación de proyectos de alto nivel.
                </h2>
                <p className="m-story__body">
                  Contamos con profesionales expertos en ingeniería
                  electrónica y telecomunicaciones para proyectos que
                  requieren equipos y comunicaciones especiales, incluso en
                  ambientes hostiles y de difícil acceso.
                </p>

                <ul className="c-bullet-list">
                  {[
                    'Diseño técnico y despliegue de soluciones especializadas',
                    'Implementación en zonas urbanas, rurales y remotas',
                    'Integración de seguridad, monitoreo y comunicación',
                    'Equipos y comunicaciones para ambientes hostiles',
                    'Ciudades, pueblos, corregimientos y zonas de difícil acceso',
                  ].map((item) => (
                    <li key={item} className="c-bullet-list__item">
                      <span className="c-bullet-list__dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — capabilities panel */}
              <div id="ventajas">
                <SectionLabel num="03" text="Ventajas" />
                <h2 className="m-story__title">
                  Lo que hace fuerte a MONITORINC.
                </h2>

                {/* Capability cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', borderRadius: '0.625rem', overflow: 'hidden', marginTop: '1.5rem' }}>
                  {[
                    { title: 'Integración completa',     desc: 'Una sola empresa para seguridad electrónica, acceso, automatización y comunicaciones.' },
                    { title: 'Tecnología adaptable',     desc: 'Soluciones alámbricas, inalámbricas, IP y análogas según el entorno y nivel de protección requerido.' },
                    { title: 'Múltiples sectores',       desc: 'Casas, apartamentos, empresas, fincas, conjuntos cerrados, instituciones y proyectos especiales.' },
                    { title: 'Soporte especializado',    desc: 'Ingenieros con experiencia en electrónica y telecomunicaciones para acompañamiento técnico completo.' },
                  ].map((a) => (
                    <div key={a.title} className="c-service" style={{ borderRadius: 0, border: 'none' }}>
                      <div className="c-service__title" style={{ marginBottom: '0.5rem' }}>{a.title}</div>
                      <p className="c-service__desc">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════════ */}
        <section className="module--story">
          <div className="wrap">
            <SectionLabel num="04" text="Testimonios" />
            <h2 className="m-story__title" style={{ marginBottom: '2rem' }}>
              Lo que dicen nuestros clientes.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--card-border)', borderRadius: '0.625rem', overflow: 'hidden' }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.author} className="c-testimonial" style={{ borderRadius: 0 }}>
                  <p className="c-testimonial__quote">{t.quote}</p>
                  <div className="c-testimonial__author">{t.author}</div>
                  <div className="c-testimonial__role">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            CTA
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
                  Atención comercial y asesoría para proyectos de seguridad
                  electrónica y comunicación en toda Colombia.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { label: 'Celular 1',        val: '313 8407090',         href: 'https://wa.me/573138407090', blank: true },
                    { label: 'Celular 2',        val: '321 3002548',         href: 'https://wa.me/573213002548', blank: true },
                    { label: 'Correo principal', val: 'info@monitorinc.com.co', href: 'mailto:info@monitorinc.com.co' },
                    { label: 'Correo adicional', val: 'ing.jimenez@outlook.com', href: 'mailto:ing.jimenez@outlook.com' },
                    { label: 'Sitio web',        val: 'www.monitorinc.com.co',  href: 'https://www.monitorinc.com.co', blank: true },
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
