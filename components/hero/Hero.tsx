'use client'

/**
 * ═══════════════════════════════════════════════════════════════════
 *  WHAT CHANGED VS THE PREVIOUS VERSION AND WHY
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. Background darkened from #0F1523 → #0B0F17.
 *     Deeper base makes the soft masses read as glows rather than
 *     coloured circles and increases perceived depth.
 *
 *  2. Vertical padding increased (96→140 px top, 72→108 px bottom).
 *     More negative space keeps the fold from feeling crowded and
 *     lets the atmospheric background breathe around the headline.
 *
 *  3. Secondary elements (badge, clients, scroll cue) toned down.
 *     Lower opacity, thinner borders, subtler glow — so the eye
 *     goes:  headline → subtitle → CTA → atmosphere.
 *     Everything below the CTA is supporting texture, not content.
 *
 *  4. Spacing between CTA and client strip widened (48 → 56 px).
 *     Creates a clearer separation between the action area and the
 *     trust row, reducing visual density above the fold.
 *
 *  5. Removed unused `Image` import.
 * ═══════════════════════════════════════════════════════════════════
 */

import { HeroBackground } from './HeroBackground'
import { BrandsMarquee } from './BrandsMarquee'
import { AgendarDemoButton } from '../ui/AgendarDemoButton'
import './hero-text-anim.css'

const CLIENTS = ['Hogares', 'Empresas', 'Fincas', 'Instituciones']

const PROVIDERS = ['Samsung', 'Bosch', 'ZKTeco', 'Dahua Technology', 'Axis Communications', 'Hikvision', 'Paradox Security Systems']

export function Hero() {
  return (
    <section
      id="inicio"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: 'clamp(96px, 14vw, 140px) 24px clamp(72px, 12vw, 108px)',
        background: '#0B0F17',
      }}
    >
      <HeroBackground />

      {/* ── Content — z-10, always above the atmosphere ────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '640px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Badge pill — very subtle, almost atmospheric itself */}
        <div className="hero-anim hero-anim--1"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 999,
            border: '1px solid rgba(2, 232, 255, 0.12)',
            background: 'rgba(2, 232, 255, 0.04)',
            backdropFilter: 'blur(8px)',
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#02E8FF',
              boxShadow: '0 0 6px rgba(2, 232, 255, 0.5)',
              flexShrink: 0,
            }}
          />

        </div>

        {/* Headline */}
        <h1 className="hero-anim hero-anim--2"
          style={{
            fontFamily: "var(--font-sans, 'Space Grotesk')",
            fontSize: 'clamp(2.8rem, 7.5vw, 5.2rem)',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.038em',
            color: 'rgba(245, 248, 255, 0.98)',
            margin: '0 0 24px',
          }}
        >
          Haz de cada espacio
          <br />
          <span
            style={{
              color: 'rgba(245, 248, 255, 0.98)',
            }}
          >
            un lugar seguro.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-anim hero-anim--3"
          style={{
            fontFamily: "var(--font-sans, 'Space Grotesk')",
            fontSize: 'clamp(15px, 2vw, 17px)',
            fontWeight: 300,
            lineHeight: 1.72,
            color: 'rgba(245, 248, 255, 0.58)',
            maxWidth: 420,
            margin: '0 0 48px',
          }}
        >
          Distribuimos e integramos equipos de seguridad electrónica y
          comunicación: CCTV, control de acceso, alarmas, GPS, domótica y
          proyectos especiales.
        </p>

        {/* CTAs */}
        <div className="hero-anim hero-anim--4"
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 56,
          }}
        >
          {/* Unified CTA button */}
          <AgendarDemoButton />

        </div>

        {/* Providers label + brands marquee */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.14)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Proveedores:
          </span>
        </div>

        <BrandsMarquee />

        {/* Client strip — below brands */}
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.12)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Atendemos a
          </span>
          {CLIENTS.map((c) => (
            <span
              key={c}
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.18)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.12)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 26,
            background:
              'linear-gradient(to bottom, rgba(2, 232, 255, 0.3), transparent)',
          }}
        />
      </div>
    </section>
  )
}
