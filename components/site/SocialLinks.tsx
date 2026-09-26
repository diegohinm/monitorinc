import { CONTACT } from '../../config/contact'

/**
 * MONITORINC's social profiles as icon links, shared by the footer and the
 * top utility bar. URLs come from CONTACT.social; each consumer wraps the
 * links in its own container and sizes / tints them from there.
 *
 * Inline outline glyphs — no icon package is installed and nothing is
 * hotlinked. They inherit `currentColor` so the parent controls the tint.
 */
const SOCIALS = [
  {
    net: 'instagram',
    label: 'Instagram de MONITORINC',
    href: CONTACT.social.instagram,
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    net: 'facebook',
    label: 'Facebook de MONITORINC',
    href: CONTACT.social.facebook,
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
]

export function SocialLinks({ linkClassName }: { linkClassName?: string }) {
  return (
    <>
      {SOCIALS.map((s) => (
        <a
          key={s.net}
          className={linkClassName}
          href={s.href}
          data-net={s.net}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            {s.icon}
          </svg>
        </a>
      ))}
    </>
  )
}
