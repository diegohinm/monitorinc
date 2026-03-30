'use client'

import { useEffect, useState } from 'react'
import EmergingLabel from './EmergingLabel'
import type { LabelStatus } from './types'
import { useReducedMotionSafe } from './useReducedMotionSafe'

export type ParticleAnchor = {
  x: number
  y: number
}

type LabelDef = {
  text: string
  status: LabelStatus
}

const LABELS: LabelDef[] = [
  { text: 'Cámara 01', status: 'ok' },
  { text: 'Intruso detectado', status: 'alert' },
  { text: 'Incendios', status: 'warning' },
  { text: 'GPS Flota', status: 'neutral' },
  { text: 'Acceso OK', status: 'ok' },
  { text: 'Alarma activa', status: 'alert' },
]

export function ParticleLabels({
  anchors,
  centerX,
  centerY,
  radius,
  parallaxX,
  parallaxY,
  isMobile,
}: {
  anchors: ParticleAnchor[]
  centerX: number
  centerY: number
  radius: number
  parallaxX: number // repurposed: carries frontness from ParticleSphere
  parallaxY: number
  isMobile: boolean
}) {
  const reducedMotion = useReducedMotionSafe()

  // Cycle through labels — synced with ParticleSphere's 5.2s particle pick
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    const period = isMobile ? 6000 : 5200
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % LABELS.length)
    }, period)
    return () => clearInterval(t)
  }, [reducedMotion, isMobile])

  // anchors[0] is the single projected screen-space position
  const anchor = anchors[0]
  if (!anchor) return null

  // frontness is passed via parallaxX (ox field)
  const frontness = parallaxX
  const visible = frontness > 0.1

  const label = LABELS[index]

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {visible && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0)`,
            willChange: 'transform',
          }}
        >
          <EmergingLabel
            text={label.text}
            status={label.status}
            activeDuration={isMobile ? 2200 : 2600}
            idleDuration={isMobile ? 3800 : 2600}
            delay={0}
          />
        </div>
      )}
    </div>
  )
}
