/**
 * Single source of truth for MONITORINC's public contact details.
 *
 * `label` is what the user sees; `digits` is the E.164 payload (no +, no
 * spaces) used to build `wa.me` and `tel:` links. Never assemble either of
 * these by hand in a component — import from here so a number only ever has
 * to change in one place.
 *
 * Deliberately a plain TS module rather than env vars: these are public
 * details, and keeping them typed and in-repo avoids a deploy-config step.
 */
export const CONTACT = {
  whatsappPrimary: {
    label: '+57 313 840 7090',
    digits: '573138407090',
  },
  phoneSecondary: {
    label: '+57 321 300 2548',
    digits: '573213002548',
  },
  emailPrimary: 'info@monitorinc.com.co',
  website: {
    label: 'www.monitorinc.com.co',
    url: 'https://www.monitorinc.com.co',
  },
} as const
