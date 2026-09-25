/**
 * MONITORINC suppliers strip — a continuous, CSS-only logo marquee.
 *
 * The track holds the SAME list rendered twice and slides by exactly one
 * group width, so the restart lands with group B sitting precisely where
 * group A began and the loop has no visible seam. Each group carries a
 * `padding-right` equal to the inter-logo gap (rather than the track using
 * `gap`), which is what makes a flat `-50%` translation exact and keeps the
 * spacing between the last and first logo identical to the spacing inside a
 * group.
 *
 * Server Component: no state, no timers, no rAF — the animation is pure CSS
 * on `transform`, so it stays on the compositor.
 */

type Supplier = {
  name: string
  /** Local SVG in /public/brands. Omitted when no legitimate logo exists. */
  logo?: string
  /** Intrinsic width / height of the SVG, used to reserve space (no CLS). */
  ratio?: number
  /** Display height in px at the desktop scale, tuned for equal optical weight. */
  height?: number
}

/**
 * Rendered twice by the markup below — never duplicate this array by hand.
 *
 * ZKTeco and Paradox Security Systems ship no publicly obtainable vector
 * logo, so they appear as a neutral typographic wordmark instead of an
 * invented mark. Everything else is the real logo, stored locally.
 */
const SUPPLIERS: Supplier[] = [
  { name: 'Samsung', logo: '/brands/samsung.svg', ratio: 6.529, height: 20 },
  { name: 'Bosch', logo: '/brands/bosch.svg', ratio: 4.464, height: 28 },
  { name: 'ZKTeco' },
  { name: 'Dahua Technology', logo: '/brands/dahua.svg', ratio: 3.222, height: 30 },
  { name: 'Axis Communications', logo: '/brands/axis-communications.svg', ratio: 2.778, height: 32 },
  { name: 'Hikvision', logo: '/brands/hikvision.svg', ratio: 7.496, height: 17 },
  { name: 'Paradox Security Systems' },
]

function SupplierItem({ supplier, decorative }: { supplier: Supplier; decorative: boolean }) {
  if (!supplier.logo) {
    return (
      <li className="suppliers__item">
        <span className="suppliers__wordmark">{supplier.name}</span>
      </li>
    )
  }
  const height = supplier.height ?? 26
  return (
    <li className="suppliers__item">
      {/* Plain <img>: these are local vectors, so the optimizer adds nothing
          and this avoids inventing fixed pixel dimensions. width/height are
          set from the intrinsic ratio purely to reserve the box. */}
      <img
        className="suppliers__logo"
        src={supplier.logo}
        alt={decorative ? '' : supplier.name}
        width={Math.round(height * (supplier.ratio ?? 1))}
        height={height}
        style={{ '--logo-h': height } as React.CSSProperties}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </li>
  )
}

function SupplierGroup({ decorative }: { decorative: boolean }) {
  return (
    <ul className="suppliers__group" {...(decorative ? { 'aria-hidden': true } : {})}>
      {SUPPLIERS.map((s) => (
        <SupplierItem key={s.name} supplier={s} decorative={decorative} />
      ))}
    </ul>
  )
}

export function SuppliersMarquee() {
  return (
    <section className="suppliers" aria-labelledby="suppliers-label">
      <div className="container suppliers__inner">
        <h2 className="suppliers__label" id="suppliers-label">Proveedores</h2>

        <div className="suppliers__viewport">
          <div className="suppliers__track">
            <SupplierGroup decorative={false} />
            <SupplierGroup decorative />
          </div>
        </div>
      </div>
    </section>
  )
}
