import { CONTACT } from '../config/contact'
import { telHref, whatsappHref } from '../lib/whatsapp'

/**
 * Thin dark utility bar rendered as the first row inside the global <header>,
 * so it shares the sticky block with the main header row. Company name and
 * address on the left, WhatsApp / phone contact on the right; every value
 * comes from config/contact.ts.
 *
 * "Contacto:" (with the WhatsApp glyph) and the number are two adjacent
 * anchors styled as one block — wa.me and tel: respectively — because an
 * anchor cannot be nested inside another anchor.
 *
 * Heights live in --topbar-h (globals.css); the mobile menu offset and the
 * scroll padding read the same variable. No state, no client JS.
 */

/* Same glyph as the floating WhatsApp button, at utility size. */
const WHATSAPP_PATH =
  'M435.689 74.468C387.754 26.471 324 .025 256.071 0 116.098 0 2.18 113.906 2.131 253.916c-.024 44.758 11.677 88.445 33.898 126.946L0 512.459l134.617-35.311c37.087 20.238 78.85 30.891 121.345 30.903h.109c139.949 0 253.88-113.917 253.928-253.928.024-67.855-26.361-131.645-74.31-179.643v-.012zm-179.618 390.7h-.085c-37.868-.011-75.016-10.192-107.428-29.417l-7.707-4.577-79.886 20.953 21.32-77.889-5.017-7.987c-21.125-33.605-32.29-72.447-32.266-112.322.049-116.366 94.729-211.046 211.155-211.046 56.373.025 109.364 22.003 149.214 61.903 39.853 39.888 61.781 92.927 61.757 149.313-.05 116.377-94.728 211.058-211.057 211.058v.011zm115.768-158.067c-6.344-3.178-37.537-18.52-43.358-20.639-5.82-2.119-10.044-3.177-14.27 3.178-4.225 6.357-16.388 20.651-20.09 24.875-3.702 4.238-7.403 4.762-13.747 1.583-6.343-3.178-26.787-9.874-51.029-31.487-18.86-16.827-31.597-37.598-35.297-43.955-3.702-6.355-.39-9.789 2.775-12.943 2.849-2.848 6.344-7.414 9.522-11.116s4.225-6.355 6.343-10.581c2.12-4.238 1.06-7.937-.522-11.117-1.584-3.177-14.271-34.409-19.568-47.108-5.151-12.37-10.385-10.69-14.269-10.897-3.703-.183-7.927-.219-12.164-.219s-11.105 1.582-16.925 7.939c-5.82 6.354-22.209 21.709-22.209 52.927 0 31.22 22.733 61.405 25.911 65.642 3.177 4.237 44.745 68.318 108.389 95.812 15.135 6.538 26.957 10.446 36.175 13.368 15.196 4.834 29.027 4.153 39.96 2.52 12.19-1.825 37.54-15.353 42.824-30.172 5.283-14.818 5.283-27.529 3.701-30.172-1.582-2.641-5.819-4.237-12.163-7.414l.011-.024z'

export function TopUtilityBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <div className="topbar__group">
          <span className="topbar__brand">
            <span className="topbar__dot" aria-hidden="true" />
            {CONTACT.companyName}
          </span>
          <span className="topbar__sep" aria-hidden="true" />
          <a
            className="topbar__link topbar__address"
            href={CONTACT.address.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir ubicación de MONITORINC en Google Maps"
          >
            <svg
              className="topbar__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{CONTACT.address.label}</span>
          </a>
        </div>

        <div className="topbar__group topbar__contact">
          <a
            className="topbar__link topbar__wa"
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar a MONITORINC por WhatsApp"
          >
            <svg
              className="topbar__icon topbar__icon--wa"
              viewBox="0 0 510 512.459"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d={WHATSAPP_PATH} />
            </svg>
            <span>Contacto:</span>
          </a>
          <a
            className="topbar__link topbar__tel"
            href={telHref(CONTACT.whatsappPrimary.digits)}
            aria-label="Llamar a MONITORINC"
          >
            {CONTACT.whatsappPrimary.label}
          </a>
        </div>
      </div>
    </div>
  )
}
