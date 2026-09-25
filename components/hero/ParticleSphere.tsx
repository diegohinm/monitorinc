'use client'

/**
 * ═══════════════════════════════════════════════════════════════════
 *  Particle Sphere — matched to mazehq.com's actual implementation
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Source analysis of Maze's JS bundle:
 *    - 16 384 particles, shell-only (rejection sampling + normalize)
 *    - Custom ShaderMaterial with soft particle texture
 *    - NormalBlending (NOT Additive)
 *    - Camera: FOV 45°, Z = 400
 *    - Y rotation: 0.001 rad/frame, no mouse interaction
 *    - 5-colour palette: #EFF0F0, #02E8FF, #42A4FE, #8958FF, #D409FE
 *    - Scale: ~115% of viewport height (overflows intentionally)
 *    - depthTest: false, transparent: true
 *    - No post-processing — glow from soft texture + transparency
 * ═══════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotionSafe } from './useReducedMotionSafe'

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

// ── Maze exact values ────────────────────────────────────────────
const COUNT = 16_384
const ROT_Y = 0.001 // rad/frame — Maze exact

// 5-colour palette from Maze's source (weighted probability)
const PALETTE: { color: THREE.Color; weight: number }[] = [
  { color: new THREE.Color('#EFF0F0'), weight: 0.05 }, // near-white
  { color: new THREE.Color('#02E8FF'), weight: 0.30 }, // cyan
  { color: new THREE.Color('#42A4FE'), weight: 0.30 }, // blue
  { color: new THREE.Color('#8958FF'), weight: 0.10 }, // purple
  { color: new THREE.Color('#D409FE'), weight: 0.10 }, // magenta
]

function pickColour(rand: () => number): THREE.Color {
  let r = rand()
  for (const entry of PALETTE) {
    r -= entry.weight
    if (r <= 0) return entry.color
  }
  return PALETTE[PALETTE.length - 1].color
}

// ── Create soft circle texture (replaces Maze's particle.png) ────
function createParticleTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Radial gradient: bright solid core → soft glow → transparent edge
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255, 255, 255, 1)')
  g.addColorStop(0.2, 'rgba(255, 255, 255, 0.95)')
  g.addColorStop(0.4, 'rgba(255, 255, 255, 0.55)')
  g.addColorStop(0.65, 'rgba(255, 255, 255, 0.18)')
  g.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// ── Maze's shell distribution: rejection sampling + normalize ────
// Random point in [-1,1]^3, reject if outside unit sphere,
// then normalize to project onto surface
function shellPoint(rand: () => number, out: THREE.Vector3): void {
  do {
    out.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1)
  } while (out.length() > 1)
  out.normalize()
}

// ── Vertex shader ────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uPointSize;
  attribute float aAlpha;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vAlpha = aAlpha;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = -mvPosition.z;

    // Size attenuation: closer = larger (Maze uses 100/distance)
    gl_PointSize = uPointSize * (100.0 / dist);
    gl_PointSize = clamp(gl_PointSize, 1.5, 100.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`

// ── Fragment shader ──────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  uniform sampler2D pointTexture;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec4 texel = texture2D(pointTexture, gl_PointCoord);
    gl_FragColor = vec4(vColor, vAlpha) * texel;
    if (gl_FragColor.a < 0.01) discard;
  }
`

export function ParticleSphere({
  density: _density,
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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotionSafe()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight

    // ── Scene — FOV 45, Z=400 on all sizes ──────────────────────
    const scene = new THREE.Scene()

    const cameraZ = 400
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000)
    camera.position.set(0, 0, cameraZ)
    camera.lookAt(scene.position)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(clamp(window.devicePixelRatio, 1, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Visible height/width in scene units at z=0
    const vFov = (45 / 2) * Math.PI / 180
    const sceneHeight = 2 * cameraZ * Math.tan(vFov)
    const sceneWidth = sceneHeight * (w / h)

    // Sphere overflows: 115% of the SMALLER scene dimension
    // On portrait (mobile): sphere fills width, overflows top/bottom
    // On landscape (desktop): sphere fills height, overflows left/right
    const minDim = Math.min(sceneWidth, sceneHeight)
    const sphereScale = (minDim / 2) * 1.1 * scale
    const RADIUS = sphereScale

    // ── Generate particles — shell-only, Maze exact ──────────────
    const rand = mulberry32(1337)
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const alphas = new Float32Array(COUNT)

    const tempVec = new THREE.Vector3()

    // Track which particle the label follows — pick a new random one every 5s
    let trackedParticleIdx = Math.floor(Math.random() * COUNT)
    const pickInterval = setInterval(() => {
      trackedParticleIdx = Math.floor(Math.random() * COUNT)
    }, 5200)

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3

      // Shell distribution — exact Maze algorithm
      shellPoint(rand, tempVec)

      positions[i3] = tempVec.x
      positions[i3 + 1] = tempVec.y
      positions[i3 + 2] = tempVec.z

      // Colour from 5-palette with slight HSL jitter
      const col = pickColour(rand).clone()
      // Tiny hue/lightness jitter (Maze: T=0.01, w=0.01)
      const hsl = { h: 0, s: 0, l: 0 }
      col.getHSL(hsl)
      hsl.h += (rand() - 0.5) * 0.02
      hsl.l += (rand() - 0.5) * 0.02
      col.setHSL(hsl.h, clamp(hsl.s, 0, 1), clamp(hsl.l, 0, 1))

      colors[i3] = col.r
      colors[i3 + 1] = col.g
      colors[i3 + 2] = col.b

      // Per-particle alpha: 0.6–1.0 random (brighter base)
      alphas[i] = 0.6 + rand() * 0.4
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))

    // ── Material — custom shader, NormalBlending, Maze exact ─────
    const particleTexture = createParticleTexture()

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: particleTexture },
        uPointSize: { value: 12.0 },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      vertexColors: true,
      blending: THREE.NormalBlending,
    })

    const points = new THREE.Points(geometry, material)
    points.scale.set(sphereScale, sphereScale, sphereScale)
    scene.add(points)

    // ── Resize ───────────────────────────────────────────────────
    const onResize = () => {
      const w2 = container.clientWidth
      const h2 = container.clientHeight
      camera.aspect = w2 / h2
      camera.updateProjectionMatrix()
      renderer.setSize(w2, h2)
    }
    window.addEventListener('resize', onResize)

    // ── Visibility ───────────────────────────────────────────────
    let raf = 0
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(animate)
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ── Animation — Y rotation only, no mouse, Maze exact ────────
    function animate() {
      raf = requestAnimationFrame(animate)

      if (!reducedMotion) {
        points.rotation.y += ROT_Y
      }

      camera.lookAt(scene.position)
      points.updateMatrixWorld(true)
      renderer.render(scene, camera)

      // Project the tracked particle to screen-space every frame
      if (onFrame) {
        const cw = container!.clientWidth
        const ch = container!.clientHeight
        const projVec = new THREE.Vector3()
        const i3 = trackedParticleIdx * 3

        projVec.set(positions[i3], positions[i3 + 1], positions[i3 + 2])
        projVec.applyMatrix4(points.matrixWorld)

        const frontness = projVec.z / RADIUS // >0 = front face
        projVec.project(camera)

        const screenX = (projVec.x * 0.5 + 0.5) * cw
        const screenY = (-projVec.y * 0.5 + 0.5) * ch

        onFrame({
          anchors: [{ x: screenX, y: screenY }],
          cx: 0.5,
          cy: 0.48,
          R: RADIUS,
          ox: frontness,  // repurpose ox to pass frontness
          oy: 0,
        })
      }
    }

    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(pickInterval)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      geometry.dispose()
      material.dispose()
      particleTexture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [scale, reducedMotion, onFrame])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
