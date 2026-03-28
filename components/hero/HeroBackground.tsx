'use client'

// ─── Hotspot definitions ──────────────────────────────────────────────────────
// Positioned to surround the center text area, not cover it

interface HotspotDef {
  id:       number
  x:        string   // CSS % from left
  y:        string   // CSS % from top
  size:     number   // outer ring diameter, px
  color:    'cyan' | 'red' | 'green'
  delay:    number   // animation-delay in seconds (negative = start mid-cycle)
  period:   number   // full loop period in seconds
  label?:   string
  status?:  string
  cardSide?: 'right' | 'left'
}

// ~40 hotspots distributed around the perimeter/field, sparse in center text zone
const HOTSPOTS: HotspotDef[] = [
  // ── Top band ────────────────────────────────────────────────────
  { id:  1, x: '6%',  y: '6%',  size: 120, color: 'cyan',  delay: -1.2,  period: 9,  label: 'Cámara 01',  status: 'En línea · 4K',            cardSide: 'right' },
  { id:  2, x: '18%', y: '3%',  size:  80, color: 'cyan',  delay: -4.5,  period: 11 },
  { id:  3, x: '34%', y: '5%',  size:  60, color: 'green', delay: -7.1,  period: 8 },
  { id:  4, x: '52%', y: '4%',  size:  70, color: 'cyan',  delay: -2.8,  period: 10 },
  { id:  5, x: '68%', y: '6%',  size:  90, color: 'red',   delay: -5.3,  period: 9,  label: 'Zona A',     status: 'Alarma activa',             cardSide: 'left' },
  { id:  6, x: '82%', y: '3%',  size:  65, color: 'cyan',  delay: -0.6,  period: 12 },
  { id:  7, x: '93%', y: '9%',  size: 100, color: 'cyan',  delay: -8.2,  period: 10 },

  // ── Top-mid band ─────────────────────────────────────────────────
  { id:  8, x: '3%',  y: '22%', size:  90, color: 'red',   delay: -3.4,  period: 8,  label: 'Sensor P2',  status: 'Movimiento detectado',       cardSide: 'right' },
  { id:  9, x: '14%', y: '18%', size:  55, color: 'cyan',  delay: -6.9,  period: 11 },
  { id: 10, x: '26%', y: '20%', size:  75, color: 'cyan',  delay: -1.8,  period: 9 },
  { id: 11, x: '72%', y: '17%', size:  65, color: 'green', delay: -9.1,  period: 10 },
  { id: 12, x: '85%', y: '21%', size:  95, color: 'cyan',  delay: -4.0,  period: 8,  label: 'GPS Flota',  status: 'Rastreando · 3 veh',         cardSide: 'left' },
  { id: 13, x: '96%', y: '26%', size:  60, color: 'cyan',  delay: -7.6,  period: 12 },

  // ── Left column ──────────────────────────────────────────────────
  { id: 14, x: '1%',  y: '35%', size:  80, color: 'cyan',  delay: -2.2,  period: 10 },
  { id: 15, x: '8%',  y: '42%', size: 110, color: 'green', delay: -5.8,  period: 9,  label: 'Acceso OK',  status: 'Autorizado · Puerta 1',      cardSide: 'right' },
  { id: 16, x: '2%',  y: '55%', size:  70, color: 'cyan',  delay: -0.9,  period: 11 },
  { id: 17, x: '14%', y: '62%', size:  55, color: 'cyan',  delay: -8.5,  period: 8 },
  { id: 18, x: '6%',  y: '72%', size:  85, color: 'red',   delay: -3.9,  period: 9 },

  // ── Right column ─────────────────────────────────────────────────
  { id: 19, x: '88%', y: '35%', size:  65, color: 'cyan',  delay: -6.4,  period: 10 },
  { id: 20, x: '95%', y: '44%', size:  95, color: 'red',   delay: -1.5,  period: 9,  label: 'Domo B3',    status: 'Intruso detectado',          cardSide: 'left' },
  { id: 21, x: '82%', y: '54%', size:  70, color: 'cyan',  delay: -4.7,  period: 12 },
  { id: 22, x: '91%', y: '64%', size:  60, color: 'green', delay: -9.3,  period: 8 },
  { id: 23, x: '79%', y: '71%', size:  85, color: 'cyan',  delay: -2.6,  period: 11 },

  // ── Mid-left (close to center, sparse) ───────────────────────────
  { id: 24, x: '22%', y: '38%', size:  55, color: 'cyan',  delay: -7.2,  period: 10 },
  { id: 25, x: '28%', y: '52%', size:  65, color: 'cyan',  delay: -5.1,  period: 9 },
  { id: 26, x: '18%', y: '75%', size:  75, color: 'cyan',  delay: -3.3,  period: 11 },

  // ── Mid-right (close to center, sparse) ──────────────────────────
  { id: 27, x: '74%', y: '42%', size:  60, color: 'cyan',  delay: -8.8,  period: 9 },
  { id: 28, x: '68%', y: '58%', size:  70, color: 'red',   delay: -1.1,  period: 10 },
  { id: 29, x: '76%', y: '76%', size:  55, color: 'cyan',  delay: -6.0,  period: 8 },

  // ── Bottom-mid band ──────────────────────────────────────────────
  { id: 30, x: '8%',  y: '85%', size:  90, color: 'cyan',  delay: -4.4,  period: 10 },
  { id: 31, x: '22%', y: '88%', size:  65, color: 'cyan',  delay: -2.0,  period: 9 },
  { id: 32, x: '38%', y: '86%', size:  80, color: 'green', delay: -7.8,  period: 11, label: 'Incendios',  status: 'Sin alertas',               cardSide: 'right' },
  { id: 33, x: '54%', y: '88%', size:  55, color: 'cyan',  delay: -0.4,  period: 8 },
  { id: 34, x: '67%', y: '85%', size:  70, color: 'cyan',  delay: -5.6,  period: 12 },
  { id: 35, x: '80%', y: '89%', size:  85, color: 'red',   delay: -3.1,  period: 9 },
  { id: 36, x: '94%', y: '83%', size:  60, color: 'cyan',  delay: -9.7,  period: 10 },

  // ── Bottom band ──────────────────────────────────────────────────
  { id: 37, x: '14%', y: '95%', size:  70, color: 'cyan',  delay: -6.3,  period: 11 },
  { id: 38, x: '44%', y: '94%', size:  50, color: 'cyan',  delay: -1.9,  period: 8 },
  { id: 39, x: '72%', y: '96%', size:  75, color: 'green', delay: -8.0,  period: 10 },
  { id: 40, x: '88%', y: '93%', size:  55, color: 'cyan',  delay: -4.2,  period: 9 },
]

