'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

// ── Helpers ───────────────────────────────────────────────────────────────────

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const lerp  = (a, b, t)   => a + (b - a) * t

// ── Particle factory ──────────────────────────────────────────────────────────

/**
 * Build the particle array.
 * @param {number} count
 * @param {number} ringRadius   Base orbit radius in CSS pixels
 */
function createParticles(count, ringRadius) {
  const particles = []
  const band = ringRadius * 0.38

  for (let i = 0; i < count; i++) {
    // Gaussian jitter via Box-Muller so most particles hug the ring
    const u1 = Math.random() + 1e-9
    const u2 = Math.random()
    const gauss = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const radiusJitter = gauss * band * 0.5

    const raw   = ringRadius + radiusJitter
    const base  = clamp(raw, ringRadius * 0.25, ringRadius * 1.75)
    const distN = Math.abs(radiusJitter) / (band * 0.5)  // 0 = on ring, grows outward

    particles.push({
      baseAngle:    Math.random() * Math.PI * 2,
      baseRadius:   base,
      radiusJitter,
      size:         0.35 + Math.random() * 1.7,
      alpha:        0.12 + Math.random() * 0.6,
      speed:        (Math.random() - 0.5) * 0.00011,
      orbitDrift:   (Math.random() - 0.5) * 0.00004,
      twinkle:      Math.random() * Math.PI * 2,
      twinkleSpeed: 0.006 + Math.random() * 0.014,
      // depth drives opacity falloff from ring centre
      depth:        Math.max(0, 1 - distN * 0.72),
    })
  }
  return particles
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ParticleHero() {
  const canvasRef  = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const canvas  = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── Runtime state (mutated in RAF; never triggers re-render) ──────────────
    const state = {
      particles:     [],
      pointer:       { x: 0, y: 0 },
      smooth:        { x: 0, y: 0 },
      raf:           0,
      width:         0,
      height:        0,
      dpr:           1,
      reducedMotion: false,
      frameCount:    0,
    }

    // Reduced-motion media query
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    state.reducedMotion = mq.matches
    const onMqChange = (e) => { state.reducedMotion = e.matches }
    mq.addEventListener('change', onMqChange)

    // ── Resize ────────────────────────────────────────────────────────────────
    function resize() {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2)
      const W   = section.offsetWidth
      const H   = section.offsetHeight

      canvas.width  = W * dpr
      canvas.height = H * dpr
      state.width   = W
      state.height  = H
      state.dpr     = dpr

      // Reset transform so repeated calls don't stack scale
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile   = W < 768
      const count      = isMobile ? 1000 : 1800
      const ringRadius = Math.min(W, H) * 0.38

      // Only regenerate when count changes (init or breakpoint crossing)
      if (state.particles.length !== count) {
        state.particles = createParticles(count, ringRadius)
      }
    }

    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(section)

    // ── Pointer tracking ──────────────────────────────────────────────────────
    function onPointerMove(e) {
      const r = section.getBoundingClientRect()
      state.pointer.x = (e.clientX - r.left) / r.width  - 0.5
      state.pointer.y = (e.clientY - r.top)  / r.height - 0.5
    }
    function onPointerLeave() {
      state.pointer.x = 0
      state.pointer.y = 0
    }
    section.addEventListener('pointermove', onPointerMove, { passive: true })
    section.addEventListener('pointerleave', onPointerLeave)

    // ── Noise buffer (tiled small canvas, refreshed every N frames) ───────────
    const noiseW   = 320
    const noiseH   = 180
    const noiseOff = document.createElement('canvas')
    noiseOff.width  = noiseW
    noiseOff.height = noiseH
    const noiseCtx = noiseOff.getContext('2d')
    const NOISE_INTERVAL = 5

    function refreshNoise() {
      const img  = noiseCtx.createImageData(noiseW, noiseH)
      const data = img.data
      for (let i = 0; i < data.length; i += 4) {
        const v    = (Math.random() * 20) | 0
        data[i]   = v
        data[i+1] = v
        data[i+2] = v + 3
        data[i+3] = (Math.random() * 20) | 0
      }
      noiseCtx.putImageData(img, 0, 0)
    }
    refreshNoise()

    // ── Draw: background gradient + outer/inner glow ──────────────────────────
    function drawBackgroundGlow(time) {
      const { width: W, height: H, smooth } = state
      const pulse = 1 + Math.sin(time * 0.00038) * 0.07

      // Base fill
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0,   '#07111f')
      bg.addColorStop(0.5, '#081425')
      bg.addColorStop(1,   '#060d18')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      const cx = W * 0.5 + smooth.x * W * 0.04
      const cy = H * 0.5 + smooth.y * H * 0.04

      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // Outer radial glow
      const outer = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.62 * pulse)
      outer.addColorStop(0,    'rgba(42,138,255,0.13)')
      outer.addColorStop(0.45, 'rgba(42,138,255,0.04)')
      outer.addColorStop(1,    'rgba(0,0,0,0)')
      ctx.fillStyle = outer
      ctx.fillRect(0, 0, W, H)

      // Inner glow (brighter core)
      const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.21 * pulse)
      inner.addColorStop(0,   'rgba(115,190,255,0.20)')
      inner.addColorStop(0.5, 'rgba(42,138,255,0.07)')
      inner.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = inner
      ctx.fillRect(0, 0, W, H)

      ctx.restore()
    }

    // ── Draw: particle halo ───────────────────────────────────────────────────
    function drawParticles(time) {
      const { width: W, height: H, particles, smooth, reducedMotion } = state

      const cx         = W * 0.5 + smooth.x * W * 0.034
      const cy         = H * 0.5 + smooth.y * H * 0.034
      const ringRadius = Math.min(W, H) * 0.38
      // Elliptical axes: x wider, y narrower — more cinematic
      const rx = ringRadius * 1.16
      const ry = ringRadius * 0.87

      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!reducedMotion) {
          p.baseAngle += p.speed
          p.twinkle   += p.twinkleSpeed
        }

        const twinkle    = 0.72 + Math.sin(p.twinkle) * 0.28
        const pr         = p.baseRadius / ringRadius
        const px         = cx + Math.cos(p.baseAngle) * rx * pr
        const py         = cy + Math.sin(p.baseAngle) * ry * pr
        const finalAlpha = p.alpha * p.depth * twinkle

        if (finalAlpha < 0.018) continue

        // Soft glow around particle
        const glowR = p.size * 5.5
        const grad  = ctx.createRadialGradient(px, py, 0, px, py, glowR)
        grad.addColorStop(0,   `rgba(196,236,255,${finalAlpha * 0.88})`)
        grad.addColorStop(0.3, `rgba(115,190,255,${finalAlpha * 0.32})`)
        grad.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(px, py, glowR, 0, Math.PI * 2)
        ctx.fill()

        // Bright pixel core
        ctx.fillStyle = `rgba(220,245,255,${finalAlpha})`
        ctx.beginPath()
        ctx.arc(px, py, p.size * 0.45, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    // ── Draw: centre mist / fog ───────────────────────────────────────────────
    function drawCenterMist(time) {
      const { width: W, height: H, smooth, reducedMotion } = state
      const drift = reducedMotion ? 0 : Math.sin(time * 0.00028) * 9
      const cx    = W * 0.5 + smooth.x * W * 0.02
      const cy    = H * 0.5 + smooth.y * H * 0.02

      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      for (let i = 0; i < 2; i++) {
        const ox     = i === 0 ?  drift      : -drift * 0.65
        const oy     = i === 0 ?  drift * 0.4 : -drift * 0.28
        const radius = Math.min(W, H) * (0.17 + i * 0.07)
        const alpha  = 0.038 + i * 0.018

        const mist = ctx.createRadialGradient(
          cx + ox, cy + oy, 0,
          cx + ox, cy + oy, radius,
        )
        mist.addColorStop(0, `rgba(100,180,255,${alpha})`)
        mist.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = mist
        ctx.fillRect(0, 0, W, H)
      }

      ctx.restore()
    }

    // ── Draw: grain / noise overlay ───────────────────────────────────────────
    function drawNoise() {
      const { width: W, height: H } = state
      if (state.frameCount % NOISE_INTERVAL === 0) refreshNoise()

      ctx.save()
      ctx.globalCompositeOperation = 'overlay'
      ctx.globalAlpha = 0.5
      ctx.drawImage(noiseOff, 0, 0, W, H)
      ctx.restore()
    }

    // ── Draw: vignette (darkens edges) ────────────────────────────────────────
    function drawVignette() {
      const { width: W, height: H } = state
      const cx = W * 0.5
      const cy = H * 0.5
      const r  = Math.sqrt(cx * cx + cy * cy)

      const vig = ctx.createRadialGradient(cx, cy, r * 0.42, cx, cy, r)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,7,18,0.84)')

      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, W, H)
      ctx.restore()
    }

    // ── RAF render loop ───────────────────────────────────────────────────────
    function render(now) {
      state.frameCount++

      // Smooth pointer with lerp
      state.smooth.x = lerp(state.smooth.x, state.pointer.x, 0.042)
      state.smooth.y = lerp(state.smooth.y, state.pointer.y, 0.042)

      const { width: W, height: H } = state
      ctx.clearRect(0, 0, W, H)

      const t = state.reducedMotion ? 0 : now

      drawBackgroundGlow(t)
      drawParticles(t)
      drawCenterMist(t)
      drawNoise()
      drawVignette()

      state.raf = requestAnimationFrame(render)
    }

    state.raf = requestAnimationFrame(render)

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(state.raf)
      ro.disconnect()
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      mq.removeEventListener('change', onMqChange)
    }
  }, [])

  // ── JSX ───────────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="inicio"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#07111f',
      }}
    >
      {/* ── Canvas background ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* ── Hero content ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 24px',
        maxWidth: '700px',
        width: '100%',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 14px',
          borderRadius: 999,
          border: '1px solid rgba(115,190,255,0.18)',
          background: 'rgba(42,138,255,0.07)',
          backdropFilter: 'blur(8px)',
          marginBottom: 28,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#00e7fb',
            boxShadow: '0 0 6px rgba(0,231,251,0.8)',
          }} />
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            color: 'rgba(196,236,255,0.82)',
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
          }}>
            Seguridad electrónica · Colombia
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          color: '#eff0f0',
          margin: '0 0 22px',
        }}>
          Haz de cada espacio<br />
          <span style={{
            background: 'linear-gradient(to right, #00e7fb, #e628ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            un lugar seguro.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 18,
          fontWeight: 300,
          lineHeight: 1.65,
          color: 'rgba(214,216,216,0.58)',
          maxWidth: 480,
          margin: '0 auto 42px',
        }}>
          Distribuimos e integramos equipos de seguridad electrónica y
          comunicación: CCTV, control de acceso, alarmas, GPS, domótica y drones.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 32,
        }}>
          <a
            href="https://wa.me/573138407090"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 26px', borderRadius: 999,
              background: 'linear-gradient(135deg, #00e7fb, #e628ff)',
              color: '#000',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity .15s',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'rgba(0,0,0,0.35)',
              flexShrink: 0,
            }} />
            WhatsApp 313&nbsp;8407090
          </a>
          <a
            href="#servicios"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 26px', borderRadius: 999,
              background: 'rgba(242,244,245,0.05)',
              border: '1px solid rgba(242,244,245,0.13)',
              color: '#d6d8d8',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 400,
              textDecoration: 'none',
            }}
          >
            Ver servicios →
          </a>
        </div>

        {/* Contact strip */}
        <div style={{
          display: 'flex',
          gap: 14,
          justifyContent: 'center',
          flexWrap: 'wrap',
          fontSize: 13,
          color: 'rgba(214,216,216,0.30)',
          fontFamily: 'var(--font-body)',
        }}>
          <span>321 3002548</span>
          <span>·</span>
          <span>info@monitorinc.com.co</span>
          <span>·</span>
          <span>www.monitorinc.com.co</span>
        </div>
      </div>

      {/* ── Logo watermark (bottom left) ── */}
      <div style={{
        position: 'absolute',
        bottom: 36,
        left: 36,
        opacity: 0.35,
        zIndex: 10,
      }}>
        <Image
          src="/monitorinc_logo_exact.svg"
          alt="MONITORINC"
          width={90}
          height={58}
          style={{ height: '22px', width: 'auto' }}
        />
      </div>

      {/* ── Scroll hint ── */}
      <div style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        zIndex: 10,
      }}>
        <span style={{
          fontSize: 10,
          color: 'rgba(214,216,216,0.28)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)',
        }}>
          Scroll
        </span>
        <div style={{
          width: 1,
          height: 26,
          background: 'linear-gradient(to bottom, rgba(0,231,251,0.35), transparent)',
        }} />
      </div>
    </section>
  )
}
