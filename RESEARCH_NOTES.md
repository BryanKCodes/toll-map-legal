# TOLL_MAP legal research and source audit

**Research version:** 0.1
**Cut-off date:** 5 September 2026 (Singapore time)
**Document status:** working notes for Draft 0.1; not a compliance opinion

These notes record the evidence used to draft the legal pages. A source link indicates the material reviewed, not a representation that TOLL_MAP has satisfied every requirement. Legal requirements, provider terms, SDK behavior, dashboard settings, infrastructure, and the app can change; they must be rechecked before publication and on material change.

## Repository evidence

Main app repository reviewed: `/Users/bryanktp/VisualStudioProjects/TOLL_MAP/toll_map` (`https://github.com/BryanKCodes/toll-map.git`). The legal repository was empty and on an unborn `main` branch when the audit began; its configured origin was `https://github.com/BryanKCodes/toll-map-legal`.

| Area | Evidence reviewed | Drafting conclusion |
| --- | --- | --- |
| Mobile runtime and permissions | `apps/mobile/package.json`, `apps/mobile/app.json`, screens/components and services under `apps/mobile` | Expo SDK 54; foreground coarse/fine location; Google Maps provider; SecureStore and AsyncStorage; UMP/AdMob, ATT, and RevenueCat SDKs. No background-location request found. |
| Anonymous identity | Mobile auth/API services; backend principal authentication route, models, and migration | First launch creates an app-principal UUID, custom RevenueCat app-user ID, and rotatable bearer credential. The device stores the credential and IDs; the server stores a SHA-256 digest. This is pseudonymous, not necessarily anonymous. |
| Route/place processing | Mobile route/place clients; FastAPI compare, Google provider, Places/Roads proxy, and Valhalla services | Requests can include coordinates, search text/place IDs/session tokens, departure time, vehicle class, route/sort preferences, and results. Google receives data needed for Maps/Places/Routes/Roads. Self-hosted Valhalla receives routing inputs within operator infrastructure. |
| ERP | ERP engine and data ingestion services; product documentation | Route geometry, direction, estimated crossing time, vehicle class, and dynamic source data support estimates. Timing at a rate-band boundary can change the estimate by a minute. LTA/relevant authority controls actual rates. |
| Caching and logs | Backend settings, cache, structured logging, HTTP client logging, and server startup | Route-result persistence is disabled by default; optional in-memory cache defaults to 30 seconds. Structured application telemetry is minimised. Final production access logs are unresolved and may expose query strings unless redacted. |
| Monetisation schema | Alembic migration for `app_principals`, `purchase_events`, `entitlements`, `export_challenges`, `ad_reward_transactions`, `export_permits`; related services/routes | Database records associate a principal with purchases, entitlements, rewards, and route-bound exports. No complete cleanup/deletion schedule was found. Challenge validity defaults to 15 minutes and permit validity to 10 minutes, but expiry does not itself delete rows. |
| Advertising | Consent/provider, native inline-ad, rewarded-ad, telemetry, and export components | Free users may receive native ads within route cards. Current app-level ad telemetry payload is event, placement, and platform only. AdMob SDK and infrastructure process more data. Premium skips AdMob only after the entitlement resolves active. |
| Rewarded export | Mobile export-gate service/components and backend challenge/SSV/permit routes | Reward is required for free exports of current custom solver/Valhalla-style generation methods; Google baseline/alternative routes export directly. AdMob SSV uses the principal and route-bound custom data. Permits are short-lived and single-use. |
| Premium | RevenueCat service/provider, paywall, settings, backend webhook and entitlement services | One-time non-consumable Lifetime Premium; entitlement `toll_map_pro`; current UI benefit is no ads and unlimited/instant exports. Displayed production price comes from the store. Restore is user-triggered and is not a refund. |
| Device-local data | Saved-place and recent-search services | Home/Work/Activity descriptions and coordinates use SecureStore and can be individually deleted. Up to 15 recent descriptions/coordinates are kept in AsyncStorage and can be deleted. |
| Hosting and vendors | Docker/deployment files, environment examples, product plan, roadmap | Local Postgres, Redis, and Valhalla are configured. AWS Singapore appears only as a plan; no production infrastructure-as-code proves it is deployed. Production cloud/database/logging/support vendors and regions are release blockers. |
| Legal readiness | `PROD_PLAN.md`, `ROADMAP.md`, source-wide contact/legal search | No verified operator legal name, UEN, address, support email, public DPO contact, complete retention schedule, deletion workflow, final child policy, or versioned acceptance record. Do not publish until resolved. |

