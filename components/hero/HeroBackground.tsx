'use client'

/**
 * ═══════════════════════════════════════════════════════════════════
 *  WHAT CHANGED VS THE PREVIOUS VERSION AND WHY
 * ═══════════════════════════════════════════════════════════════════
 *
 *  1. Labels are now NESTED INSIDE their parent SoftMass.
 *     Previously they were absolutely positioned at the hero level,
 *     next to the masses but visually separate. That made them look
 *     like floating widgets rather than events emerging from an
 *     atmospheric glow. Nesting them inside the mass bounding box
 *     ties them to the glow spatially.
 *
 *  2. Unified cycle period (CYCLE_PERIOD = 10 000 ms).
 *     Previously each label had independent cycle timing, which
 *     caused drift: after a few minutes, 3+ labels could be visible
 *     at once and the scene felt crowded. A shared period + even
 *     stagger (period / 6 ≈ 1 667 ms) guarantees max 2 visible
 *     simultaneously, forever, with no coordinator overhead.
 *
 *  3. Added subtle grid / noise overlay.
 *     A barely visible grid (0.018 opacity) masked with a radial
 *     gradient adds depth without adding UI weight — the kind of
 *     background texture that feels "premium" without being noticed.
 *
 *  4. Expanded edge vignette and centre glow.
 *     The previous vignette was too small and the centre glow too
 *     bright. Both are now wider and softer, making the entire scene
 *     feel like one continuous atmosphere rather than a spotlight in
 *     the middle with dark corners.
 *
 *  5. Mass opacity and blur tweaked down.
 *     The previous values (opacity 0.22, blur 134) were slightly too
 *     vivid and made the masses feel like coloured circles. Lowering
 *     opacity to 0.18–0.20 and blur to 120–130 makes them merge
 *     more with the background.
 *
 *  NET RESULT:
 *  The hero goes from "dark background + floating cards + visible
 *  widgets" to "a single living atmosphere where technical events
 *  surface briefly and dissolve back into the glow."
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react'
import SoftMass from './SoftMass'
import OrbitingHotspot from './OrbitingHotspot'
import EmergingLabel from './EmergingLabel'
import { ParticleSphere } from './ParticleSphere'
import type { LabelStatus } from './types'

// ─── Timing system ──────────────────────────────────────────────────────────
//
// All labels share the same total cycle period so their overlaps are
// deterministic. With 6 labels staggered by CYCLE / 6, consecutive
// labels overlap briefly (≈ 1.1 s) producing max 2 visible at once.
//
//   visible ratio per label ≈ 2 800 / 10 000 = 28 %
//   expected visible at any t ≈ 6 × 0.28 = 1.68 → rounds to 1 or 2

const CYCLE_PERIOD = 10_000 // ms — shared by every label
const STAGGER = Math.round(CYCLE_PERIOD / 6) // ≈ 1 667 ms

// ─── Label definitions ──────────────────────────────────────────────────────

interface LabelDef {
  text: string
  status: LabelStatus
  activeDuration: number
  delay: number
  anchorX: string // % position within parent SoftMass bounding box
  anchorY: string
  orbitRx: number
  orbitRy: number
  orbitDur: number
  orbitDelay: number
}

// Left mass labels — staggers 0, 2, 4 (even indices)
const LEFT_LABELS: LabelDef[] = [
  {
    text: 'Cámara 01',
    status: 'ok',
    activeDuration: 2800,
    delay: 2000 + 0 * STAGGER,
    anchorX: '58%',
    anchorY: '28%',
    orbitRx: 12,
    orbitRy: 8,
    orbitDur: 14,
    orbitDelay: 0,
  },
  {
    text: 'Intruso detectado',
    status: 'alert',
    activeDuration: 3000,
    delay: 2000 + 2 * STAGGER,
    anchorX: '42%',
    anchorY: '64%',
    orbitRx: 10,
    orbitRy: 14,
    orbitDur: 16,
    orbitDelay: 4,
  },
  {
    text: 'Incendios',
    status: 'warning',
    activeDuration: 2600,
    delay: 2000 + 4 * STAGGER,
    anchorX: '62%',
    anchorY: '48%',
    orbitRx: 8,
    orbitRy: 10,
    orbitDur: 18,
    orbitDelay: 7,
  },
]

// Right mass labels — staggers 1, 3, 5 (odd indices)
// This alternates left-right-left-right in the reveal order.
const RIGHT_LABELS: LabelDef[] = [
  {
    text: 'GPS Flota',
    status: 'neutral',
    activeDuration: 2600,
    delay: 2000 + 1 * STAGGER,
    anchorX: '38%',
    anchorY: '30%',
    orbitRx: 10,
    orbitRy: 12,
    orbitDur: 12,
    orbitDelay: 2,
  },
  {
    text: 'Acceso OK',
    status: 'ok',
    activeDuration: 2800,
    delay: 2000 + 3 * STAGGER,
    anchorX: '54%',
    anchorY: '60%',
    orbitRx: 12,
    orbitRy: 8,
    orbitDur: 15,
    orbitDelay: 5,
  },
  {
    text: 'Alarma activa',
    status: 'alert',
    activeDuration: 3200,
    delay: 2000 + 5 * STAGGER,
    anchorX: '40%',
    anchorY: '46%',
    orbitRx: 8,
    orbitRy: 11,
    orbitDur: 13,
    orbitDelay: 3,
  },
]

// ─── SSR-safe mobile hook ─────────────────────────────────────────────────

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

// ─── Render a set of labels inside a mass ─────────────────────────────────

function MassLabels({ labels }: { labels: LabelDef[] }) {
  return (
    <>
      {labels.map((lbl) => (
        <OrbitingHotspot
          key={lbl.text}
          anchorX={lbl.anchorX}
          anchorY={lbl.anchorY}
          radiusX={lbl.orbitRx}
          radiusY={lbl.orbitRy}
          duration={lbl.orbitDur}
          delay={lbl.orbitDelay}
        >
          <EmergingLabel
            text={lbl.text}
            status={lbl.status}
            activeDuration={lbl.activeDuration}
            idleDuration={CYCLE_PERIOD - lbl.activeDuration}
            delay={lbl.delay}
          />
        </OrbitingHotspot>
      ))}
    </>
  )
}

// ─── Main export — named to match existing Hero.tsx import ────────────────

export function HeroBackground() {
  const isMobile = useMobile()

  // Mobile: 1 label per mass (max 1 on screen). Delays set so the two
  // remaining labels never overlap: left at t=2 s, right at t=7 s.
  // Desktop: all 3 per mass (max 2 on screen thanks to the stagger).
  const leftLabels = isMobile
    ? [{ ...LEFT_LABELS[0], delay: 2000 }]
    : LEFT_LABELS
  const rightLabels = isMobile
    ? [{ ...RIGHT_LABELS[0], delay: 7000 }]
    : RIGHT_LABELS

  const ms = isMobile ? 0.55 : 1

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#0B0F17',
      }}
    >
      {/* ── Particle sphere field (Maze-like) ─────────────────────────── */}
      <ParticleSphere density={isMobile ? 140 : 260} scale={isMobile ? 1.05 : 1.12} />

      {/* ── 1. Left mass — ultra-soft (supporting glow) ───────────────── */}
      <SoftMass
        x={isMobile ? '18%' : '24%'}
        y="56%"
        size={Math.round(520 * ms)}
        colorA="rgba(90, 120, 255, 0.16)"
        colorB="rgba(90, 120, 255, 0.04)"
        opacity={isMobile ? 0.05 : 0.06}
        blur={isMobile ? 96 : 160}
        orbitRadiusX={24}
        orbitRadiusY={16}
        duration={28}
        delay={0}
        scaleMin={0.985}
        scaleMax={1.035}
      >
        <MassLabels labels={leftLabels} />
      </SoftMass>

      {/* ── 2. Right mass — ultra-soft (supporting glow) ─────────────── */}
      <SoftMass
        x={isMobile ? '82%' : '76%'}
        y="44%"
        size={Math.round(460 * ms)}
        colorA="rgba(190, 210, 255, 0.12)"
        colorB="rgba(190, 210, 255, 0.03)"
        opacity={isMobile ? 0.05 : 0.06}
        blur={isMobile ? 96 : 160}
        orbitRadiusX={18}
        orbitRadiusY={28}
        duration={22}
        delay={8}
        scaleMin={0.985}
        scaleMax={1.030}
      >
        <MassLabels labels={rightLabels} />
      </SoftMass>

      {/* ── 3. Bottom-centre mass — purple (desktop only, no labels) ── */}
      {!isMobile && (
        <SoftMass
          x="50%"
          y="76%"
          size={340}
          colorA="rgba(140, 120, 255, 0.42)"
          colorB="rgba(140, 120, 255, 0.10)"
          opacity={0.14}
          blur={114}
          orbitRadiusX={30}
          orbitRadiusY={12}
          duration={26}
          delay={5}
          scaleMin={0.985}
          scaleMax={1.035}
        />
      )}

      {/* ── 4. Subtle centre glow ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              ellipse 56% 50% at 50% 48%,
              rgba(62, 110, 255, 0.07) 0%,
              rgba(62, 110, 255, 0.02) 48%,
              transparent 72%
            )
          `,
        }}
      />

      {/* ── 5. Grain / speckle overlay (Maze-like texture) ───────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.055,
          mixBlendMode: 'soft-light',
          filter: 'blur(0.25px)',
          backgroundImage: `
            radial-gradient(circle at 12% 18%, rgba(255,255,255,0.11) 0 1px, transparent 1.6px),
            radial-gradient(circle at 26% 72%, rgba(255,255,255,0.08) 0 1px, transparent 1.6px),
            radial-gradient(circle at 44% 40%, rgba(255,255,255,0.10) 0 1px, transparent 1.6px),
            radial-gradient(circle at 62% 22%, rgba(255,255,255,0.07) 0 1px, transparent 1.6px),
            radial-gradient(circle at 78% 66%, rgba(255,255,255,0.09) 0 1px, transparent 1.6px),
            radial-gradient(circle at 88% 34%, rgba(255,255,255,0.08) 0 1px, transparent 1.6px),
            radial-gradient(circle at 52% 84%, rgba(255,255,255,0.06) 0 1px, transparent 1.6px),
            radial-gradient(circle at 36% 18%, rgba(255,255,255,0.07) 0 1px, transparent 1.6px)
          `,
          backgroundSize: '240px 240px',
          WebkitMaskImage:
            'radial-gradient(ellipse 72% 62% at 50% 50%, black 0%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 72% 62% at 50% 50%, black 0%, transparent 100%)',
        }}
      />

      {/* ── 6. Bottom section fade ───────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 220,
          background: 'linear-gradient(to bottom, transparent, #0B0F17)',
          zIndex: 3,
        }}
      />

      {/* ── 7. Edge vignette ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(
              ellipse 110% 110% at 50% 50%,
              transparent 42%,
              rgba(4, 6, 14, 0.64) 100%
            )
          `,
        }}
      />
    </div>
  )
}
