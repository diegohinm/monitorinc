# MONITORINC — CLAUDE IMPLEMENTATION LOOP

You are the ONLY agent authorized to modify application code.

PROJECT: C:\\Users\\diego\\OneDrive\\Documents\\monitorinc
REFERENCE: https://tec-tel.com/
CONTENT SOURCE: https://monitorinc.netlify.app/
LOCAL APP: http://127.0.0.1:3000

## Goal
Create an ORIGINAL MONITORINC implementation that follows Tec-Tel closely in page architecture, section order, editorial density, typography hierarchy, spacing rhythm, grids, CTA hierarchy, consultation-form placement, service presentation, sector grouping, FAQ rhythm, footer density, and responsive behavior.

Do NOT copy Tec-Tel source code, assets, photos, logos, proprietary text, customer logos, metrics, claims, or factual content. Use MONITORINC branding/content only.

## Every iteration
1. Read this file completely.
2. Read `.ai/claude-status.md`.
3. Read `.ai/reviews/codex-ui-review-latest.md` if it exists.
4. Inspect the project before editing.
5. Inspect `.ai/reference/tec-tel-desktop.png` and `.ai/reference/tec-tel-mobile.png`.
6. Inspect latest `.ai/screenshots/`.
7. Iteration 1: perform major architecture redesign.
8. Iterations 2+: fix ONLY Codex OPEN FINDINGS.
9. Preserve already-passed areas.
10. Run build/lint/typecheck/tests when available.
11. Update `.ai/claude-status.md`.
12. Never modify `.ai/reviews/` or reference screenshots.
13. Never commit/push.

If the same finding survives two rounds without visible improvement, stop random pixel tweaks, diagnose root cause, identify the responsible DOM/CSS/component, fix structurally, and document it.

## Canonical viewports
Desktop: 1440x1000 @1x
Mobile: 390x844 @1x

## MONITORINC content source of truth
Hero:
- `Haz de cada espacio un lugar seguro.`
- `Distribuimos e integramos equipos de seguridad electrónica y comunicación`

Suppliers currently listed:
Samsung, Bosch, ZKTeco, Dahua Technology, Axis Communications, Hikvision, Paradox Security Systems. Use neutral label `Proveedores`; do not imply official partnership/certification unless supported by repo.

Sectors: Hogares, Empresas, Fincas, Instituciones. Current service copy also mentions gated communities, houses, apartments, offices, companies and educational institutions where relevant.

Services:
1. CCTV and recording
2. Access control
3. Intrusion alarms
4. Perimeter security
5. Fire detection / evacuation alarms
6. GPS positioning / tracking
7. Door automation
8. Home automation
9. Intercom / video intercom
10. Drones
11. Special projects

Supported details:
- CCTV: IP/analog cameras and recorders; security, loss prevention, personnel/process control.
- Access: people/vehicle entry; RFID, barcode, fingerprints, face detection/recognition wording consistent with source.
- Intrusion: wired/wireless, indoor/outdoor, remote mobile monitoring.
- Perimeter: electric fences, concertina, audible alarms, user control; farms/gated communities/educational institutions.
- Fire: automatic detection and audio evacuation; do not invent certifications.
- GPS: cars/motorcycles/bicycles; GSM, SMS/internet.
- Doors: swing, overhead/basculating, sliding; wireless controls.
- Domotics: lights, temperature, appliances, intrusion sensors, remote control, energy management.
- Intercom: IP/analog, video/audio, houses/apartments/offices/companies.
- Drones: event control, rural/urban surveillance, HD aerial video, mapping, construction inspection.
- Special projects: electronic engineering, telecommunications, specialized equipment/communications, difficult environments.

CTA:
- `Agenda una cita para asesorar tu proyecto.`
- `Cuéntanos qué necesitas y te ayudamos a elegir e integrar la solución adecuada para tu espacio, operación o infraestructura.`

Contact:
313 8407090
321 3002548
info@monitorinc.com.co
ing.jimenez@outlook.com
luquesarmiento@gmail.com
www.monitorinc.com.co

## Never invent
No years in business, deployment counts, customer counts/logos, uptime, 24/7 staffed monitoring, nationwide claims, warranties, SLAs, certifications, official supplier partnership, testimonials, pricing, Tec-Tel clients/metrics.

## Visual system
Use existing MONITORINC tokens if present. Fallback:
- green #A1BB0D
- green-dark #7E940A
- black #18191B
- charcoal #303135
- gray #696A6E
- light #F3F3F0
- white #FFFFFF
- border rgba(24,25,27,.13)

