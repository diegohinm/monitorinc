'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotionSafe } from './useReducedMotionSafe'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function ParticleSphere({ density = 190, scale = 1 }: { density?: number; scale?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reducedMotion = useReducedMotionSafe()

  const particles = useMemo<Particle[]>(() => {
    const seed = 1337
    const rand = mulberry32(seed)

    const out: Particle[] = []
    for (let i = 0; i < density; i++) {
      // Sample a "sphere" distribution: more points near centre
      const u = rand()
      const v = rand()
      const theta = u * Math.PI * 2

      // r is biased to the centre. pow -> tighter core.
      const rr = Math.pow(v, 0.55)

      // Slightly squash vertically to feel like an orb in perspective.
      const x = Math.cos(theta) * rr
      const y = Math.sin(theta) * rr * 0.78

      // Small drift; more drift at edges than core.
      const edge = rr
      const speed = 0.00012 + 0.00022 * edge
      const angle = rand() * Math.PI * 2

      const radiusPx = 0.7 + rand() * 1.2
      const alpha = 0.18 + rand() * 0.26

      out.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: radiusPx,
        a: alpha,
      })
    }
    return out
  }, [density])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0

    const state = {
      w: 0,
      h: 0,
      dpr: 1,
      // centre of sphere (0..1)
      cx: 0.5,
      cy: 0.48,
      // sphere radius in px (computed per resize)
      R: 420,
      // subtle pointer parallax
      mx: 0,
      my: 0,
    }

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2)
      state.dpr = dpr
      state.w = Math.floor(rect.width)
      state.h = Math.floor(rect.height)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Sphere radius relative to viewport.
      const base = Math.min(state.w, state.h)
      state.R = clamp(base * 0.42 * scale, 240, 520)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      state.mx = (nx - 0.5) * 2
      state.my = (ny - 0.5) * 2
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else if (!reducedMotion) {
        raf = requestAnimationFrame(tick)
      } else {
        drawStatic()
      }
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    resize()

    function clear() {
      ctx.clearRect(0, 0, state.w, state.h)
    }

    function drawBackdrop() {
      // Very subtle radial fog like Maze.
      const x = state.cx * state.w
      const y = state.cy * state.h

      const g = ctx.createRadialGradient(x, y, state.R * 0.05, x, y, state.R)
      g.addColorStop(0, 'rgba(240, 244, 255, 0.045)')
      g.addColorStop(0.55, 'rgba(240, 244, 255, 0.012)')
      g.addColorStop(1, 'rgba(240, 244, 255, 0.0)')

      ctx.fillStyle = g
      ctx.fillRect(0, 0, state.w, state.h)
    }

    function drawParticles() {
      const px = state.cx * state.w
      const py = state.cy * state.h

      // Parallax offsets.
      const ox = state.mx * 10
      const oy = state.my * 8

      // Use normal composite; lighter can get too "sparkly".
      ctx.globalCompositeOperation = 'source-over'

      for (const p of particles) {
        const sx = px + (p.x * state.R + ox)
        const sy = py + (p.y * state.R + oy)

        // Soft edge: alpha decreases toward the edge of the sphere.
        const rr = Math.sqrt(p.x * p.x + (p.y / 0.78) * (p.y / 0.78))
        const falloff = 1 - clamp(rr, 0, 1)
        const a = p.a * (0.35 + 0.65 * falloff)

        ctx.fillStyle = `rgba(235, 240, 255, ${a.toFixed(4)})`
        ctx.beginPath()
        ctx.arc(sx, sy, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function tick() {
      clear()
      drawBackdrop()

      // Update + draw.
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Wrap inside unit circle bounds (approx). Keep density stable.
        if (p.x > 1.05) p.x = -1.05
        if (p.x < -1.05) p.x = 1.05
        if (p.y > 1.05) p.y = -1.05
        if (p.y < -1.05) p.y = 1.05
      }

      drawParticles()
      raf = requestAnimationFrame(tick)
    }

    function drawStatic() {
      clear()
      drawBackdrop()
      drawParticles()
    }

    if (reducedMotion) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [particles, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.95,
      }}
    />
  )
}
