# Partners Page — Design Spec

**Date**: 2026-04-24
**Status**: Approved, ready for plan
**Owner**: Cofit Healthcare International Site

## Problem

Cofit currently has no public-facing entry point for B2B partnerships, KOL/influencer collaborations, or general business inquiries. The international marketing site (targeting English-speaking Asian diaspora in SG/US) needs a single page that:

1. Communicates partnership value (1M+ users, 1.03M YouTube subscribers, established nutritionist network)
2. Lets prospects self-segment by inquiry type without confusion
3. Captures structured inquiry data and routes it to `hello@cofit.me`
4. Maintains the existing site's design polish (motion, type, palette)

## Goals

- Single page route `/partners` covering Business + Creator + Other inquiries
- Conditional form that adapts to inquiry type (Approach 1 — single-page progressive disclosure)
- Demo-mode backend (Resend test domain) shippable today, with clear engineering handoff for production hardening
- Three homepage entry points: nav link, modified existing partner CTA, footer link
- Sub-pages `/flex8` and `/consultation` also link to `/partners` from nav

## Non-Goals (v1)

- Authenticated CRM dashboard for inquiries (engineer task)
- Auto-reply emails to filer (v1.1)
- Multi-language form content (zh-TW deferred — international site is English-first)
- File upload (KOL media kit) — deferred
- Sub-routes per inquiry type (`/partners/business` etc.) — explicitly rejected

## Page Structure

```
Nav (Logo · 1-on-1 · Flex8 · Partners · CTA)
─────────────────────────────────────────────
HERO: "Partner with Cofit" + reach proof (CountUp 1M+, 100+, 1.03M)
─────────────────────────────────────────────
WHY PARTNER (3 cards): Reach · Science · Reputation
─────────────────────────────────────────────
PARTNERSHIP TYPES (6-card grid)
  Corporate Wellness · Insurance · Distribution
  White-label · Provider Referral · Creator
  → click pre-fills form Inquiry Type + Partnership Type, smooth-scrolls to form
─────────────────────────────────────────────
FORM (single card, Approach 1 conditional)
  §1 Inquiry Type (3 large radios)
  §2 Your Info (always shown)
  §3 Conditional details (Business / Creator / Other)
  Submit
─────────────────────────────────────────────
TESTIMONIAL / SOCIAL PROOF (single quote card)
─────────────────────────────────────────────
Footer (shared, with new Partners link)
```

## Form Schema

### Always shown
| Field | Type | Required | Notes |
|---|---|---|---|
| Inquiry Type | radio (Business / Creator / Other) | ✅ | Triggers conditional sections |
| Full Name | text | ✅ | |
| Work Email | email | ✅ | No domain restriction; helper text recommends work email |
| Country / Region | dropdown (SG, US, TW, MY, HK, Other) | ✅ | |
| Company / Brand / Channel name | text | ✅ | Label varies by inquiry type |
| Role / Title | text | ⬜ | |

### Business Partnership conditional
| Field | Type | Required | Notes |
|---|---|---|---|
| Partnership Type | dropdown | ✅ | Corporate Wellness / Insurance / Distribution / White-label / Provider Referral / Other |
| Company size | dropdown | ⬜ | <50 / 50-500 / 500-5K / 5K+ |
| Company website | url | ⬜ | |
| Tell us about your goals | textarea | ✅ | Min 50 chars |
| Timeline | dropdown | ⬜ | ASAP / 1-3mo / 3-6mo / Just exploring |

### Creator Collaboration conditional
| Field | Type | Required | Notes |
|---|---|---|---|
| Primary Platform | multi-checkbox | ✅ | IG / TikTok / YouTube / Threads / Other |
| Handle or Channel URL | text | ✅ | |
| Follower count | dropdown | ✅ | <10K / 10-50K / 50-100K / 100-500K / 500K-1M / 1M+ |
| Content Vertical | multi-checkbox | ✅ | Health & Wellness / Fitness / Food / Parenting / Lifestyle / Beauty / Other |
| Primary Audience Market | multi-checkbox | ✅ | TW / SG / MY / US / HK / Other |
| Past brand collaborations | textarea | ⬜ | "Share links if available" |
| Preferred collaboration type | multi-checkbox | ⬜ | Sponsored / Long-term ambassador / Affiliate / Co-branded / Other |
| Anything else | textarea | ⬜ | |

### Other conditional
| Field | Type | Required |
|---|---|---|
| Subject | text | ✅ |
| Message | textarea | ✅ |

### Hidden
- `honeypot` — bot trap
- `submittedAt` — server-set timestamp

## Backend

**Route**: `src/app/api/contact/route.js` (POST handler)

**Stack**:
- `resend` npm package
- `zod` for validation (shared between client + server)

**Flow**:
1. Reject if honeypot field is non-empty (return 200 to disguise rejection)
2. Validate body with Zod; return 400 with field errors on fail
3. Rate-limit: in-memory `Map<ip, lastSubmitTs>`, 30s window per IP
4. Compose HTML email with all fields rendered as label/value pairs
5. `Resend.emails.send({ from, to, replyTo: filerEmail, subject, html })`
6. Return 200 `{ success: true }`

