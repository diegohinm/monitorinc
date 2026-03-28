'use client'

import { memo } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from 'framer-motion'
import type { OrbitingHotspotProps } from './types'

/**
 * Wraps children in a slowly orbiting container.
 * The orbit is a small ellipse — the movement is barely perceptible,
 * just enough to make labels feel alive rather than pinned.
 */
const OrbitingHotspot = memo(function OrbitingHotspot({
  radiusX,
  radiusY,
  duration,
  delay = 0,
  children,
}: OrbitingHotspotProps) {
  const shouldReduceMotion = useReducedMotion()
  const time = useMotionValue(0)

  const x = useTransform(time, (t) =>
    Math.cos(((t + delay) / duration) * 2 * Math.PI) * radiusX
  )
  const y = useTransform(time, (t) =>
    Math.sin(((t + delay) / duration) * 2 * Math.PI) * radiusY
  )

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion) return
    time.set(time.get() + delta / 1000)
  })

  return (
    <motion.div
      style={{
        position: 'relative',
        display: 'inline-block',
        x,
        y,
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  )
})

export default OrbitingHotspot
