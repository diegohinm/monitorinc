import type { ReactNode } from 'react'

export type LabelStatus = 'ok' | 'warning' | 'alert' | 'neutral'

export interface SoftMassProps {
  size: number
  initialX: string
  initialY: string
  colorA: string
  colorB: string
  opacity?: number
  blur?: number
  orbitRadiusX?: number
  orbitRadiusY?: number
  duration?: number
  scaleMin?: number
  scaleMax?: number
  delay?: number
}

export interface OrbitingHotspotProps {
  radiusX: number
  radiusY: number
  duration: number
  delay?: number
  children: ReactNode
}

export interface EmergingLabelProps {
  text: string
  status?: LabelStatus
  activeDuration?: number
  idleDuration?: number
  delay?: number
}
