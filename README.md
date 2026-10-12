# KikRealty

Next.js App Router, React, TypeScript. Public website, KikRealty-managed listings, protected admin, showing/contact/valuation requests. No MLS/IDX integration.

## Local preview

Use the existing checkout; do not create a worktree.
Node 24, `npm ci`, then `npm run dev`. Copy `.env.example` to `.env.local` and provide a strong admin password and a random AUTH_SECRET of at least 32 bytes. Visit `/admin` to manage listings and read the inquiry inbox. Without DATABASE_URL, local preview records are retained in ignored `.data/records.json`. Do not use this local JSON store on serverless hosts. Preview crawling is disabled by default.

`npm run build` and `npm run typecheck` validate the application. `node scripts/smoke.mjs` validates a running preview on port 3000 (set TEST_ADMIN_PASSWORD to test protected flows). Tests create labeled fixtures in the local preview store; the fixtures are removed after validation.

## Listing approval

2183 Bent Oak Dr, Apopka, FL 32712 is an unpublished draft. The supplied Zillow URL is saved as its source. Network access to Zillow was blocked during initial preparation, so price, features, status, and photographs have not been verified. Do not invent those details or copy photographs without permission. Add owner-approved HTTPS photo URLs and verified details in admin. Publication requires verification, a source, description, photos, and configured brokerage identity. Admin supports adding/editing, featuring, publishing, pending, sold, and archiving. The public site never shows unverified or draft/archived records. Homepage architectural inspiration images are locally stored AI-generated illustrations, explicitly labeled as inspiration rather than actual listings. Replace them with licensed luxury photography if desired before launch. Fonts are self-hosted; their open font licenses are included in public/fonts.

## Vercel preparation — no deployment performed

1. The initial implementation is prepared on the kikrealty-preview review branch of Kikzeny/KikRealty-Website. After design approval, import the reviewed source into Vercel as a Next.js project. The CI workflow validates builds without deploying. No Vercel deployment is performed by setup.
2. Connect a Neon PostgreSQL database and configure DATABASE_URL, ADMIN_PASSWORD, and AUTH_SECRET in Vercel environment settings. The store initializes its table and draft seed on first use. Use separate preview and production databases and credentials. Avoid exposing a preview publicly until Vercel deployment protection is enabled.
3. Configure NEXT_PUBLIC_BROKERAGE_NAME, address, office phone, applicable Florida license information, and brokerage disclosures after broker review. The supplied California DRE disclosure is included in this preview but is not a verified Florida disclosure. Obtain brokerage approval, privacy/retention review, approved listing data and image rights before launch.
4. Build command: `npm run build`; install: `npm ci`; output: Next.js default. Inquiry submissions persist to the database and appear in admin. No email delivery provider is configured; do not promise email notifications. Set up alerts/notification delivery before relying on immediate lead response. MyARI is not connected.
5. Once Vercel account access and the preview database are configured, create a protected Vercel preview for review. Only after separate publication/DNS authorization should production be deployed and the GoDaddy domain connected using the records Vercel supplies. Do not guess DNS records or change existing mail records. Set NEXT_PUBLIC_APPROVED_LAUNCH=true only for the approved public launch.

## Extension boundaries

`lib/store.ts` provides the property and inquiry persistence boundary. Public UI consumes normalized Property records, independent of storage. Add a separate IDX provider adapter and map licensed feed data into the domain model; retain managed listings separately and follow feed display/attribution rules. Add a server-only MyARI adapter and an asynchronous outbox for inquiry delivery using provider documentation and scoped credentials. No assumed MyARI endpoints or credentials are embedded. Add durable distributed throttling/abuse controls and stronger identity controls (MFA/SSO) before scaling beyond the initial single-admin workflow. Current rate controls are process-local and do not provide distributed protection.

## Security and limitations

Admin cookie is HttpOnly, SameSite Strict, signed, expires after 8 hours, and Secure in production; writes verify request origin. Admin password and signing key are server-only variables. Admin must be configured before sign-in works. All publishing decisions remain the administrator’s responsibility. No legal compliance certification is implied by boilerplate disclosures. No external CRM, mail service, MLS, or IDX is active. User inquiry information must be handled according to the approved privacy policy.
