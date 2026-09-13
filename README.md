# Prolithica Technologies website

Static company portfolio prepared for local review. No build step or runtime dependencies.

## Run locally

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://localhost:8080.

## Files

- `index.html`: positioning, solutions, capabilities, research, confidentiality, approach and enquiry form.
- `apply/index.html`: step-by-step careers/CSR application flow.
- `csr/index.html`: CSR information and email contact links.
- `privacy-policy.html` and `terms-of-service.html`: website-specific information.
- `styles/site.css`: shared responsive visual system.
- `scripts/site.js`: accessible mobile navigation and form states.
- `scripts/enquiry.mjs`: FormSubmit delivery with response validation and timeout.
- `public/assets/illustrations/`: original SVG artwork, with no client systems or data.
- `public/assets/fonts/`: self-hosted Space Grotesk and its SIL Open Font License.
- `public/assets/prolithica-wordmark.png`: wordmark artwork supplied by the owner on 14 September 2026; displayed with CSS inversion for the light background. It is an image, not an embedded Anurati font.

## Contact and publication review

The owner specified `info@prolithica.com` for project enquiries. The CSR email (`csr@prolithica.com`) comes from the pre-existing repository. The project form retains its existing FormSubmit service. No enquiry messages were sent during development: service states were tested with intercepted responses. The owner should verify inbox delivery and any FormSubmit activation before publishing. The source repository verifies the GitHub organisation link; Aphorion Labs is linked separately as the research partner specified in the redesign brief.

The sign-in link is the exact owner-requested URL: https://www.prolithica.com/PROLITHICAOS/login. It returned HTTP 404 during review on 14 September 2026. The requested link is retained; its external destination needs correction before publication. No authentication changes are part of this static site.

This redesign removes public client references from the rendered pages. All interface examples are explicitly synthetic. No deployment or push is part of the review preparation.

## Verification

```sh
node --test tests/enquiry.test.mjs
```

Browser review covers all four pages at 320, 390, 768, 1024 and 1440 pixels, local links and assets, mobile menu and Escape, reduced motion, native and whitespace validation, rejected submissions, connection failures, successful submissions and form reset. External mail delivery cannot be confirmed by a browser mock.
