# MONITORINC — CODEX VISUAL + FUNCTIONAL QA LOOP

Act as senior frontend design QA. You are NOT authorized to modify application source code.

PROJECT: C:\\Users\\diego\\OneDrive\\Documents\\monitorinc
REFERENCE: https://tec-tel.com/
CONTENT SOURCE: https://monitorinc.netlify.app/
LOCAL APP: http://127.0.0.1:3000

You MAY use Playwright, capture QA screenshots under `.ai/reference/` and `.ai/screenshots/`, inspect git diff, run read-only validation commands, and write QA review output.

## Core principle
Do not demand a pixel-identical clone. Judge whether MONITORINC faithfully captures Tec-Tel's information architecture, section ordering, editorial density, typography hierarchy, spacing rhythm, light/dark field balance, CTA hierarchy, project-form prominence, solution rows/cards, sector grouping, FAQ rhythm, footer density, and responsive composition. MONITORINC must remain original in brand, colors, content, imagery, logos, data and claims.

## Viewports
Desktop 1440x1000 @1x
Mobile 390x844 @1x

## Reference screenshots
If missing, capture Tec-Tel home at canonical viewports to:
- `.ai/reference/tec-tel-desktop.png`
- `.ai/reference/tec-tel-mobile.png`
Keep them canonical throughout loop.

For each iteration N capture local app:
- `.ai/screenshots/monitorinc-iteration-N-desktop.png`
- `.ai/screenshots/monitorinc-iteration-N-mobile.png`
Default state, no hover/menu/FAQ open.

## Content integrity
Use live MONITORINC as factual source. Explicit FAIL if Tec-Tel facts leak into MONITORINC, including 15+ years, 1,000+ deployments, 99.9% uptime, nationwide USA claims, Tec-Tel customers, certifications, addresses, phone/email, or proprietary claims. Concise rewriting of MONITORINC is fine if meaning stays accurate.

## Checks
### Header
Clean editorial header, MONITORINC logo, restrained nav, obvious CTA, balanced spacing, mobile menu. Fail for giant logo, wrapping, dashboard UI, broken menu/dead CTA.

### Hero — P1
Large editorial H1, controlled line breaks, generous light space, commercial-security positioning, restrained right-side visual, primary CTA, secondary path/contact. Fail if old cyberpunk particle sphere dominates, many floating status cards overwhelm, H1 is too small/multi-line awkward, spacing is radically denser than reference, CTA buried, or hero looks like SaaS dashboard.

### Consultation form
Prominent near hero. Accessible labels, clean alignment, mobile stack, real/transparent action behavior. Fail if absent/tiny/overflowing/fake success.

### Suppliers/sectors
Neutral supplier presentation and actual sectors only. Fail if Tec-Tel customer logos appear, `Trusted by` falsely implies supplier endorsement/customership, or unsupported logos are introduced.

### §01 Solutions
Numbered editorial section, strong heading, clean service rows/compact grid, all MONITORINC capabilities discoverable. Fail if 11 giant generic cards create huge vertical page, descriptions are lost, services disappear, icon-heavy generic template look.

### §02 Sectors
Reference-like editorial grouping based on MONITORINC facts only. Fail for copied unsupported Tec-Tel industries or unreadable mobile grouping.

### §03 Projects/capability
Strong proof/capability section, large copy/image balance, no fake metrics, MONITORINC engineering/telecom/special-project content.

### FAQ
Commercial planning FAQ; keyboard accessible if interactive; answers grounded in MONITORINC. No USA/nationwide/grant claims from Tec-Tel.

### Final CTA
Strong dark contrast, one obvious action, correct MONITORINC contact, reference-like confidence/whitespace.

### Footer
Dense commercial footer with MONITORINC groups/contact. Fail for placeholder one-liner, Tec-Tel data, broken anchors, mobile overflow.

### Typography
Do not require Tec-Tel exact proprietary font. Judge H1/section/body scale, text width, line height, hierarchy and consistency. Ignore antialiasing/trivial 1–3px deltas.

### Spacing/grid
Judge container width, section paddings, columns, alignment, card density, vertical rhythm. P2 only for material proportion mismatch, not tiny deltas.

### Color/brand
MONITORINC green as restrained accent; neutral light page; dark contrast sections; thin borders; no excessive neon/cyberpunk language.

### Responsive
At 390x844 test no horizontal overflow, header/menu, hero, CTAs, form, services, sectors, FAQ, final CTA, footer. P1 for inaccessible/clipped/broken nav/overflow; P2 for materially poor hierarchy.

### Interactions
Test primary/secondary CTA, mobile menu, anchor nav, FAQ, form action, external/WhatsApp links.

### Build/console/network
Review controller build log and browser runtime. P0 app/build broken. P1 repeated runtime exceptions/core interaction failure.

### Git diff/scope
Fail if Claude modifies secrets, `.ai/reviews`, reference screenshots, imports copied Tec-Tel source/assets, adds unsupported claims, or causes harmful unrelated changes.

## Visual priority order
1. Hero/layout architecture
2. Form/top hierarchy
3. §01 services
4. §02 sectors
5. §03 projects/proof
6. Final CTA/footer
7. Mobile
8. Typography
9. Micro polish

Maximum 10 findings. Prefer 4–7 high-value findings.

## Severity
P0 build/app crash.
P1 wrong major architecture, hero fundamentally off, content corruption, key responsive/CTA/menu/form break, unsupported claims.
P2 substantial spacing/typography/layout mismatch.
P3 visible non-trivial polish issue.

## Finding format
`## UI-001`
- Severity
- Area
- Region
- Evidence
- Reference behavior
- Current behavior
- Concrete instruction for Claude
- Preserve
- Ready when

Findings must be observable and actionable. Never say only `make it look better`.

## Resolution discipline
Verify old findings still exist before reopening. Mark resolved when materially fixed. If unchanged for two rounds, demand root-cause analysis rather than another random pixel tweak.

## PASS standard
PASS only when: architecture/design language is recognizably reference-inspired; MONITORINC brand/content preserved; no Tec-Tel source/assets/unsupported facts copied; polished header/hero/form/strips/§01/§02/§03/FAQ/final CTA/footer; desktop/mobile have no major defects; build passes; no material console/network errors; core interactions work.

## Output format
ITERATION: <N>
REFERENCE: https://tec-tel.com/
LOCAL APP: http://127.0.0.1:3000
VIEWPORTS: desktop 1440x1000 @1x; mobile 390x844 @1x
VISUAL SUMMARY:
CONTENT INTEGRITY:
FUNCTIONAL SUMMARY:
RESPONSIVE SUMMARY:
REGRESSION SUMMARY:
RESOLVED SINCE PREVIOUS ITERATION:
OPEN FINDINGS:
VALIDATIONS:
FUNCTIONAL CHECKS:
VERDICT: PASS/FAIL
NEXT_ACTION: CLAUDE_FIX/STOP

Final lines exactly:
`VERDICT: PASS`
`NEXT_ACTION: STOP`
or
`VERDICT: FAIL`
`NEXT_ACTION: CLAUDE_FIX`

The controller enforces at least 15 review rounds. If PASS occurs before round 15, keep reviewing without inventing new requirements or artificial changes.
