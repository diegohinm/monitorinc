'use client'

import type { CSSProperties } from 'react'

/**
 * Reusable "Agendar Demo" CTA button — Maze-style pill with WhatsApp icon.
 *
 * Uses the existing `.a-button` / `.a-button--primary` / `.a-button--secondary`
 * CSS classes from globals.css. Pass `variant` to choose the style.
 */
export function AgendarDemoButton({
  href = 'https://wa.me/573138407090',
  label = 'Agendar Demo',
  variant = 'primary',
  external,
  className,
  style,
}: {
  href?: string
  label?: string
  /** 'primary' (default) or 'secondary' */
  variant?: 'primary' | 'secondary'
  /** Force target="_blank". Defaults to true for http(s) links. */
  external?: boolean
  className?: string
  style?: CSSProperties
}) {
  const isExternal = external ?? href.startsWith('http')

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      className={`a-button a-button--${variant}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <img
        src="/whatsapp-icon-black2.svg"
        alt=""
        width={16}
        height={16}
        className="a-button__wsp-icon"
      />
      {label}
    </a>
  )
}