// ─── Colour tokens per variant ────────────────────────────────────────────────
const COLOR = {
  cyan:  { stroke: '#02E8FF', glow: 'rgba(2, 232, 255, 0.22)',   bg: 'rgba(2, 232, 255, 0.08)',   text: '#02E8FF'  },
  red:   { stroke: '#e628ff', glow: 'rgba(230, 40, 255, 0.22)',  bg: 'rgba(230, 40, 255, 0.08)',  text: '#e628ff'  },
  green: { stroke: '#2FD48D', glow: 'rgba(47, 212, 141, 0.22)', bg: 'rgba(47, 212, 141, 0.08)', text: '#2FD48D'  },
}

// ─── Animation CSS (embedded to avoid extra file) ─────────────────────────────
const CSS = `
  @keyframes hz-dot {
    0%, 100%  { transform: scale(0); opacity: 0; }
    8%        { transform: scale(1); opacity: 1; }
    72%       { transform: scale(1); opacity: 1; }
    80%       { transform: scale(0); opacity: 0; }
  }

  /* Uses CSS var --circ set inline per hotspot */
  @keyframes hz-ring {
    0%        { stroke-dashoffset: var(--circ); opacity: 0;   transform-origin: 50% 50%; transform: scale(1); }
    8%        { opacity: 0.5; }
    72%       { stroke-dashoffset: 0;           opacity: 0.45; transform: scale(1); }
    80%, 100% { stroke-dashoffset: 0;           opacity: 0;    transform: scale(0.5); }
  }

  .hz-dot {
    animation: hz-dot var(--period) linear var(--delay) infinite;
  }
  .hz-ring {
    animation: hz-ring var(--period) linear var(--delay) infinite;
  }

  /* Reduce motion: freeze at a static state */
  @media (prefers-reduced-motion: reduce) {
    .hz-dot  { animation: none; transform: scale(1); opacity: 0.35; }
    .hz-ring { animation: none; stroke-dashoffset: 40; opacity: 0.2; }
  }
`

