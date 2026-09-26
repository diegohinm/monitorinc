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
  /** Legal / trading name shown in the top utility bar. */
  companyName: string
  /** Street address as displayed, plus the Google Maps place link it opens. */
  address: { label: string; mapsUrl: string }
  whatsappPrimary: PhoneNumber
  /**
   * Optional. Comment the entry out (or delete it) and it disappears from the
   * whole site: every consumer guards on it, so nothing breaks.
   */
  phoneSecondary?: PhoneNumber
  emailPrimary: string
  website: { label: string; url: string }
  /** Social profiles — shared by the top utility bar and the footer. */
  social: { instagram: string; facebook: string }
}

export const CONTACT: ContactConfig = {
  companyName: 'Monitor Inc SAS',
  address: {
    label: 'Cra. 50b #181-13, Bogotá',
    mapsUrl:
      'https://www.google.com/maps/place/MONITORINC/data=!4m2!3m1!1s0x0:0x2bdf94812d8a0e31?sa=X&ved=1t:2428&ictx=111',
  },
  whatsappPrimary: {
    label: '+57 321 3002548',
    digits: '573213002548',
  },
  // phoneSecondary: {
  //   label: '+57 321 300 2548',
  //   digits: '573213002548',  
  // },
  emailPrimary: 'gerencia@monitorinc.co',
  website: {
    label: 'www.monitorinc.com.co',
    url: 'https://www.monitorinc.com.co',
  },
  social: {
    instagram: 'https://www.instagram.com/monitorinc_/',
    facebook: 'https://www.facebook.com/MONITORINC',
  },
}
