# TOLL_MAP Legal

Static, accessible legal pages for the TOLL_MAP mobile app, intended for GitHub Pages at `https://bryankcodes.github.io/toll-map-legal/`.

## Publication status

**Draft 0.1 is deployable but publication is blocked.** The source deliberately includes `noindex` metadata, a restrictive `robots.txt`, and inline placeholders for operator details. The user-facing pages are intentionally plain documents; internal release notes live here rather than on the legal pages. Do not publish or enter these URLs in production consoles until every item below is resolved and Singapore-qualified counsel has reviewed the result.

Required operator inputs:

- registered legal/operator name;
- UEN, if the operator has one;
- business address and place of establishment;
- monitored support/legal email;
- publicly available Data Protection Officer/privacy contact;
- final effective date and version;
- final eligibility/children's-use position and app-store age settings.

Required operational decisions:

- production cloud, database, logging, support, and backup vendors and processing regions;
- processor agreements, cross-border transfer assessment, and final subprocessor inventory;
- enforced retention/deletion schedule for principals, purchase/entitlement records, export challenges/permits, rewarded-ad records, logs, support records, and backups;
- access-log redaction for place queries/session tokens and AdMob server-side-verification query data;
- tested access, correction, consent-withdrawal, cessation/deletion, complaint, and incident-response procedures;
- an in-app Terms acceptance/version-recording flow appropriate to the final legal advice;
- Google Maps/OSM hybrid presentation, attribution, LTA dataset/licence, store listing, Data Safety/App Privacy, UMP, ATT, and purchase configuration review.

Before publication, replace every bracketed operator placeholder, insert the approved effective date, remove `noindex, nofollow`, delete `robots.txt` (or change it to permit indexing), update the tests/validator, and obtain approval.

## Pages

| Use | Expected public URL |
| --- | --- |
| Legal landing page | `https://bryankcodes.github.io/toll-map-legal/` |
| Privacy Policy | `https://bryankcodes.github.io/toll-map-legal/privacy/` |
| Terms of Use | `https://bryankcodes.github.io/toll-map-legal/terms/` |

These are the URLs to use after deployment as follows:

- **AdMob:** Privacy Policy URL → `/privacy/`; consent-message privacy-policy link → `/privacy/`.
- **App Store Connect:** Privacy Policy URL → `/privacy/`; licence/terms link where used → `/terms/`.
- **Google Play Console:** Privacy policy URL → `/privacy/`; terms link in the listing or app → `/terms/`.
- **TOLL_MAP app:** `EXPO_PUBLIC_PRIVACY_URL` → `/privacy/`; `EXPO_PUBLIC_TERMS_URL` → `/terms/`.

Production mobile configuration:

```dotenv
EXPO_PUBLIC_PRIVACY_URL=https://bryankcodes.github.io/toll-map-legal/privacy/
EXPO_PUBLIC_TERMS_URL=https://bryankcodes.github.io/toll-map-legal/terms/
```

The current app reads those exact variable names in `apps/mobile/src/services/legalLinks.ts`. Changing only these public URLs normally does not require regenerating native projects; changing native AdMob application identifiers or native plugin configuration requires the appropriate clean native rebuild.

## Local development

Requirements: Node.js 20 or later and npm. The project has no runtime or development dependencies.

```sh
npm ci
npm run check
npm run serve
```

Open `http://localhost:4173/`, `http://localhost:4173/privacy/`, and `http://localhost:4173/terms/`.

`npm run check` validates source accessibility/security invariants, syntax-checks build scripts, runs tests, builds `_site`, and validates the artifact. The site uses semantic HTML and one local stylesheet. It has no JavaScript, external fonts, analytics, advertising, cookies, or tracking scripts.

## GitHub Pages deployment

The workflow at `.github/workflows/pages.yml` uses the official Pages artifact deployment flow. It runs on pushes to `main` and by manual dispatch.

1. Complete and approve all publication blockers above.
2. Run `npm run check` and review the rendered pages on mobile, desktop, keyboard-only, and print views.
3. Commit and push to `main`.
4. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
5. Run or inspect **Actions → Deploy legal site to GitHub Pages**.
6. Verify all three HTTPS URLs, canonical tags, links, mobile configuration, and store/AdMob entries in a clean browser.

The workflow uses `actions/checkout@v7`, `actions/setup-node@v6`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5`, which were the current official major versions when reviewed on 5 September 2026. GitHub explains the custom Pages workflow in its [official documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Repository structure

```text
.
├── .github/workflows/pages.yml
├── assets/styles.css
├── privacy/index.html
├── terms/index.html
├── scripts/
├── tests/
├── 404.html
├── index.html
├── RESEARCH_NOTES.md
└── robots.txt
```

## Drafting basis and limitations

The initial source audit covered the separate main app repository at `../TOLL_MAP/toll_map`, including the Expo app, FastAPI services, migrations, mobile SDK integrations, container configuration, product plan, and roadmap. The evidence inventory and authoritative legal/service sources are recorded in [RESEARCH_NOTES.md](./RESEARCH_NOTES.md).

This repository provides an evidence-based first draft, not a guarantee of compliance or legal advice. App behavior, deployed infrastructure, vendor settings, console declarations, contracts, and operational procedures must match the final text. Singapore-qualified counsel should review the final operator-specific documents, consumer terms, limitation provisions, purchase language, consent design, and cross-border arrangements before release.
