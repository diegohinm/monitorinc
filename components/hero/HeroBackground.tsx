'use client'

import { useState, useEffect } from 'react'
import SoftMass from './SoftMass'
import OrbitingHotspot from './OrbitingHotspot'
import EmergingLabel from './EmergingLabel'
import type { LabelStatus } from './types'

// ─── Label definitions ────────────────────────────────────────────────────────
// Staggered delays ensure at most 2 labels are visible at the same time
// on desktop, and at most 1 on mobile (handled by slicing).
//
// Timing math per label:
//   first appear = delay ms
//   visible for  = activeDuration ms
//   idle for     = idleDuration ms
//   cycle        = activeDuration + idleDuration

interface LabelDef {
  id: string
  text: string
  status: LabelStatus
  // position within the hero (% units for left/top, or right/top)
  left?: string
  right?: string
  top: string
  activeDuration: number
  idleDuration: number
  delay: number
  // orbit params for its hotspot
  orbitX: number
  orbitY: number
  orbitDuration: number
  orbitDelay: number
}

const LEFT_LABELS: LabelDef[] = [
  {
    id: 'cam01',
    text: 'Cámara 01',
    status: 'ok',
    left: '7%',
    top: '24%',
    activeDuration: 2800,
    idleDuration: 6400,
    delay: 1200,
    orbitX: 14,
    orbitY: 9,
    orbitDuration: 14,
    orbitDelay: 0,
  },
  {
    id: 'intruder',
    text: 'Intruso detectado',
    status: 'alert',
    left: '5%',
    top: '56%',
    activeDuration: 3200,
    idleDuration: 7600,
    delay: 6800,
    orbitX: 10,
    orbitY: 13,
    orbitDuration: 18,
    orbitDelay: 5,
  },
  {
    id: 'fire',
    text: 'Incendios',
    status: 'warning',
    left: '10%',
    top: '40%',
    activeDuration: 2600,
    idleDuration: 7000,
    delay: 3800,
    orbitX: 12,
    orbitY: 8,
    orbitDuration: 16,
    orbitDelay: 3,
  },
]

const RIGHT_LABELS: LabelDef[] = [
  {
    id: 'gps',
    text: 'GPS Flota',
    status: 'neutral',
    right: '7%',
    top: '20%',
    activeDuration: 3000,
    idleDuration: 6800,
    delay: 2600,
    orbitX: 12,
    orbitY: 10,
    orbitDuration: 12,
    orbitDelay: 2,
  },
  {
    id: 'access',
    text: 'Acceso OK',
    status: 'ok',
    right: '5%',
    top: '60%',
    activeDuration: 2500,
    idleDuration: 7400,
    delay: 5400,
    orbitX: 10,
    orbitY: 14,
    orbitDuration: 16,
    orbitDelay: 6,
  },
  {
    id: 'alarm',
    text: 'Alarma activa',
    status: 'alert',
    right: '9%',
    top: '38%',
    activeDuration: 3400,
    idleDuration: 6200,
    delay: 9200,
    orbitX: 8,
    orbitY: 11,
    orbitDuration: 13,
    orbitDelay: 4,
  },
]

// ─── SSR-safe mobile hook ─────────────────────────────────────────────────────
function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// ─── Label anchor ─────────────────────────────────────────────────────────────
function LabelAnchor({ def, mobile }: { def: LabelDef; mobile: boolean }) {
  // On mobile, push anchors further into the frame edges and lower vertically
  // to stay clear of the headline text
  const style: React.CSSProperties = {
    position: 'absolute',
    top:      mobile ? '68%' : def.top,
    zIndex:   2,
    // Align labels flush to the mass side; right-anchored labels use `right`
    ...(def.left  !== undefined ? { left:  mobile ? '4%' : def.left  } : {}),
    ...(def.right !== undefined ? { right: mobile ? '4%' : def.right } : {}),
  }

  return (
    <div style={style}>
      <OrbitingHotspot
        radiusX={def.orbitX}
        radiusY={def.orbitY}
        duration={def.orbitDuration}
        delay={def.orbitDelay}
      >
        <EmergingLabel
          text={def.text}
          status={def.status}
          activeDuration={def.activeDuration}
          idleDuration={def.idleDuration}
          delay={def.delay}
        />
      </OrbitingHotspot>
    </div>
  )
}

