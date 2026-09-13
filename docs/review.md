# Local redesign review — 14 September 2026

Preview: http://localhost:8080

Implemented: reference-style tabbed cards, centred supplied PROLITHICA artwork, original SVG code/system/security imagery, full company brief, five solution specialisms, seven broader capabilities, Aphorion partnership, synthetic examples, full confidentiality statement, delivery process, contact form, shared CSR and legal page styling. No publication or push performed.

Checks passed:
- Four enquiry service contract tests.
- All four pages at 320, 390, 768, 1024, and 1440 px without horizontal overflow.
- All local page links, anchor targets and referenced resources resolve.
- No page JavaScript errors.
- Automated axe WCAG 2 A/AA and WCAG 2.1 AA checks on all four pages reported no violations. This is an automated check, not a full accessibility certification.
- Menu open/close, Escape focus return and reduced-motion behaviour.
- Required-field and whitespace validation; intercepted service rejection, network failure, confirmed success and form reset. Zero messages sent.
- Desktop/mobile screenshots visually inspected.

Before publication:
- The owner-requested sign-in destination https://www.prolithica.com/PROLITHICAOS/login returns HTTP 404. The header retains this exact URL.
- Confirm FormSubmit activation and actual receipt at the existing info@prolithica.com inbox. Browser tests validate form behaviour without sending real enquiries.

The supplied Anurati wordmark is rendered as an image. It is not an embedded font file.

Follow-up: careers/CSR conversation page added at `/apply/`; viewport checks pass at 320–1440 px. The requested black-background developer source is screened into the light About panel and used on the black application panel. The shared decorative code background is fixed to the viewport so it cannot extend the document's scroll height.
