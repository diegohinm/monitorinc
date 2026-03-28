'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotionSafe } from './useReducedMotionSafe'

type Particle = {
  x: number
  y: number
  z: number
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

export function ParticleSphere({
  density = 190,
  scale = 1,

  onFrame,
}: {
  density?: number
  scale?: number
  onFrame?: (s: {
    anchors: { x: number; y: number }[]
    cx: number
    cy: number
    R: number
    ox: number
    oy: number
  }) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const reducedMotion = useReducedMotionSafe()

  const particles = useMemo<Particle[]>(() => {
    const seed = 1337
    const rand = mulberry32(seed)

    const out: Particle[] = []
    for (let i = 0; i < density; i++) {
      // Sample a "sphere" distribution: much more density in the core
      const u = rand()
      const v = rand()
      const theta = u * Math.PI * 2

      // Cloud-like distribution (no sphere silhouette).
      const rr = Math.pow(v, 0.45)

      // Slightly squash vertically to feel like an orb in perspective.
      const x = Math.cos(theta) * rr
      const y = Math.sin(theta) * rr * 0.76

      // Small drift; more drift at edges than core.
      const edge = rr
      const angle = rand() * Math.PI * 2

      // Depth (front/back) like Maze: affects size + alpha.
      const z = rand() // 0..1 (closer to 1 = closer to camera)

      // Slow drift overall; slightly faster for closer particles.
      const speed = (0.00007 + 0.00016 * edge) * (0.75 + 0.55 * z)

      // Make dots more "crisp" and layered.
      const radiusPx = (0.70 + rand() * 1.15) * (0.85 + 0.55 * z)
      const alpha = (0.10 + rand() * 0.18) * (0.55 + 0.95 * z)

      out.push({
        x,
        y,
        z,
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
      // Smooth pointer drift for less jitter.
      state.mx += ((nx - 0.5) * 2 - state.mx) * 0.12
      state.my += ((ny - 0.5) * 2 - state.my) * 0.12
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

    function drawBackdrop(t: number) {
      // Very subtle radial fog like Maze, with tiny temperature shift.
      const x = state.cx * state.w
      const y = state.cy * state.h
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.00022)

      const g = ctx.createRadialGradient(x, y, state.R * 0.05, x, y, state.R)
      // cool white -> slightly lavendar-ish as it pulses
      g.addColorStop(0, `rgba(236, 242, 255, ${(0.060 + 0.010 * pulse).toFixed(4)})`)
      g.addColorStop(0.55, `rgba(230, 236, 255, ${(0.014 + 0.004 * pulse).toFixed(4)})`)
      g.addColorStop(1, 'rgba(240, 244, 255, 0.0)')

      ctx.fillStyle = g
      ctx.fillRect(0, 0, state.w, state.h)
    }

    function drawParticles() {
      const px = state.cx * state.w
      const py = state.cy * state.h

      // Parallax offsets (Maze-like: a bit more pronounced but still subtle).
      const ox = state.mx * 16
      const oy = state.my * 12

      // Let callers attach DOM labels to real particle anchors.
      if (onFrame) {
        // Send a small subset of anchors near the core.
        // (We keep this stable across frames; positions drift slowly.)
        const anchors = particles.slice(0, Math.min(80, particles.length)).map((p) => ({
          x: p.x,
          y: p.y,
        }))
        onFrame({ anchors, cx: state.cx, cy: state.cy, R: state.R, ox, oy })
      }

      // A touch of additive blend like Maze's "particle mass".
      // Keep it subtle: we'll do a two-pass render.
      ctx.globalCompositeOperation = 'source-over'


      // Sort so farther particles render first (depth).
      // Only re-sort occasionally (reduces per-frame overhead).
      const now = performance.now()
      // @ts-expect-error internal cache
      state._sortT = state._sortT ?? 0
      // @ts-expect-error internal cache
      state._sorted = state._sorted ?? particles.slice()

      // @ts-expect-error internal cache
      if (now - state._sortT > 180) {
        // @ts-expect-error internal cache
        state._sorted = particles.slice().sort((a, b) => a.z - b.z)
        // @ts-expect-error internal cache
        state._sortT = now
      }

      // @ts-expect-error internal cache
      const sorted = state._sorted as Particle[]

      // Maze-like color: cool white with subtle blue/lavender shift over time.
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.00018)
      const cool = { r: 228, g: 236, b: 255 }
      const blue = { r: 206, g: 224, b: 255 }
      const lav = { r: 218, g: 214, b: 255 }

      function mix(a: number, b: number, t: number) {
        return a + (b - a) * t
      }

      // Pass 1: crisp points + tiny chroma variation by depth/center.
      for (const p of sorted) {
        const sx = px + (p.x * state.R + ox)
        const sy = py + (p.y * state.R + oy)

        const rr = Math.sqrt(p.x * p.x + (p.y / 0.76) * (p.y / 0.76))
        const falloff = 1 - clamp(rr, 0, 1)

        const depth = 0.45 + 0.95 * p.z
        const center = Math.pow(falloff, 1.6)

        // Hue shift target: center leans slightly blue/lavender.
        const hueT = clamp(0.20 + 0.55 * center + 0.25 * pulse, 0, 1)
        const midR = mix(blue.r, lav.r, pulse)
        const midG = mix(blue.g, lav.g, pulse)
        const midB = mix(blue.b, lav.b, pulse)

        const r = mix(cool.r, midR, hueT)
        const g = mix(cool.g, midG, hueT)
        const b = mix(cool.b, midB, hueT)

        // Sharper points: slightly smaller, higher alpha. Front particles brighter.
        const a = p.a * (0.68 + 0.32 * center) * depth

        ctx.fillStyle = `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${a.toFixed(4)})`
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(0.55, p.r * 0.92), 0, Math.PI * 2)
        ctx.fill()
      }

      // Pass 2: additive micro-glow (gives cluster bloom). Only front-ish particles.
      ctx.globalCompositeOperation = 'lighter'
      for (const p of sorted) {
        if (p.z < 0.40) continue

        const rr = Math.sqrt(p.x * p.x + (p.y / 0.76) * (p.y / 0.76))
        if (rr > 0.78) continue

        const sx = px + (p.x * state.R + ox)
        const sy = py + (p.y * state.R + oy)

        const falloff = 1 - clamp(rr, 0, 1)
        const center = Math.pow(falloff, 1.6)
        const a = (p.a * 0.26) * (0.35 + 0.65 * p.z) * (0.35 + 0.65 * center)

        ctx.fillStyle = `rgba(255, 255, 255, ${a.toFixed(4)})`
        ctx.beginPath()
        ctx.arc(sx, sy, p.r * (1.35 + 0.20 * center), 0, Math.PI * 2)
        ctx.fill()
      }

      // Pass 3: 4 brighter "guide" points (the ones you asked for)
      ctx.globalCompositeOperation = 'source-over'
      const guides = [
        { x: -0.55, y: -0.18 },
        { x: 0.52, y: -0.06 },
        { x: -0.18, y: 0.42 },
        { x: 0.22, y: 0.18 },
      ]
      for (const g of guides) {
        const sx = px + (g.x * state.R + ox)
        const sy = py + (g.y * state.R + oy)
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 9)
        glow.addColorStop(0, 'rgba(255,255,255,0.92)')
        glow.addColorStop(0.28, 'rgba(235,242,255,0.38)')
        glow.addColorStop(1, 'rgba(235,242,255,0.0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(sx, sy, 9, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
    }

    function tick() {
      clear()
      drawBackdrop(performance.now())

      // Update + draw.
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Slight depth bob (very subtle), affects size/alpha via z.
        p.z = clamp(p.z + (p.vx - p.vy) * 28, 0, 1)

        // Wrap inside unit bounds. Keep density stable.
        if (p.x > 1.08) p.x = -1.08
        if (p.x < -1.08) p.x = 1.08
        if (p.y > 1.08) p.y = -1.08
        if (p.y < -1.08) p.y = 1.08
      }

      drawParticles()
      raf = requestAnimationFrame(tick)
    }

    function drawStatic() {
      clear()
      drawBackdrop(performance.now())
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
