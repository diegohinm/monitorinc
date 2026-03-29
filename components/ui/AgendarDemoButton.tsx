'use client'

import type { CSSProperties, ReactNode } from 'react'

export function AgendarDemoButton({
  href = 'https://wa.me/573138407090',
  children = 'Agendar Demo',
  className,
  style,
}: {
  href?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '11px 22px',
        borderRadius: 999,
        background: 'linear-gradient(to right, #00E7FB, #e628ff)',
        border: 'none',
        color: '#000',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '0.01em',
        textDecoration: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        boxShadow: 'none',
        ...style,
      }}
    >
      <img
        src="/whatsapp-icon-hero.jpg"
        alt=""
        width={18}
        height={18}
        style={{
          display: 'block',
          borderRadius: 4,
          filter: 'none',
          opacity: 1,
        }}
      />
      <span>{children}</span>
    </a>
  )
}