### Logging risk to resolve

The application logger avoids request bodies, coordinates, bearer tokens, route hashes, and provider URLs in its designed structured fields. However, server access logging and upstream proxy/hosting logs were not proven to redact the request target. Places autocomplete currently sends search text and a session token in a backend query string; the AdMob server-side-verification callback carries principal and route-bound data in its query. Production logging must be configured and tested so these are not captured in public, analytics, or overbroad logs. The legal draft therefore does not claim that all logs exclude these fields.

### Hosting distinction

OpenStreetMap and LTA are presently data sources, not route-request recipients: the self-hosted Valhalla design uses OSM-derived data, and LTA information is ingested into TOLL_MAP. Google is a recipient for Maps/Places/Routes/Roads and advertising functions. This distinction must be retested against the deployed network topology.

## Authoritative legal and regulatory sources

### Singapore PDPA and PDPC

- [PDPC — Data protection obligations](https://www.pdpc.gov.sg/overview-of-pdpa/the-legislation/personal-data-protection-act/data-protection-obligations): accountability and public DPO contact, notification, consent/withdrawal, purpose limitation, accuracy, protection, retention, transfer limitation, access/correction, and breach obligations.
- [PDPC — Individuals overview](https://www.pdpc.gov.sg/overview-of-pdpa/data-protection/individual/individuals-overview): access, correction, consent withdrawal, and complaint context.
- [PDPC — Advisory Guidelines on Key Concepts in the PDPA](https://www.pdpc.gov.sg/-/media/files/pdpc/pdf-files/advisory-guidelines/ag-on-key-concepts/advisory-guidelines-on-key-concepts-in-the-pdpa-17-may-2022.pdf): full guidance, revised 17 May 2022.
- [PDPC — Guide to Handling Access Requests](https://www.pdpc.gov.sg/help-and-resources/2017/10/guide-to-handling-access-requests).
- [PDPC — Guide on Managing and Notifying Data Breaches](https://www.pdpc.gov.sg/-/media/Files/PDPC/PDF-Files/Other-Guides/Guide-on-Managing-and-Notifying-Data-Breaches-under-the-PDPA-15-Mar-2021.pdf?la=en): breach assessment and notification guidance.
- [PDPC — Report a personal data protection concern](https://www.pdpc.gov.sg/complaints-and-reviews/report-a-personal-data-protection-concern).
- [Singapore Statutes Online — Consumer Protection (Fair Trading) Act 2003](https://sso.agc.gov.sg/Act/CPFTA2003?WholeDoc=1), [Unfair Contract Terms Act 1977](https://sso.agc.gov.sg/Act/396), [Contracts (Rights of Third Parties) Act 2001](https://sso.agc.gov.sg/Act/CRTPA2001), and [Electronic Transactions Act 2010](https://sso.agc.gov.sg/Act/ETA2010). The SSO pages returned automated-access errors during the final link check; counsel should verify the current official text directly.

## App stores, payments, and privacy declarations

### Apple

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/): privacy, in-app purchase, digital functionality, and restore expectations.
- [Manage app privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/) and [App privacy details](https://developer.apple.com/app-store/app-privacy-details/): privacy URL and disclosure of first- and third-party SDK practices.
- [User privacy and data use](https://developer.apple.com/app-store/user-privacy-and-data-use/) and [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency): tracking permission requirements.
- [Restoring purchased products](https://developer.apple.com/documentation/storekit/restoring-purchased-products): StoreKit restoration mechanisms.

### Google Play

- [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en-GB): privacy policy, secure handling, disclosure, permissions, and account-deletion requirements where applicable.
- [Data Safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en): developer responsibility for app and included SDK practices.
- [Prominent disclosure and consent](https://support.google.com/googleplay/android-developer/answer/11150561?hl=en).
- [Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en): Play Billing rules for digital features.
- [Google Play refund policies](https://support.google.com/googleplay/answer/15574908?hl=en).

## Advertising and consent

- [Google UMP privacy documentation](https://developers.google.com/admob/android/privacy): consent-information updates and privacy-options entry point.
- [Google ad-serving modes](https://developers.google.com/admob/android/privacy/ad-serving-modes): personalised, non-personalised, and limited ads based on consent/configuration.
- [Google Mobile Ads SDK data disclosure](https://developers.google.com/admob/ios/privacy/data-disclosure): IP/general location, identifiers, diagnostics, performance, and ad interactions the SDK may collect.
- [Google Mobile Ads and IDFA](https://developers.google.com/admob/ios/privacy/idfa): ads can still be requested without IDFA after ATT denial.

Google marked several AdMob pages as updated 3 September 2026 during this review. Recheck them when preparing store declarations.

## Maps, routes, and data licences

- [Google Routes API policies](https://developers.google.com/maps/documentation/routes/policies): attribution, end-user Terms/Privacy, and Google end-user reference requirements.
- [Google Maps Platform Terms](https://cloud.google.com/maps-platform/terms), [Maps Service Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms), [Google Maps/Google Earth Additional Terms](https://maps.google.com/help/terms_maps/), and [Google Privacy Policy](https://policies.google.com/privacy).
- [OpenStreetMap copyright and licence](https://www.openstreetmap.org/copyright) and [OSMF Attribution Guidelines](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines): ODbL and routing-app attribution.
- [LTA DataMall API Terms of Service](https://datamall.lta.gov.sg/content/datamall/en/api-terms-of-service.html) and [LTA DataMall](https://datamall.lta.gov.sg/content/datamall/en.html): API terms and Singapore Open Data Licence references.
- [LTA OneMotoring ERP information](https://onemotoring.lta.gov.sg/content/onemotoring/home/driving/ERP/ERP.html): official ERP information.
- [LTA — ERP 2.0 transition announcement](https://www.lta.gov.sg/content/ltagov/en/newsroom/2026/2/news-releases/amendments-rta-facilitate-erp2-transition-enhance-penalties.html): system transition context; re-review before 1 January 2027.
- [Valhalla project](https://github.com/valhalla/valhalla): open-source, OSM-based routing engine and licence.

The display of OSM-derived Valhalla routes on a Google base map is a provider-licensing review gate. Counsel and engineering must verify that the final presentation, caching, attribution, and export implementation comply with all applicable terms.

## RevenueCat

- [RevenueCat Privacy Policy](https://www.revenuecat.com/privacy-policy): app-user identifier, purchase/receipt/token, device, IP, and service data.
- [RevenueCat DPA and subprocessor information](https://www.revenuecat.com/dpa): contractual and subprocessor terms; reviewed in its August 2026 form.
- [Restoring purchases](https://www.revenuecat.com/docs/getting-started/restoring-purchases) and [restore behavior](https://www.revenuecat.com/docs/projects/restore-behavior): restore, transfer, and alias behavior.
- [Entitlements](https://www.revenuecat.com/docs/getting-started/entitlements) and [non-subscriptions](https://www.revenuecat.com/docs/platform-resources/non-subscriptions): entitlement and lifetime/non-consumable implementation guidance.

The RevenueCat project transfer behavior and store product configuration live outside source control and require dashboard verification.

## GitHub Pages

- [GitHub — Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- Official action releases reviewed 5 September 2026: [checkout](https://github.com/actions/checkout/releases), [setup-node](https://github.com/actions/setup-node/releases), [configure-pages](https://github.com/actions/configure-pages/releases), [upload-pages-artifact](https://github.com/actions/upload-pages-artifact/releases), and [deploy-pages](https://github.com/actions/deploy-pages/releases).
- [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement): relevant to visitor request/security data for the hosted legal pages.

## Decisions to revalidate before release

1. Complete every operator/contact field and verify the contracting legal entity.
2. Adopt and implement a retention schedule, deletion workflow, backup expiry, log redaction, and rights-request runbook.
3. Verify production hosts, regions, vendors, contracts, and international-transfer safeguards.
4. Decide the children's/age position and align app rating, UMP treatment, ad settings, store declarations, and the terms.
5. Reconcile Apple App Privacy and Google Play Data Safety answers against SDK versions and production traffic.
6. Validate AdMob UMP messages, ATT sequencing, privacy-options entry point, Premium ad suppression, test devices, and SSV privacy/log handling.
7. Validate RevenueCat product/entitlement, one-time pricing, same-store restoration, transfer behavior, webhook authenticity, and delayed-sync UI.
8. Complete Google Maps/OSM/LTA licence and attribution review, including exported and hybrid route displays.
9. Implement and record versioned acceptance if counsel determines clickwrap is required for the intended risk allocation.
10. Re-run source, dependency, network, and legal research immediately before publishing.
