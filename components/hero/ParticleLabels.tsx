'use client'

import { useEffect, useMemo, useState } from 'react'
import EmergingLabel from './EmergingLabel'
import type { LabelStatus } from './types'
import { useReducedMotionSafe } from './useReducedMotionSafe'

export type ParticleAnchor = {
  // normalized particle position in unit space (-1..1)
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
  centerX: number // 0..1
  centerY: number // 0..1
  radius: number // px
  parallaxX: number // px
  parallaxY: number // px
  isMobile: boolean
}) {
  const reducedMotion = useReducedMotionSafe()

  // show exactly one label at a time
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    const period = isMobile ? 6000 : 5200
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % LABELS.length)
    }, period)
    return () => clearInterval(t)
  }, [reducedMotion, isMobile])

  // Choose stable anchor per label index (so it feels attached to a particle)
  const anchorIndex = useMemo(() => {
    if (!anchors.length) return 0
    // deterministic spread
    return Math.floor((index * 37) % anchors.length)
  }, [anchors.length, index])

  const a = anchors[anchorIndex] ?? { x: 0, y: 0 }

  const left = centerX * 100
  const top = centerY * 100

  // Convert particle space to % using radius and current parallax.
  // We'll position with translate so we don't trigger layout.
  const xPx = a.x * radius + parallaxX
  const yPx = a.y * radius + parallaxY

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
      <div
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          transform: `translate3d(${xPx}px, ${yPx}px, 0)`,
          willChange: 'transform',
        }}
      >
        <EmergingLabel
          text={label.text}
          status={label.status}
          // long enough to be read, but only one at a time
          activeDuration={isMobile ? 2200 : 2600}
          idleDuration={isMobile ? 3800 : 2600}
          delay={0}
        />
      </div>
    </div>
  )
}
