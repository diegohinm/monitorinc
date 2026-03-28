'use client'

import { memo } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from 'framer-motion'
import { useReducedMotionSafe } from './useReducedMotionSafe'
import type { SoftMassProps } from './types'

/**
 * A single soft atmospheric blob.
 *
 * CHANGED vs previous version:
 * - Accepts `children` so that OrbitingHotspot / EmergingLabel can nest
 *   inside the mass bounding box. Children render as siblings of the
 *   blurred div — they are NOT blurred themselves.
 * - Props renamed from `initialX/initialY` to `x/y` for clarity.
 * - Uses custom `useReducedMotionSafe` instead of framer's hook for
 *   consistent SSR behaviour across all hero components.
 */
const SoftMass = memo(function SoftMass({
  size,
  x: posX,
  y: posY,
  colorA,
  colorB,
  opacity = 0.2,
  blur = 110,
  orbitRadiusX = 20,
  orbitRadiusY = 14,
  duration = 22,
  delay = 0,
  scaleMin = 0.985,
  scaleMax = 1.035,
  children,
}: SoftMassProps) {
  const reducedMotion = useReducedMotionSafe()
  const time = useMotionValue(0)

  // Perfect elliptic orbit via cos/sin
  const x = useTransform(time, (t) =>
    Math.cos(((t + delay) / duration) * 2 * Math.PI) * orbitRadiusX
  )
  const y = useTransform(time, (t) =>
    Math.sin(((t + delay) / duration) * 2 * Math.PI) * orbitRadiusY
  )
  // Scale breathes at 1.45× the orbit period so the two never sync
  const scale = useTransform(time, (t) => {
    const s =
      Math.sin(((t + delay) / (duration * 1.45)) * 2 * Math.PI) * 0.5 + 0.5
    return scaleMin + s * (scaleMax - scaleMin)
  })

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return
    time.set(time.get() + delta / 1000)
  })

  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: posY,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      {/* The visible glow — blurred, orbiting, breathing */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 38% 36%, ${colorA} 0%, ${colorB} 52%, transparent 80%)`,
          opacity,
          filter: `blur(${blur}px)`,
          x,
          y,
          scale,
          willChange: 'transform',
        }}
      />
      {/* Children (OrbitingHotspot → EmergingLabel) sit outside the blur
          but inside the mass bounding box, so labels emerge from specific
          coordinates within the glow. */}
      {children}
    </div>
  )
})

export default SoftMass