Predominantly light/off-white page, dark contrast sections, green as accent/CTA, thin borders, minimal shadows, no excessive glassmorphism, no cyberpunk/dashboard language.

Use existing font or `next/font` Inter/Manrope. Do not copy Tec-Tel font files.
Suggested scale: hero clamp(3.2rem,6vw,5.8rem), line-height .95–1; section h2 clamp(2.2rem,4.4vw,4.4rem); body 16–18px. Container max 1240–1320px; desktop pad 32–48px; mobile 18–22px; section spacing desktop 110–160px, mobile 72–96px.

## Required architecture
### Header
MONITORINC logo. Nav: Soluciones, Sectores, Proyectos, Nosotros, Contacto. CTA `Agenda una cita`. Sticky, clean, restrained, functional mobile menu.

### Hero
Headline `Haz de cada espacio / un lugar seguro.` Supporting copy from MONITORINC. CTAs `Agenda una cita` and `Ver soluciones`. Editorial/commercial, not a dashboard. If retaining status annotations like Cámara 01 / Alarma / GPS / Acceso, max 2–3 and secondary. Old particle sphere must not dominate. Use local assets only.

### Consultation form
Near top, prominent like reference role. Heading `Planifica tu sistema de seguridad.` Copy `Cuéntanos qué espacio necesitas proteger y qué solución estás buscando.` Fields: Nombre, Empresa, Teléfono, Correo, Tipo de proyecto, Mensaje. CTA `Solicitar asesoría`. Do not fake successful submission.

### Supplier / sector strip
Neutral `Proveedores` strip using supported supplier names; separate `Atendemos a` strip with Hogares / Empresas / Fincas / Instituciones. Never copy Tec-Tel customer logos.

### §01 QUÉ HACEMOS
Title `Seguridad, acceso y monitoreo desde un solo integrador.` Use compact editorial rows/grids, numbers, thin dividers. Do not make 11 giant generic cards. Logical grouping allowed: Seguridad (CCTV, intrusion, perimeter, fire); Acceso (access control, intercom); Automatización (doors, domotics); Monitoreo/proyectos (GPS, drones, special projects). Keep all descriptions discoverable.

### §02 SECTORES
Title `Sistemas de seguridad para los espacios que operas, habitas y proteges.` Use actual sectors only, reference-like editorial grouping, no invented customers.

### §03 PROYECTOS ESPECIALES
Title suggestion `Ingeniería para proyectos que exigen más que una instalación estándar.` Use supported engineering/telecom/special-communications/difficult-environment content. No fake metrics. Qualitative capability blocks instead.

### FAQ
Grounded questions: cameras, mobile alarm monitoring, fingerprint access, gated communities/companies, integration of cameras/access/alarms, what information is needed for advice. Answers must remain within MONITORINC claims.

### Final CTA
Dark contrast section. Title `Planeemos la seguridad de tu espacio.` CTA `Agenda una cita`. Real MONITORINC contact.

### Footer
Dense commercial footer: brand description, solutions, sectors, contact. No Tec-Tel facts.

## Assets
Never download/copy/hotlink Tec-Tel images, logos, customer logos, or screenshots as page assets. Use MONITORINC local assets. If imagery is missing, use tasteful local placeholders and document required replacements. Prefer `next/image` and `next/font`.

## Responsive / accessibility
390x844 must have no horizontal overflow, functional menu, unclipped hero, accessible CTA, stacked form, readable service/sector layouts and footer. One H1, semantic headings, keyboard menu/FAQ, visible focus, form labels, proper alt text.

## Performance
Server components by default; `use client` only where needed. Avoid heavy WebGL/canvas unless a retained existing feature truly needs it.

## Iteration strategy
Iteration 1: major redesign of header, hero, form, strips, §01, §02, §03, FAQ, final CTA, footer, responsive base.
Iterations 2+: fix Codex OPEN FINDINGS only, highest severity first. Preserve passed areas.
If previous Codex review is PASS but controller has not reached minimum 15 rounds, inspect/validate and do not invent changes; edit only for a real regression.

## Validation
Run available: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`. Do not claim PASS for missing scripts.

## Status format
Write `.ai/claude-status.md` with:
ITERATION, IMPLEMENTED, FILES CHANGED, CODEX FINDINGS ADDRESSED, AREAS INTENTIONALLY UNCHANGED, ROOT CAUSE ANALYSIS, VALIDATIONS, KNOWN LIMITATIONS, ASSETS STILL NEEDED, READY_FOR_CODEX_REVIEW.

The external controller owns the loop and stop condition.