// ─── Main export — named to match existing Hero.tsx import ───────────────────
export function HeroBackground() {
  const isMobile = useMobile()

  // Desktop: all 3 per side. Mobile: 1 per side (staggered so they rarely overlap)
  const leftVisible  = isMobile ? LEFT_LABELS.slice(0, 1)  : LEFT_LABELS
  const rightVisible = isMobile ? RIGHT_LABELS.slice(0, 1) : RIGHT_LABELS

  // Masses shrink slightly on mobile
  const ms = isMobile ? 0.58 : 1

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'absolute',
        inset:         0,
        overflow:      'hidden',
        pointerEvents: 'none',
        zIndex:        0,
        background:    '#0B0F17',
      }}
    >
      {/* ── 1. Soft ambient masses ─────────────────────────────────────── */}

      {/* Left mass — blue-violet */}
      <SoftMass
        size={Math.round(500 * ms)}
        initialX="22%"
        initialY="54%"
        colorA="rgba(96, 120, 255, 0.58)"
        colorB="rgba(96, 120, 255, 0.18)"
        opacity={isMobile ? 0.17 : 0.22}
        blur={isMobile ? 80 : 134}
        orbitRadiusX={26}
        orbitRadiusY={16}
        duration={28}
        scaleMin={0.98}
        scaleMax={1.04}
        delay={0}
      />

      {/* Right mass — cyan */}
      <SoftMass
        size={Math.round(440 * ms)}
        initialX="78%"
        initialY="46%"
        colorA="rgba(100, 210, 255, 0.52)"
        colorB="rgba(100, 210, 255, 0.14)"
        opacity={isMobile ? 0.13 : 0.19}
        blur={isMobile ? 72 : 122}
        orbitRadiusX={18}
        orbitRadiusY={28}
        duration={22}
        scaleMin={0.98}
        scaleMax={1.03}
        delay={8}
      />

      {/* Bottom-center mass — purple accent (desktop only) */}
      {!isMobile && (
        <SoftMass
          size={360}
          initialX="50%"
          initialY="74%"
          colorA="rgba(140, 120, 255, 0.46)"
          colorB="rgba(140, 120, 255, 0.12)"
          opacity={0.16}
          blur={114}
          orbitRadiusX={30}
          orbitRadiusY={12}
          duration={26}
          scaleMin={0.98}
          scaleMax={1.04}
          delay={5}
        />
      )}

      {/* ── 2. Subtle radial centre glow (depth anchor) ────────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: `
            radial-gradient(
              ellipse 58% 52% at 50% 48%,
              rgba(62, 110, 255, 0.09) 0%,
              rgba(62, 110, 255, 0.03) 50%,
              transparent 72%
            )
          `,
        }}
      />

      {/* ── 3. Emerging label hotspots ─────────────────────────────────── */}
      {leftVisible.map((def) => (
        <LabelAnchor key={def.id} def={def} mobile={isMobile} />
      ))}
      {rightVisible.map((def) => (
        <LabelAnchor key={def.id} def={def} mobile={isMobile} />
      ))}

      {/* ── 4. Bottom section fade ─────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     220,
          background: 'linear-gradient(to bottom, transparent, #0B0F17)',
          zIndex:     3,
        }}
      />

      {/* ── 5. Edge vignette — darkens corners for depth ──────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: `
            radial-gradient(
              ellipse 110% 110% at 50% 50%,
              transparent 46%,
              rgba(4, 6, 14, 0.62) 100%
            )
          `,
        }}
      />
    </div>
  )
}