// ─── Single hotspot ───────────────────────────────────────────────────────────
function Hotspot({ h }: { h: HotspotDef }) {
  const c   = COLOR[h.color]
  const r   = h.size * 0.44             // SVG radius relative to viewBox 200×200
  const box = 200
  const cx  = box / 2
  // Exact circumference so the ring draws cleanly
  const circ = +(2 * Math.PI * r).toFixed(2)

  return (
    <div
      style={{
        position: 'absolute',
        left:     h.x,
        top:      h.y,
        // Translate so the centre of the hotspot sits at the defined position
        transform: 'translate(-50%, -50%)',
        width:    h.size,
        height:   h.size,
        pointerEvents: 'none',
      }}
    >
      {/* SVG ring */}
      <svg
        viewBox={`0 0 ${box} ${box}`}
        width={h.size}
        height={h.size}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="transparent"
          stroke={c.stroke}
          strokeWidth={1}
          strokeDasharray={circ}
          className="hz-ring"
          style={{
            // CSS vars consumed by animation keyframes
            ['--circ' as string]: circ,
            ['--period' as string]: `${h.period}s`,
            ['--delay' as string]:  `${h.delay}s`,
            transformOrigin: `${cx}px ${cx}px`,
          }}
        />
      </svg>

      {/* Centre dot */}
      <div
        className="hz-dot"
        style={{
          position:     'absolute',
          top:          '50%',
          left:         '50%',
          width:        6,
          height:       6,
          marginTop:    -3,
          marginLeft:   -3,
          borderRadius: '50%',
          background:   c.stroke,
          boxShadow:    `0 0 8px 2px ${c.glow}`,
          ['--period' as string]: `${h.period}s`,
          ['--delay' as string]:  `${h.delay}s`,
        }}
      />

      {/* Optional info card */}
      {h.label && (
        <div
          className="hz-dot"
          style={{
            position:       'absolute',
            top:            '50%',
            [h.cardSide === 'left' ? 'right' : 'left']: '58%',
            transform:      'translateY(-50%)',
            background:     'rgba(15, 21, 35, 0.88)',
            border:         `1px solid ${c.stroke}22`,
            borderRadius:   6,
            padding:        '6px 10px',
            whiteSpace:     'nowrap',
            backdropFilter: 'blur(6px)',
            ['--period' as string]: `${h.period}s`,
            ['--delay' as string]:  `${h.delay}s`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.stroke, flexShrink: 0, boxShadow: `0 0 5px ${c.glow}` }} />
            <span style={{ fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 500, color: '#d6d8d8' }}>{h.label}</span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(214,216,216,0.45)', fontFamily: 'var(--font-body)' }}>{h.status}</div>
        </div>
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function HeroBackground() {
  return (
    <>
      {/* Inject keyframe CSS once */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          inset:         0,
          overflow:      'hidden',
          pointerEvents: 'none',
          zIndex:        0,
          // Exact Maze background colour
          background:    '#0F1523',
        }}
      >
        {/* ── 1. Subtle radial centre glow ── */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: `
            radial-gradient(ellipse 60% 55% at 50% 48%,
              rgba(42, 138, 255, 0.11) 0%,
              rgba(42, 138, 255, 0.04) 45%,
              transparent 70%
            )
          `,
        }} />

        {/* ── 2. All hotspot indicators ── */}
        {HOTSPOTS.map(h => <Hotspot key={h.id} h={h} />)}

        {/* ── 3. Grid overlay (very faint, masked) ── */}
        <div style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
          `,
          backgroundSize:    '56px 56px',
          WebkitMaskImage:   'radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 100%)',
          maskImage:         'radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 100%)',
        }} />

        {/* ── 4. Bottom fade into next section ── */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     220,
          background: 'linear-gradient(to bottom, transparent, #0F1523)',
        }} />

        {/* ── 5. Edge vignette ── */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: `
            radial-gradient(ellipse 100% 100% at 50% 50%,
              transparent 55%,
              rgba(6, 10, 18, 0.55) 100%
            )
          `,
        }} />
      </div>
    </>
  )
}
