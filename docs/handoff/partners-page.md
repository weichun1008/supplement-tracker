# /partners Page — Engineer Handoff

**Status**: Demo-mode ship. Production hardening below required before public launch.

## What ships in demo mode

- `/partners` page with nav + hero + Why-Partner cards + 6-card Partnership Types grid + conditional inquiry form (Business / Creator / Other)
- `POST /api/contact` validates with Zod, applies honeypot + 30s/IP rate limit, sends via Resend
- Homepage hero CTA, nav link, and footer link all point to `/partners`
- Same nav addition on `/flex8` and `/consultation`
- Vitest unit tests covering the Zod schema and helper utilities

## What's NOT in demo (engineer must complete)

| # | Item | Demo state | Production requirement |
|---|---|---|---|
| 1 | From email | `onboarding@resend.dev` | In Resend dashboard: add `cofit.me` domain → add SPF + DKIM TXT records to DNS → set `CONTACT_FROM_EMAIL=Cofit Partners <noreply@send.cofit.me>` in Vercel env. |
| 2 | Resend API key | Free tier (100/day) | Company Resend account on a paid plan. Replace `RESEND_API_KEY` in Vercel env. |
| 3 | Rate limit | In-memory `Map` per serverless instance (see comment in `src/app/api/contact/route.js`) | Replace with Upstash Redis (or Vercel KV) — use a sliding-window or fixed-window key like `ratelimit:contact:{ip}`. |
| 4 | Spam protection | Honeypot field only | Add Cloudflare Turnstile (or hCaptcha): inject widget on the page, submit token in payload, verify token on the server before allowing the Resend call. |
| 5 | Submission storage | None (only email) | Decide: Postgres table, Notion DB, Airtable, or HubSpot CRM. Insert row alongside the Resend call; on insert failure, still send email but log to Sentry. |
| 6 | Error monitoring | `console.error` → Vercel logs | Hook up Sentry or Logtail. Wrap the Resend call + insert call. |
| 7 | Auto-reply email | Not sent | Send a second Resend email to the filer with a Cofit-branded thank-you. Include a short "what to expect" section. |
| 8 | Email i18n | English only | If `country` is TW or HK, send the internal email in zh-TW (or both languages). Auto-reply mirrors filer's locale. |
| 9 | File upload (KOL media kits) | Not supported | Add an optional file picker to the Creator section. Use Vercel Blob with a 10 MB / file 25 MB total limit. Attach blob URL to the email body. |
| 10 | Privacy / GDPR | Footer link only | Add a required consent checkbox above the submit button. Document retention policy in privacy page. EU residents: respect 30-day deletion requests. |

## Where the TODOs live in source

Run `grep -rn "TODO(engineer)" src/` to enumerate. Each comment references this doc by item number.

Files with TODOs:
- `src/app/api/contact/route.js` (items #1, #3)

## How to verify the demo locally

1. Sign up at https://resend.com (free tier is fine)
2. Copy API key from dashboard
3. `cp .env.local.example .env.local` and paste the key
4. `npm install && npm run dev`
5. Visit http://localhost:3000/partners and submit an "Other" inquiry
6. Check the inbox at `CONTACT_TO_EMAIL` (default `hello@cofit.me`)

## Tests

- `npm run test` runs Vitest on the schema + helpers (18 tests)
- Tests cover: schema variants (Business / Creator / Other), honeypot rejection, rate limit windowing, HTML formatter, HTML escaping
- Add tests when modifying `src/app/lib/contact-schema.js` or `src/app/lib/contact-helpers.js`

## Architecture notes

- Single-page progressive disclosure form (Approach 1 from spec) — Inquiry Type radio toggles conditional sections, AnimatePresence smooths the swap
- Pre-fill UX: clicking a Partnership Types card sets Inquiry Type + Partnership Type and smooth-scrolls to the form
- Field state is single object; multi-checkbox uses `toggleMulti` helper
- `Field` and `ChipCheckbox` are local components in the page file (intentional — they're page-specific UX not shared elsewhere)
- Submission uses native `fetch` to `/api/contact`; client maps server-side validation errors back into per-field error state
