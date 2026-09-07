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
type PhoneNumber = {
  /** Shown to the user. */
  label: string
  /** E.164 payload for wa.me / tel: links — no +, no spaces. */
  digits: string
}

type ContactConfig = {
  whatsappPrimary: PhoneNumber
  /**
   * Optional. Comment the entry out (or delete it) and it disappears from the
   * whole site: every consumer guards on it, so nothing breaks.
   */
  phoneSecondary?: PhoneNumber
  emailPrimary: string
  website: { label: string; url: string }
}

export const CONTACT: ContactConfig = {
  whatsappPrimary: {
    label: '+57 321 3002548',
    digits: '573213002548',
  },
  // phoneSecondary: {
  //   label: '+57 321 300 2548',
  //   digits: '573213002548',  
  // },
  emailPrimary: 'dfhincapiem@gmail.com',
  website: {
    label: 'www.monitorinc.com.co',
    url: 'https://www.monitorinc.com.co',
  },
}
