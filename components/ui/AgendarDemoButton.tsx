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
        background: 'rgba(242, 244, 245, 0.06)',
        border: '1px solid rgba(242, 244, 245, 0.14)',
        color: 'rgba(245, 248, 255, 0.92)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '0.01em',
        textDecoration: 'none',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.20), 0 18px 42px rgba(0,0,0,0.35)',
        ...style,
      }}
    >
      <img
        src="/whatsapp-icon.jpg"
        alt=""
        width={18}
        height={18}
        style={{
          display: 'block',
          borderRadius: 4,
          filter: 'invert(1)',
          opacity: 0.92,
        }}
      />
      <span>{children}</span>
    </a>
  )
}
