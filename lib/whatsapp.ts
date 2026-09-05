import { CONTACT } from '../config/contact'

/**
 * Build a wa.me deep link with a prefilled message.
 *
 * wa.me is used rather than the `whatsapp://` scheme because WhatsApp itself
 * decides how to open it — the desktop app or WhatsApp Web on desktop, the
 * native app on mobile — so no user-agent sniffing is needed here.
 */
export function buildWhatsAppUrl(message: string, digits: string = CONTACT.whatsappPrimary.digits) {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** `tel:` link for a number held in CONTACT. */
export function telHref(digits: string) {
  return `tel:+${digits}`
}
