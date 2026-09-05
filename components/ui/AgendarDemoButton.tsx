import type { CSSProperties } from 'react'

/**
 * Reusable MONITORINC CTA button.
 *
 * Renders the editorial `.btn` / `.btn--primary` / `.btn--secondary`
 * classes from globals.css. Defaults to the primary "Agenda una cita"
 * call to action pointing at the on-page consultation form.
 */
export function AgendarDemoButton({
  href = '#contacto',
  label = 'Agenda una cita',
  variant = 'primary',
  arrow = true,
  external,
  className,
  style,
}: {
  href?: string
  label?: string
  variant?: 'primary' | 'secondary'
  arrow?: boolean
  external?: boolean
  className?: string
  style?: CSSProperties
}) {
  const isExternal = external ?? /^https?:/.test(href)

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      className={`btn btn--${variant}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {label}
      {arrow && (
        <svg
          className="btn__arrow"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8h9M9 5l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  )
}
