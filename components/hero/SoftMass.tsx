'use client'

import { memo } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from 'framer-motion'
import type { SoftMassProps } from './types'

const SoftMass = memo(function SoftMass({
  size,
  initialX,
  initialY,
  colorA,
  colorB,
  opacity = 0.2,
  blur = 110,
  orbitRadiusX = 20,
  orbitRadiusY = 14,
  duration = 22,
  scaleMin = 0.98,
  scaleMax = 1.04,
  delay = 0,
}: SoftMassProps) {
  const shouldReduceMotion = useReducedMotion()

  // Accumulates time in seconds across frames
  const time = useMotionValue(0)

  // Perfect elliptic orbit: cos/sin traces a smooth ellipse
  const x = useTransform(time, (t) =>
    Math.cos(((t + delay) / duration) * 2 * Math.PI) * orbitRadiusX
  )
  const y = useTransform(time, (t) =>
    Math.sin(((t + delay) / duration) * 2 * Math.PI) * orbitRadiusY
  )
  // Scale breathes at a slightly different period for organic feel
  const scale = useTransform(time, (t) => {
    const s =
      Math.sin(((t + delay) / (duration * 1.45)) * 2 * Math.PI) * 0.5 + 0.5
    return scaleMin + s * (scaleMax - scaleMin)
  })

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion) return
    time.set(time.get() + delta / 1000)
  })

  return (
    // Outer div: handles absolute centering at initialX/initialY
    <div
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      {/* Inner motion.div: handles the orbit + scale animation */}
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
    </div>
  )
})

export default SoftMass
