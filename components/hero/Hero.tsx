'use client'

import Image from 'next/image'
import { HeroBackground } from './HeroBackground'

const CLIENTS = ['Hogares', 'Empresas', 'Fincas', 'Instituciones']

export function Hero() {
  return (
    <section
      id="inicio"
      style={{
        position:       'relative',
        minHeight:      '92vh',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
        padding:        'clamp(80px, 12vw, 120px) 24px clamp(64px, 10vw, 96px)',
        background:     '#0F1523',
      }}
    >
      <HeroBackground />

      {/* ── Content — sits above canvas ── */}
      <div
        style={{
          position:      'relative',
          zIndex:        10,
          textAlign:     'center',
          maxWidth:      '660px',
          width:         '100%',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
        }}
      >

        {/* Badge pill */}
        <div
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            8,
            padding:        '5px 14px',
            borderRadius:   999,
            border:         '1px solid rgba(2, 232, 255, 0.18)',
            background:     'rgba(2, 232, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            marginBottom:   24,
          }}
        >
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#02E8FF',
            boxShadow:  '0 0 7px rgba(2, 232, 255, 0.7)',
            flexShrink: 0,
          }} />
          <span style={{
            fontSize:      11,
            fontFamily:    'var(--font-sans)',
            fontWeight:    500,
            color:         'rgba(214, 216, 216, 0.55)',
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
          }}>
            Seguridad electrónica · Colombia
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      'clamp(2.8rem, 7.5vw, 5.2rem)',
            fontWeight:    700,
            lineHeight:    1.02,
            letterSpacing: '-0.038em',
            color:         '#eff0f0',
            margin:        '0 0 20px',
          }}
        >
          Haz de cada espacio
          <br />
          <span style={{
            background:           'linear-gradient(to right, #00E7FB, #e628ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
          }}>
            un lugar seguro.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(15px, 2vw, 17px)',
          fontWeight: 300,
          lineHeight: 1.72,
          color:      'rgba(214, 216, 216, 0.44)',
          maxWidth:   430,
          margin:     '0 0 44px',
        }}>
          Distribuimos e integramos equipos de seguridad electrónica y
          comunicación: CCTV, control de acceso, alarmas, GPS, domótica
          y proyectos especiales.
        </p>

        {/* CTAs */}
        <div style={{
          display:        'flex',
          gap:            12,
          justifyContent: 'center',
          flexWrap:       'wrap',
          marginBottom:   48,
        }}>
          <a
            href="https://wa.me/573138407090"
            target="_blank"
            rel="noreferrer"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            8,
              padding:        '11px 26px',
              borderRadius:   999,
              background:     'linear-gradient(to right, #00E7FB, #e628ff)',
              color:          '#000',
              fontFamily:     'var(--font-sans)',
              fontSize:       14,
              fontWeight:     600,
              textDecoration: 'none',
            }}
          >
            WhatsApp 313&nbsp;8407090
          </a>
          <a
            href="#servicios"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              padding:        '11px 26px',
              borderRadius:   999,
              background:     'rgba(242, 244, 245, 0.04)',
              border:         '1px solid rgba(242, 244, 245, 0.12)',
              color:          'rgba(214, 216, 216, 0.75)',
              fontFamily:     'var(--font-sans)',
              fontSize:       14,
              fontWeight:     400,
              textDecoration: 'none',
            }}
          >
            Ver servicios →
          </a>
        </div>

        {/* Client strip */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            20,
          flexWrap:       'wrap',
        }}>
          <span style={{
            fontSize:      11,
            color:         'rgba(255,255,255,0.16)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily:    'var(--font-sans)',
          }}>
            Atendemos a
          </span>
          {CLIENTS.map((c) => (
            <span key={c} style={{
              fontSize:   12,
              color:      'rgba(255,255,255,0.24)',
              fontFamily: 'var(--font-sans)',
            }}>
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position:      'absolute',
        bottom:        28,
        left:          '50%',
        transform:     'translateX(-50%)',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           5,
        zIndex:        10,
      }}>
        <span style={{
          fontSize:      10,
          color:         'rgba(255,255,255,0.16)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontFamily:    'var(--font-sans)',
        }}>
          Scroll
        </span>
        <div style={{
          width:      1,
          height:     26,
          background: 'linear-gradient(to bottom, rgba(2, 232, 255, 0.4), transparent)',
        }} />
      </div>
    </section>
  )
}
