'use client'

import { memo } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
} from 'framer-motion'
import { useReducedMotionSafe } from './useReducedMotionSafe'
import type { OrbitingHotspotProps } from './types'

/**
 * Invisible anchor that orbits in a tiny ellipse.
 *
 * CHANGED vs previous version:
 * - Added `anchorX` / `anchorY` props. When provided, the hotspot
 *   positions itself absolutely within its parent (the SoftMass
 *   bounding box). This makes labels emerge FROM the mass instead
 *   of floating beside it — key for the atmospheric feel.
 * - When no anchor is provided, behaves as a relative-positioned
 *   wrapper (backwards-compatible standalone usage).
 */
const OrbitingHotspot = memo(function OrbitingHotspot({
  radiusX,
  radiusY,
  duration,
  delay = 0,
  anchorX,
  anchorY,
  children,
}: OrbitingHotspotProps) {
  const reducedMotion = useReducedMotionSafe()
  const time = useMotionValue(0)

  const x = useTransform(time, (t) =>
    Math.cos(((t + delay) / duration) * 2 * Math.PI) * radiusX
  )
  const y = useTransform(time, (t) =>
    Math.sin(((t + delay) / duration) * 2 * Math.PI) * radiusY
  )

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return
    time.set(time.get() + delta / 1000)
  })

  const anchored = anchorX !== undefined && anchorY !== undefined

  return (
    <div
      style={
        anchored
          ? {
              position: 'absolute' as const,
              left: anchorX,
              top: anchorY,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }
          : { position: 'relative' as const }
      }
    >
      <motion.div
        style={{
          display: 'inline-block',
          x,
          y,
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
})

export default OrbitingHotspot