**Subject line format**: `[Partners] {InquiryType} – {Company/Channel}`

**Reply-To**: filer's email (so internal team can reply with one click)

**Demo env vars** (Vercel):
```
RESEND_API_KEY=<from resend.com dashboard, free tier>
CONTACT_TO_EMAIL=hello@cofit.me
CONTACT_FROM_EMAIL=onboarding@resend.dev   # demo only
```

## Visual / Interaction

- **Design language**: matches existing pages (Inter, tight tracking, teal `#004F51`, green `#00C300`, warm bg `#FCFCFA`)
- **Hero**: framer-motion fade-up + CountUp on stats
- **Why-Partner cards**: stagger in on scroll, hover lifts + teal accent line
- **Partnership-Types grid**: Lucide icons (teal on mint bg), click → pre-fill + smooth-scroll to form
- **Inquiry Type**: 3 large pill buttons (not micro radio dots), teal selected state
- **Conditional sections**: framer-motion `AnimatePresence` height-auto + opacity fade (0.3s)
- **Multi-checkbox**: chip-style, teal-filled when selected (matches flex8 tag styling)
- **Submit states**: Idle / Loading (spinner) / Success (✓ → success card) / Error (shake + red text)
- **Success card** replaces form: green ✓ + "Thanks, {firstName}. We'll get back within 2 business days." + secondary link
- **Required asterisk**: teal (not red) to keep tone friendly
- **Error state**: red-600 border + Lucide `AlertCircle` + below text, `aria-describedby` linkage

## Homepage / Site Integration

1. **Nav** on `/`, `/flex8`, `/consultation`: add `Partners` link between existing programs and CTA
2. **Mobile hamburger** on all three: add Partners
3. **Existing homepage Partner CTA section**: keep design, change CTA button to `<Link href="/partners">Explore partnerships →`, update copy to "From corporate wellness to creator collaborations — let's talk."
4. **Footer** (shared): add Partners under Company column

## Anti-Spam (Demo)

- Honeypot field `<input name="website_url" hidden tabindex="-1">` — bots auto-fill, humans don't
- 30s rate limit per IP (in-memory Map)
- No CAPTCHA in v1 (engineer adds Turnstile / hCaptcha for production)

## Accessibility

- All inputs labeled via `htmlFor` or wrapping
- Error messages linked via `aria-describedby`
- Inquiry Type group: `role="radiogroup"`, arrow-key navigation
- Multi-checkbox groups in `<fieldset>` + `<legend>`
- Submit button `aria-busy` during submit
- Color contrast: text on warm bg ≥ AA; teal `#004F51` on white ≥ 7:1 (AAA)

## Engineer Handoff Checklist

A separate doc `docs/handoff/partners-page.md` lists 10 items needing production hardening:

| # | Item | Demo state | Prod requirement |
|---|---|---|---|
| 1 | From email | `onboarding@resend.dev` | Verify `cofit.me` in Resend (SPF + DKIM), use `noreply@send.cofit.me` |
| 2 | Resend API key | Free tier | Company paid plan |
| 3 | Rate limit | In-memory Map | Upstash Redis or equivalent |
| 4 | Spam protection | Honeypot only | + Cloudflare Turnstile or hCaptcha |
| 5 | Submission storage | Email only | Postgres / Notion / HubSpot CRM |
| 6 | Error monitoring | `console.error` | Sentry / Logtail |
| 7 | Auto-reply email | Disabled | Branded auto-reply with CTA |
| 8 | Email i18n | English | Detect country → zh-TW for TW/HK |
| 9 | File upload | Not supported | Vercel Blob + size limit for KOL media kits |
| 10 | Privacy / GDPR | Footer link | Explicit consent checkbox + retention policy |

Every demo-mode shortcut in source code is marked with `// TODO(engineer):` referencing this checklist.

## Out of Scope (this spec)

- Production infrastructure migration (separate engineer ticket per handoff item)
- CRM integration design (HubSpot / Salesforce / Notion choice)
- KOL onboarding flow after acceptance (separate spec)
- B2B sales pipeline / lead scoring (separate spec)

## Success Metrics

- Form submissions per week (target: 5+ in first month after launch)
- Spam ratio (target: <10% after honeypot)
- Bounce rate on `/partners` (target: <60%)
- Time-to-first-reply from internal team (target: 2 business days)

## Open Questions

None blocking. All resolved during brainstorm:
- ~~Form path: A vs B vs C → A (single page conditional)~~
- ~~Email gating → no domain restriction, helper text only~~
- ~~Min chars on goals textarea → 50~~
- ~~Past collab field → textarea (free links)~~
- ~~Domain verification now or handoff → handoff~~
- ~~Auto-reply v1 → no~~
- ~~Rate limit choice → in-memory 30s/IP~~
- ~~Homepage entry points → nav + existing CTA + footer; no extra microcopy~~
- ~~Pre-fill from type-card click → yes~~
