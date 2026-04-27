# Partners Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/partners` page with a single conditional inquiry form (Business / Creator / Other) that emails submissions to hello@cofit.me via Resend, plus integrate the page into nav/footer/CTA across all three marketing pages.

**Architecture:** Single-page progressive disclosure form (Approach 1 from spec). Client-side React with framer-motion conditional rendering. Server-side Next.js Route Handler (`POST /api/contact`) validates with Zod, applies honeypot + in-memory rate limit, then sends email via Resend SDK. Demo-mode FROM address (`onboarding@resend.dev`) — production hardening handled by engineer per separate handoff doc.

**Tech Stack:** Next.js 16 App Router, React 19, framer-motion, Lucide icons, CSS Modules, Resend SDK, Zod, Vitest (new — for testing the schema + API helpers).

**Spec:** [docs/superpowers/specs/2026-04-24-partners-page-design.md](../specs/2026-04-24-partners-page-design.md)

---

## File Structure

**New files:**
- `src/app/partners/page.js` — page (client component)
- `src/app/partners/page.module.css` — styles
- `src/app/api/contact/route.js` — POST handler
- `src/app/lib/contact-schema.js` — Zod schema (shared client + server)
- `src/app/lib/contact-helpers.js` — honeypot, rate limit, email formatter (testable)
- `src/app/lib/__tests__/contact-schema.test.js` — Zod tests
- `src/app/lib/__tests__/contact-helpers.test.js` — helper tests
- `vitest.config.mjs` — test config
- `.env.local.example` — env var template
- `docs/handoff/partners-page.md` — production hardening checklist

**Modified files:**
- `src/app/page.js` — nav + mobile menu + hero CTA + footer (4 link swaps)
- `src/app/flex8/page.js` — nav + mobile menu (2 link swaps)
- `src/app/consultation/page.js` — nav + mobile menu (2 link swaps)
- `package.json` — add `resend`, `zod`, `vitest`
- `CLAUDE.md` — add `/partners` to active routes table

---

## Task 1: Setup — Install deps, env, test infra

**Files:**
- Modify: `package.json`
- Create: `vitest.config.mjs`
- Create: `.env.local.example`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Install runtime deps**

```bash
npm install resend zod
```

Expected: adds `resend` (^4.x) and `zod` (^3.x) to dependencies.

- [ ] **Step 2: Install test deps**

```bash
npm install -D vitest
```

Expected: adds `vitest` to devDependencies.

- [ ] **Step 3: Add test script to package.json**

In `package.json`, change `"scripts"` block to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Create vitest config**

Create `vitest.config.mjs`:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.js'],
  },
});
```

- [ ] **Step 5: Create env example file**

Create `.env.local.example`:

```
# Resend (https://resend.com)
# Demo: free tier key from resend.com dashboard. Sends from onboarding@resend.dev.
# Production: company Resend account + verified cofit.me domain.
RESEND_API_KEY=

# Where partner inquiries are delivered.
CONTACT_TO_EMAIL=hello@cofit.me

# Sender address. Demo uses Resend's test domain; engineer swaps for verified production domain.
CONTACT_FROM_EMAIL=onboarding@resend.dev
```

- [ ] **Step 6: Update CLAUDE.md routes table**

In `CLAUDE.md`, find the active routes table and add a row:

```markdown
| `/partners` | [src/app/partners/page.js](src/app/partners/page.js) | B2B + KOL inquiry form (Resend-backed) |
```

Insert below the `/consultation` row.

- [ ] **Step 7: Verify install**

```bash
npm run test -- --run
```

Expected: vitest exits cleanly with "No test files found" (we haven't written any yet).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.mjs .env.local.example CLAUDE.md
git commit -m "Setup: add resend, zod, vitest; document /partners route"
```

---

## Task 2: Zod schema (TDD)

**Files:**
- Create: `src/app/lib/contact-schema.js`
- Create: `src/app/lib/__tests__/contact-schema.test.js`

The schema is a discriminated union on `inquiryType`. Each variant has different required fields. Honeypot field `website_url` must be empty string.

- [ ] **Step 1: Write failing test for the base shared fields**

Create `src/app/lib/__tests__/contact-schema.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { contactSchema } from '../contact-schema.js';

describe('contactSchema — shared fields', () => {
  it('rejects missing fullName', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      email: 'a@b.com',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello there',
      website_url: '',
    });
    expect(r.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      fullName: 'Jane',
      email: 'not-an-email',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello there',
      website_url: '',
    });
    expect(r.success).toBe(false);
  });

  it('rejects unsupported country', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      fullName: 'Jane',
      email: 'a@b.com',
      country: 'XX',
      company: 'X',
      subject: 'hi',
      message: 'hello there',
      website_url: '',
    });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

```bash
npm run test -- --run src/app/lib/__tests__/contact-schema.test.js
```

Expected: FAIL with `Cannot find module '../contact-schema.js'`.

- [ ] **Step 3: Implement minimal base schema**

Create `src/app/lib/contact-schema.js`:

```js
import { z } from 'zod';

const COUNTRIES = ['SG', 'US', 'TW', 'MY', 'HK', 'OTHER'];

const baseFields = {
  fullName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  country: z.enum(COUNTRIES, { errorMap: () => ({ message: 'Pick a country' }) }),
  company: z.string().min(1, 'Required'),
  role: z.string().optional(),
  website_url: z.literal(''),  // honeypot — must be empty
};

export const contactSchema = z.discriminatedUnion('inquiryType', [
  z.object({
    inquiryType: z.literal('other'),
    subject: z.string().min(1, 'Required'),
    message: z.string().min(1, 'Required'),
    ...baseFields,
  }),
]);
```

- [ ] **Step 4: Run test, verify base passes**

```bash
npm run test -- --run src/app/lib/__tests__/contact-schema.test.js
```

Expected: 3 passing.

- [ ] **Step 5: Add Business variant tests**

Append to `contact-schema.test.js`:

```js
describe('contactSchema — business variant', () => {
  const valid = {
    inquiryType: 'business',
    fullName: 'Jane',
    email: 'jane@acme.com',
    country: 'US',
    company: 'Acme',
    partnershipType: 'corporate-wellness',
    goals: 'A'.repeat(60),
    website_url: '',
  };

  it('accepts valid business inquiry', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects goals shorter than 50 chars', () => {
    expect(contactSchema.safeParse({ ...valid, goals: 'too short' }).success).toBe(false);
  });

  it('rejects unknown partnershipType', () => {
    expect(contactSchema.safeParse({ ...valid, partnershipType: 'bogus' }).success).toBe(false);
  });
});
```

- [ ] **Step 6: Run, verify failures**

```bash
npm run test -- --run src/app/lib/__tests__/contact-schema.test.js
```

Expected: 3 new tests fail (business variant not in union yet).

- [ ] **Step 7: Add Business variant to schema**

In `contact-schema.js`, modify the discriminatedUnion to include:

```js
const PARTNERSHIP_TYPES = [
  'corporate-wellness',
  'insurance',
  'distribution',
  'white-label',
  'provider-referral',
  'other',
];

const COMPANY_SIZES = ['<50', '50-500', '500-5000', '5000+'];
const TIMELINES = ['asap', '1-3mo', '3-6mo', 'exploring'];

export const contactSchema = z.discriminatedUnion('inquiryType', [
  z.object({
    inquiryType: z.literal('business'),
    partnershipType: z.enum(PARTNERSHIP_TYPES),
    companySize: z.enum(COMPANY_SIZES).optional(),
    companyWebsite: z.string().url().optional().or(z.literal('')),
    goals: z.string().min(50, 'At least 50 characters'),
    timeline: z.enum(TIMELINES).optional(),
    ...baseFields,
  }),
  z.object({
    inquiryType: z.literal('other'),
    subject: z.string().min(1, 'Required'),
    message: z.string().min(1, 'Required'),
    ...baseFields,
  }),
]);

export { COUNTRIES, PARTNERSHIP_TYPES, COMPANY_SIZES, TIMELINES };
```

- [ ] **Step 8: Run, all 6 tests pass**

```bash
npm run test -- --run src/app/lib/__tests__/contact-schema.test.js
```

Expected: 6 passing.

- [ ] **Step 9: Add Creator variant tests**

Append:

```js
describe('contactSchema — creator variant', () => {
  const valid = {
    inquiryType: 'creator',
    fullName: 'Jane',
    email: 'jane@me.com',
    country: 'SG',
    company: '@janehealth',
    platforms: ['instagram'],
    handleUrl: 'https://instagram.com/janehealth',
    followerRange: '50-100K',
    verticals: ['health'],
    audienceMarkets: ['SG', 'MY'],
    website_url: '',
  };

  it('accepts valid creator inquiry', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty platforms array', () => {
    expect(contactSchema.safeParse({ ...valid, platforms: [] }).success).toBe(false);
  });

  it('rejects empty verticals array', () => {
    expect(contactSchema.safeParse({ ...valid, verticals: [] }).success).toBe(false);
  });

  it('rejects empty audienceMarkets array', () => {
    expect(contactSchema.safeParse({ ...valid, audienceMarkets: [] }).success).toBe(false);
  });
});
```

- [ ] **Step 10: Run, verify failures**

```bash
npm run test -- --run src/app/lib/__tests__/contact-schema.test.js
```

Expected: 4 new tests fail.

- [ ] **Step 11: Add Creator variant to schema**

In `contact-schema.js`, add to the union and export new const arrays:

```js
const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'threads', 'other'];
const FOLLOWER_RANGES = ['<10K', '10-50K', '50-100K', '100-500K', '500K-1M', '1M+'];
const VERTICALS = ['health', 'fitness', 'food', 'parenting', 'lifestyle', 'beauty', 'other'];
const AUDIENCE_MARKETS = ['TW', 'SG', 'MY', 'US', 'HK', 'OTHER'];
const COLLAB_TYPES = ['sponsored', 'ambassador', 'affiliate', 'co-branded', 'other'];

// Add to discriminatedUnion array:
z.object({
  inquiryType: z.literal('creator'),
  platforms: z.array(z.enum(PLATFORMS)).min(1, 'Pick at least one'),
  handleUrl: z.string().min(1, 'Required'),
  followerRange: z.enum(FOLLOWER_RANGES),
  verticals: z.array(z.enum(VERTICALS)).min(1, 'Pick at least one'),
  audienceMarkets: z.array(z.enum(AUDIENCE_MARKETS)).min(1, 'Pick at least one'),
  pastCollaborations: z.string().optional(),
  preferredCollabTypes: z.array(z.enum(COLLAB_TYPES)).optional(),
  notes: z.string().optional(),
  ...baseFields,
}),

// Update bottom export:
export { COUNTRIES, PARTNERSHIP_TYPES, COMPANY_SIZES, TIMELINES, PLATFORMS, FOLLOWER_RANGES, VERTICALS, AUDIENCE_MARKETS, COLLAB_TYPES };
```

- [ ] **Step 12: Run, all 10 tests pass**

```bash
npm run test -- --run src/app/lib/__tests__/contact-schema.test.js
```

Expected: 10 passing.

- [ ] **Step 13: Add honeypot test**

Append:

```js
describe('contactSchema — honeypot', () => {
  it('rejects when website_url has any value', () => {
    const r = contactSchema.safeParse({
      inquiryType: 'other',
      fullName: 'Jane',
      email: 'a@b.com',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello',
      website_url: 'http://spam.com',
    });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 14: Run, all 11 pass**

`z.literal('')` already enforces this — the test should pass without code changes.

```bash
npm run test -- --run src/app/lib/__tests__/contact-schema.test.js
```

Expected: 11 passing.

- [ ] **Step 15: Commit**

```bash
git add src/app/lib/contact-schema.js src/app/lib/__tests__/contact-schema.test.js
git commit -m "Add Zod schema for /api/contact (Business + Creator + Other variants)"
```

---

## Task 3: Helpers — rate limit + email formatter (TDD)

**Files:**
- Create: `src/app/lib/contact-helpers.js`
- Create: `src/app/lib/__tests__/contact-helpers.test.js`

Two pure helpers extracted from the route handler so they're testable without spinning up Next.js or Resend.

- [ ] **Step 1: Write failing test for rate limit**

Create `src/app/lib/__tests__/contact-helpers.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { createRateLimiter, formatInquiryHtml } from '../contact-helpers.js';

describe('createRateLimiter', () => {
  let now;
  let rate;

  beforeEach(() => {
    now = 1000;
    rate = createRateLimiter({ windowMs: 30_000, clock: () => now });
  });

  it('allows first request from an IP', () => {
    expect(rate.check('1.1.1.1')).toEqual({ allowed: true });
  });

  it('blocks second request within window', () => {
    rate.check('1.1.1.1');
    now += 5_000;
    const r = rate.check('1.1.1.1');
    expect(r.allowed).toBe(false);
    expect(r.retryAfterMs).toBe(25_000);
  });

  it('allows again after window', () => {
    rate.check('1.1.1.1');
    now += 31_000;
    expect(rate.check('1.1.1.1').allowed).toBe(true);
  });

  it('tracks IPs independently', () => {
    rate.check('1.1.1.1');
    expect(rate.check('2.2.2.2').allowed).toBe(true);
  });
});
```

- [ ] **Step 2: Run, verify failure**

```bash
npm run test -- --run src/app/lib/__tests__/contact-helpers.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement rate limiter**

Create `src/app/lib/contact-helpers.js`:

```js
export function createRateLimiter({ windowMs, clock = Date.now }) {
  const lastSeen = new Map();
  return {
    check(ip) {
      const now = clock();
      const prev = lastSeen.get(ip);
      if (prev !== undefined && now - prev < windowMs) {
        return { allowed: false, retryAfterMs: windowMs - (now - prev) };
      }
      lastSeen.set(ip, now);
      return { allowed: true };
    },
  };
}

export function formatInquiryHtml(/* ... */) {
  // implemented in next steps
}
```

- [ ] **Step 4: Run rate-limit tests, all 4 pass**

```bash
npm run test -- --run src/app/lib/__tests__/contact-helpers.test.js
```

Expected: 4 passing (formatter test not yet written).

- [ ] **Step 5: Write failing tests for email formatter**

Append:

```js
describe('formatInquiryHtml', () => {
  it('renders Business inquiry with all fields', () => {
    const html = formatInquiryHtml({
      inquiryType: 'business',
      fullName: 'Jane Doe',
      email: 'jane@acme.com',
      country: 'US',
      company: 'Acme Corp',
      role: 'VP People',
      partnershipType: 'corporate-wellness',
      companySize: '500-5000',
      companyWebsite: 'https://acme.com',
      goals: 'We want to roll out wellness benefits to 2,000 employees in Q3.',
      timeline: '1-3mo',
    });
    expect(html).toContain('Jane Doe');
    expect(html).toContain('jane@acme.com');
    expect(html).toContain('Corporate Wellness');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('1-3 months');
  });

  it('renders Creator inquiry with multi-value fields', () => {
    const html = formatInquiryHtml({
      inquiryType: 'creator',
      fullName: 'Jane',
      email: 'jane@me.com',
      country: 'SG',
      company: '@janehealth',
      platforms: ['instagram', 'tiktok'],
      handleUrl: 'https://instagram.com/janehealth',
      followerRange: '50-100K',
      verticals: ['health', 'fitness'],
      audienceMarkets: ['SG', 'MY'],
    });
    expect(html).toContain('Instagram, TikTok');
    expect(html).toContain('Health & Wellness, Fitness');
    expect(html).toContain('SG, MY');
  });

  it('escapes HTML in user input', () => {
    const html = formatInquiryHtml({
      inquiryType: 'other',
      fullName: '<script>alert(1)</script>',
      email: 'a@b.com',
      country: 'US',
      company: 'X',
      subject: 'hi',
      message: 'hello',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
```

- [ ] **Step 6: Run, verify formatter tests fail**

Expected: 3 fails.

- [ ] **Step 7: Implement formatter**

In `contact-helpers.js`, replace the placeholder `formatInquiryHtml` with:

```js
const LABELS = {
  // partnership types
  'corporate-wellness': 'Corporate Wellness',
  'insurance': 'Insurance Partnership',
  'distribution': 'Distribution / Reseller',
  'white-label': 'White-label / Licensing',
  'provider-referral': 'Healthcare Provider Referral',
  // platforms
  'instagram': 'Instagram',
  'tiktok': 'TikTok',
  'youtube': 'YouTube',
  'threads': 'Threads',
  // verticals
  'health': 'Health & Wellness',
  'fitness': 'Fitness',
  'food': 'Food',
  'parenting': 'Parenting',
  'lifestyle': 'Lifestyle',
  'beauty': 'Beauty',
  // collab
  'sponsored': 'Sponsored content',
  'ambassador': 'Long-term ambassador',
  'affiliate': 'Affiliate / revenue share',
  'co-branded': 'Co-branded product',
  // timeline
  'asap': 'ASAP',
  '1-3mo': '1-3 months',
  '3-6mo': '3-6 months',
  'exploring': 'Just exploring',
  'other': 'Other',
};

function label(key) {
  return LABELS[key] || key;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(k, v) {
  if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) return '';
  const display = Array.isArray(v) ? v.map(label).join(', ') : label(v);
  return `<tr><td style="padding:8px 16px;color:#666;font-weight:600;vertical-align:top">${escapeHtml(k)}</td><td style="padding:8px 16px;color:#111">${escapeHtml(display)}</td></tr>`;
}

export function formatInquiryHtml(d) {
  const rows = [];
  rows.push(row('Inquiry Type', d.inquiryType));
  rows.push(row('Name', d.fullName));
  rows.push(row('Email', d.email));
  rows.push(row('Country', d.country));
  rows.push(row(d.inquiryType === 'creator' ? 'Channel' : 'Company', d.company));
  rows.push(row('Role', d.role));

  if (d.inquiryType === 'business') {
    rows.push(row('Partnership Type', d.partnershipType));
    rows.push(row('Company Size', d.companySize));
    rows.push(row('Website', d.companyWebsite));
    rows.push(row('Goals', d.goals));
    rows.push(row('Timeline', d.timeline));
  } else if (d.inquiryType === 'creator') {
    rows.push(row('Platforms', d.platforms));
    rows.push(row('Handle / URL', d.handleUrl));
    rows.push(row('Followers', d.followerRange));
    rows.push(row('Verticals', d.verticals));
    rows.push(row('Audience Markets', d.audienceMarkets));
    rows.push(row('Past Collaborations', d.pastCollaborations));
    rows.push(row('Preferred Collab Types', d.preferredCollabTypes));
    rows.push(row('Notes', d.notes));
  } else {
    rows.push(row('Subject', d.subject));
    rows.push(row('Message', d.message));
  }

  return `<!doctype html>
<html><body style="font-family:system-ui,sans-serif;background:#FCFCFA;padding:24px">
<h2 style="color:#004F51;margin:0 0 16px">New ${escapeHtml(label(d.inquiryType) || 'inquiry')}</h2>
<table style="border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
${rows.join('')}
</table>
<p style="color:#888;margin-top:16px;font-size:12px">Reply directly to this email to respond to ${escapeHtml(d.fullName || 'the sender')}.</p>
</body></html>`;
}
```

- [ ] **Step 8: Run all helper tests**

```bash
npm run test -- --run src/app/lib/__tests__/contact-helpers.test.js
```

Expected: 7 passing.

- [ ] **Step 9: Commit**

```bash
git add src/app/lib/contact-helpers.js src/app/lib/__tests__/contact-helpers.test.js
git commit -m "Add testable contact helpers (rate limiter, HTML email formatter)"
```

---

## Task 4: API route — POST /api/contact

**Files:**
- Create: `src/app/api/contact/route.js`

This is the integration layer. It composes the schema + helpers + Resend SDK. We don't TDD it (mocking Resend network has low ROI at this stage); we smoke-test with curl.

- [ ] **Step 1: Create the route handler**

Create `src/app/api/contact/route.js`:

```js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/app/lib/contact-schema';
import { createRateLimiter, formatInquiryHtml } from '@/app/lib/contact-helpers';

// TODO(engineer): in-memory rate limit only works per serverless instance.
//   Production should use Upstash Redis or similar for cross-region consistency.
//   See docs/handoff/partners-page.md item #3.
const rate = createRateLimiter({ windowMs: 30_000 });

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot — if non-empty, return 200 to disguise rejection from bots.
  if (body?.website_url) {
    return NextResponse.json({ success: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const limited = rate.check(ip);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfterMs: limited.retryAfterMs },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[/api/contact] RESEND_API_KEY missing');
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const data = parsed.data;
  const subjectMap = {
    business: `[Partners] Business – ${data.company}`,
    creator: `[Partners] Creator – ${data.company}`,
    other: `[Partners] Other – ${data.subject || data.company}`,
  };

  // TODO(engineer): swap CONTACT_FROM_EMAIL to verified domain
  //   (e.g. "Cofit Partners <noreply@send.cofit.me>") after DNS setup.
  //   See docs/handoff/partners-page.md item #1.
  const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
  const to = process.env.CONTACT_TO_EMAIL || 'hello@cofit.me';

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: subjectMap[data.inquiryType],
      html: formatInquiryHtml(data),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/contact] Resend send failed:', err);
    return NextResponse.json({ error: 'Send failed' }, { status: 502 });
  }
}
```

- [ ] **Step 2: Smoke test — invalid body returns 400**

Start dev server: `npm run dev` (in another shell, or already running).

```bash
curl -i -X POST http://localhost:3000/api/contact -H "content-type: application/json" -d '{}'
```

Expected: HTTP 400, JSON `{ "error": "Validation failed", ... }`.

- [ ] **Step 3: Smoke test — honeypot returns 200**

```bash
curl -i -X POST http://localhost:3000/api/contact -H "content-type: application/json" \
  -d '{"website_url":"http://spam","inquiryType":"other"}'
```

Expected: HTTP 200, `{ "success": true }`.

- [ ] **Step 4: Smoke test — valid Other inquiry**

Set `RESEND_API_KEY` in `.env.local` first (sign up at resend.com if needed).

```bash
curl -i -X POST http://localhost:3000/api/contact -H "content-type: application/json" \
  -d '{"inquiryType":"other","fullName":"Test","email":"you@yourdomain.com","country":"US","company":"Smoke","subject":"Testing","message":"Plan smoke test","website_url":""}'
```

Expected: HTTP 200, and an email arrives at `hello@cofit.me`.

If Resend returns 403/401, double-check the API key. If it returns "Domain not verified" — that's expected when not using `onboarding@resend.dev`; check `CONTACT_FROM_EMAIL` env.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/contact/route.js
git commit -m "Add POST /api/contact route with Zod validation, rate limit, Resend"
```

---

## Task 5: Partners page — scaffold + Hero

**Files:**
- Create: `src/app/partners/page.js`
- Create: `src/app/partners/page.module.css`

This task ships a working `/partners` route showing only a Nav + Hero. Subsequent tasks add sections.

- [ ] **Step 1: Scaffold the page with nav + hero**

Create `src/app/partners/page.js`:

```js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import styles from './page.module.css';

export default function PartnersPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.page}>
      {/* ── Navbar (mirrors src/app/page.js structure) ── */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navLogo}>
          <span className={styles.navLogoGreen}>cofit</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/flex8" className={styles.navLink}>Flex8 Program</Link>
          <Link href="/consultation" className={styles.navLink}>1-on-1 Consultation</Link>
          <Link href="/partners" className={`${styles.navLink} ${styles.navLinkActive}`}>Partners</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/consultation" className={styles.navCta}>Get Started</Link>
        </div>
        <button
          className={styles.navHamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Menu"
        >
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen1 : ''}`} />
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen2 : ''}`} />
          <span className={`${styles.hamLine} ${menuOpen ? styles.hamLineOpen3 : ''}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/flex8" className={styles.mobileMenuLink}>Flex8 Program</Link>
          <Link href="/consultation" className={styles.mobileMenuLink}>1-on-1 Consultation</Link>
          <Link href="/partners" className={styles.mobileMenuLink}>Partners</Link>
          <Link href="/consultation" className={styles.mobileMenuCta}>Get Started</Link>
        </div>
      )}

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroInner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.heroEyebrow}>PARTNERSHIPS</div>
          <h1 className={styles.heroTitle}>Partner with Cofit</h1>
          <p className={styles.heroLead}>
            Reach over a million people building healthier habits across Asia and the US.
            From corporate wellness to creator collaborations — let's talk.
          </p>
          <div className={styles.heroProof}>
            <div><strong>1M+</strong> users</div>
            <div><strong>1.03M</strong> YT subscribers</div>
            <div><strong>100+</strong> partners</div>
          </div>
        </motion.div>
      </section>

      {/* TODO: WhyPartner, PartnershipTypes, Form, Testimonial sections — added in later tasks */}

      {/* ── Footer (placeholder; replaced in Task 9 sweep) ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}><span className={styles.navLogoGreen}>cofit</span></span>
          <span className={styles.footerCopy}>© Cofit Healthcare</span>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Create stylesheet**

Create `src/app/partners/page.module.css`:

```css
:root {
  --green: #00C300;
  --teal: #004F51;
  --bg: #FCFCFA;
  --ink: #111;
  --mute: #666;
  --line: rgba(0,0,0,0.08);
}

.page { background: var(--bg); color: var(--ink); min-height: 100vh; }

/* ── Navbar (visual matches src/app/page.js) ── */
.navbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 48px; max-width: 1280px; margin: 0 auto;
  position: sticky; top: 0; background: rgba(252,252,250,0.92); backdrop-filter: blur(8px);
  z-index: 50; border-bottom: 1px solid var(--line);
}
.navLogo { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; text-decoration: none; color: var(--ink); }
.navLogoGreen { color: var(--green); }
.navLinks { display: flex; gap: 28px; }
.navLink {
  font-size: 14px; color: var(--ink); text-decoration: none; opacity: 0.75;
  transition: opacity 0.2s;
}
.navLink:hover { opacity: 1; }
.navLinkActive { opacity: 1; font-weight: 600; }
.navActions { display: flex; align-items: center; gap: 12px; }
.navCta {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; background: var(--teal); color: #fff;
  border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}
.navCta:hover { transform: translateY(-1px); background: #003e40; }

.navHamburger {
  display: none; width: 32px; height: 32px; background: none; border: 0; cursor: pointer;
  flex-direction: column; justify-content: center; align-items: center; gap: 4px;
}
.hamLine { width: 20px; height: 2px; background: var(--ink); transition: transform 0.2s, opacity 0.2s; }
.hamLineOpen1 { transform: translateY(6px) rotate(45deg); }
.hamLineOpen2 { opacity: 0; }
.hamLineOpen3 { transform: translateY(-6px) rotate(-45deg); }

.mobileMenu {
  display: none; flex-direction: column; gap: 12px;
  padding: 16px 24px 24px; border-bottom: 1px solid var(--line); background: var(--bg);
}
.mobileMenuLink { font-size: 16px; color: var(--ink); text-decoration: none; padding: 8px 0; }
.mobileMenuCta {
  margin-top: 8px; padding: 12px 18px; background: var(--teal); color: #fff;
  border-radius: 999px; text-align: center; text-decoration: none; font-weight: 600;
}

@media (max-width: 768px) {
  .navbar { padding: 14px 20px; }
  .navLinks, .navActions { display: none; }
  .navHamburger { display: flex; }
  .mobileMenu { display: flex; }
}

/* ── Hero ── */
.hero {
  padding: 80px 24px 60px;
  background:
    radial-gradient(1200px 400px at 80% 0%, rgba(0,79,81,0.07), transparent 60%),
    var(--bg);
}
.heroInner { max-width: 880px; margin: 0 auto; text-align: center; }
.heroEyebrow {
  display: inline-block; padding: 6px 14px; background: rgba(0,79,81,0.08); color: var(--teal);
  border-radius: 999px; font-size: 12px; letter-spacing: 0.12em; font-weight: 600; margin-bottom: 24px;
}
.heroTitle {
  font-size: clamp(40px, 6vw, 72px); font-weight: 800; letter-spacing: -0.03em;
  line-height: 1.05; margin: 0 0 24px;
}
.heroLead {
  font-size: 18px; color: var(--mute); line-height: 1.6; max-width: 620px; margin: 0 auto 36px;
}
.heroProof {
  display: flex; justify-content: center; gap: 48px; flex-wrap: wrap;
  font-size: 14px; color: var(--mute);
}
.heroProof strong { display: block; font-size: 28px; color: var(--ink); font-weight: 800; letter-spacing: -0.01em; }

/* ── Footer placeholder (replaced in Task 9) ── */
.footer { border-top: 1px solid var(--line); padding: 32px 48px; margin-top: 80px; }
.footerInner { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; }
.footerLogo { font-size: 18px; font-weight: 800; }
.footerCopy { color: var(--mute); font-size: 14px; }
```

- [ ] **Step 3: Verify in browser preview**

Visit `http://localhost:3000/partners`.

Expected:
- Nav with Cofit logo + Flex8/Consultation/Partners (Partners highlighted as active) + Get Started button
- Hero: PARTNERSHIPS eyebrow, large "Partner with Cofit" heading, lead paragraph, 3 stats row (1M+ / 1.03M / 100+)
- Mobile (resize browser to 375px): hamburger appears, links collapse

- [ ] **Step 4: Commit**

```bash
git add src/app/partners/
git commit -m "Add /partners page with nav + hero scaffold"
```

---

## Task 6: Why-Partner cards + Partnership Types grid

**Files:**
- Modify: `src/app/partners/page.js`
- Modify: `src/app/partners/page.module.css`

The grid pre-fills the form Inquiry Type and (for Business cards) the Partnership Type when clicked. State lifts up to the page component.

- [ ] **Step 1: Add Lucide imports + state to page.js**

In `src/app/partners/page.js`, replace the imports block:

```js
import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, FlaskConical, Award, Building2, ShieldCheck, Truck, Layers, Stethoscope, Sparkles } from 'lucide-react';
import { Instagram, Facebook, Youtube } from '../components/BrandIcons';
import styles from './page.module.css';
```

Inside the component, add state and a ref above the existing menuOpen state:

```js
const [inquiryType, setInquiryType] = useState('business');
const [partnershipType, setPartnershipType] = useState('');
const formRef = useRef(null);

function selectAndScroll(type, ptype = '') {
  setInquiryType(type);
  setPartnershipType(ptype);
  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

- [ ] **Step 2: Add Why-Partner section after the Hero**

Below the closing `</section>` of Hero, before the TODO comment, insert:

```jsx
{/* ── Why Partner ── */}
<section className={styles.whySection}>
  <div className={styles.sectionInner}>
    <h2 className={styles.sectionTitle}>Why Cofit</h2>
    <div className={styles.whyGrid}>
      {[
        { Icon: Users, title: 'Real Reach', desc: '1M+ app users and 1.03M YouTube subscribers across TW, SG, MY, and US — primarily Asian-diaspora audiences.' },
        { Icon: FlaskConical, title: 'Science-Led', desc: 'Every program is built and delivered by certified clinical nutritionists. Evidence-based, never fad-driven.' },
        { Icon: Award, title: 'Trusted Brand', desc: '9 years operating with major media coverage, hospital partnerships, and a 4.8★ user rating.' },
      ].map((c, i) => (
        <motion.div
          key={i}
          className={styles.whyCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.whyIcon}><c.Icon size={22} strokeWidth={1.75} /></div>
          <h3 className={styles.whyTitle}>{c.title}</h3>
          <p className={styles.whyDesc}>{c.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add Partnership Types grid after Why-Partner**

Insert below the Why section's closing tag:

```jsx
{/* ── Partnership Types ── */}
<section className={styles.typesSection}>
  <div className={styles.sectionInner}>
    <div className={styles.sectionEyebrow}>WAYS TO WORK TOGETHER</div>
    <h2 className={styles.sectionTitle}>Pick what fits your business</h2>
    <p className={styles.sectionLead}>Click any card to jump straight to the form with the right inquiry type pre-selected.</p>
    <div className={styles.typesGrid}>
      {[
        { Icon: Building2, title: 'Corporate Wellness', desc: 'Group-class nutrition for employee benefits programs.', kind: 'business', sub: 'corporate-wellness' },
        { Icon: ShieldCheck, title: 'Insurance Partnership', desc: 'Add-on coverage, claims-driven preventive care.', kind: 'business', sub: 'insurance' },
        { Icon: Truck, title: 'Distribution / Reseller', desc: 'Local market partners across Asia and North America.', kind: 'business', sub: 'distribution' },
        { Icon: Layers, title: 'White-label / Licensing', desc: 'Power your hospital, clinic, or app with Cofit.', kind: 'business', sub: 'white-label' },
        { Icon: Stethoscope, title: 'Provider Referral', desc: 'Doctors, gyms, and pharmacies referring clients to us.', kind: 'business', sub: 'provider-referral' },
        { Icon: Sparkles, title: 'Creator Collaboration', desc: 'KOL partnerships, sponsored content, ambassador programs.', kind: 'creator', sub: '' },
      ].map((t, i) => (
        <motion.button
          key={i}
          type="button"
          onClick={() => selectAndScroll(t.kind, t.sub)}
          className={styles.typeCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
        >
          <div className={styles.typeIcon}><t.Icon size={20} strokeWidth={1.75} /></div>
          <h3 className={styles.typeTitle}>{t.title}</h3>
          <p className={styles.typeDesc}>{t.desc}</p>
        </motion.button>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Add CSS for new sections**

Append to `src/app/partners/page.module.css`:

```css
/* ── Section shared ── */
.sectionInner { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.sectionEyebrow {
  display: inline-block; padding: 4px 12px; background: rgba(0,79,81,0.08); color: var(--teal);
  border-radius: 999px; font-size: 11px; letter-spacing: 0.14em; font-weight: 700; margin-bottom: 16px;
}
.sectionTitle { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; }
.sectionLead { font-size: 16px; color: var(--mute); max-width: 640px; margin: 0 0 40px; line-height: 1.6; }

/* ── Why ── */
.whySection { padding: 80px 0; }
.whyGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.whyCard {
  background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 28px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.whyCard:hover {
  transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  border-color: rgba(0,79,81,0.2);
}
.whyIcon {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(0,79,81,0.08); color: var(--teal);
  display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
}
.whyTitle { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
.whyDesc { font-size: 14px; color: var(--mute); line-height: 1.6; margin: 0; }

/* ── Types ── */
.typesSection { padding: 60px 0 100px; background: #fff; }
.typesGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.typeCard {
  background: var(--bg); border: 1px solid var(--line); border-radius: 14px; padding: 24px;
  text-align: left; cursor: pointer; font: inherit; color: inherit;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.typeCard:hover {
  transform: translateY(-3px); border-color: var(--teal);
  box-shadow: 0 8px 20px rgba(0,79,81,0.08);
}
.typeIcon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(0,195,0,0.1); color: var(--teal);
  display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
}
.typeTitle { font-size: 16px; font-weight: 700; margin: 0 0 6px; }
.typeDesc { font-size: 13px; color: var(--mute); line-height: 1.55; margin: 0; }

@media (max-width: 900px) {
  .whyGrid, .typesGrid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .whyGrid, .typesGrid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Verify in browser**

Reload `/partners`. Expected:
- Below hero, 3 white "Why Cofit" cards (Real Reach / Science-Led / Trusted Brand) on white-bg section
- Below that, light-bg section with 6 partnership-type cards in a 3-col grid
- Hover: cards lift, teal border on type cards
- Click any type card: page smooth-scrolls down (currently to placeholder — formRef target added in Task 7)

Mobile: 1-col stack.

- [ ] **Step 6: Commit**

```bash
git add src/app/partners/
git commit -m "Add Why-Partner cards and Partnership Types grid to /partners"
```

---

## Task 7: Form — base structure + always-shown fields

**Files:**
- Modify: `src/app/partners/page.js`
- Modify: `src/app/partners/page.module.css`

This task adds the form section with Inquiry Type pill buttons + the always-shown fields. Conditional sections are stubs filled in Task 8.

- [ ] **Step 1: Add form imports**

At the top of `page.js`, extend the imports:

```js
import { Users, FlaskConical, Award, Building2, ShieldCheck, Truck, Layers, Stethoscope, Sparkles, AlertCircle, Loader2, Check } from 'lucide-react';
```

- [ ] **Step 2: Add form state below existing useState**

```js
const [formData, setFormData] = useState({
  fullName: '', email: '', country: '', company: '', role: '',
  // business
  companySize: '', companyWebsite: '', goals: '', timeline: '',
  // creator
  platforms: [], handleUrl: '', followerRange: '', verticals: [], audienceMarkets: [],
  pastCollaborations: '', preferredCollabTypes: [], notes: '',
  // other
  subject: '', message: '',
});
const [errors, setErrors] = useState({});
const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
const [submitError, setSubmitError] = useState('');

function setField(name, value) {
  setFormData((d) => ({ ...d, [name]: value }));
  setErrors((e) => ({ ...e, [name]: undefined }));
}

function toggleMulti(name, value) {
  setFormData((d) => {
    const cur = d[name] || [];
    const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    return { ...d, [name]: next };
  });
}
```

- [ ] **Step 3: Add Form section JSX (always-shown fields only for now)**

Replace the `{/* TODO: WhyPartner... */}` comment with:

```jsx
{/* ── Form ── */}
<section ref={formRef} className={styles.formSection}>
  <div className={styles.formInner}>
    <div className={styles.sectionEyebrow} style={{ textAlign: 'center', display: 'block' }}>GET IN TOUCH</div>
    <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Tell us about your project</h2>

    {submitState === 'success' ? (
      <SuccessCard firstName={formData.fullName.split(' ')[0]} />
    ) : (
      <form
        className={styles.form}
        onSubmit={(e) => { e.preventDefault(); /* handler added in Task 9 */ }}
        noValidate
      >
        {/* honeypot — bots will fill this; humans won't see it */}
        <input
          type="text" tabIndex={-1} autoComplete="off"
          name="website_url" value={formData.website_url || ''}
          onChange={(e) => setField('website_url', e.target.value)}
          className={styles.honeypot} aria-hidden="true"
        />

        {/* Inquiry Type pills */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>What brings you here?<span className={styles.req}>*</span></legend>
          <div role="radiogroup" aria-label="Inquiry type" className={styles.pillGroup}>
            {[
              { v: 'business', label: 'Business Partnership' },
              { v: 'creator', label: 'Creator Collaboration' },
              { v: 'other', label: 'Other' },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                role="radio"
                aria-checked={inquiryType === opt.v}
                onClick={() => setInquiryType(opt.v)}
                className={`${styles.pill} ${inquiryType === opt.v ? styles.pillActive : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Always-shown */}
        <div className={styles.formGrid}>
          <Field
            label="Full Name" name="fullName" required
            value={formData.fullName} onChange={setField} error={errors.fullName}
          />
          <Field
            label="Work Email" name="email" type="email" required
            value={formData.email} onChange={setField} error={errors.email}
            help="A work email helps us route faster, but personal email works too."
          />
          <Field
            label="Country / Region" name="country" type="select" required
            options={[
              { v: '', label: 'Select…' }, { v: 'SG', label: 'Singapore' },
              { v: 'US', label: 'United States' }, { v: 'TW', label: 'Taiwan' },
              { v: 'MY', label: 'Malaysia' }, { v: 'HK', label: 'Hong Kong' }, { v: 'OTHER', label: 'Other' },
            ]}
            value={formData.country} onChange={setField} error={errors.country}
          />
          <Field
            label={inquiryType === 'creator' ? 'Brand / Channel name' : 'Company / Brand'} name="company" required
            value={formData.company} onChange={setField} error={errors.company}
          />
          <Field
            label="Role / Title" name="role"
            value={formData.role} onChange={setField}
          />
        </div>

        {/* TODO Task 8: conditional sections (business / creator / other) here */}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitState === 'submitting'}
          aria-busy={submitState === 'submitting'}
        >
          {submitState === 'submitting' ? (
            <><Loader2 size={18} className={styles.spinIcon} /> Sending…</>
          ) : (
            <>Send inquiry →</>
          )}
        </button>
        {submitState === 'error' && (
          <p className={styles.submitError}><AlertCircle size={16} /> {submitError || 'Something went wrong. Please email hello@cofit.me directly.'}</p>
        )}
      </form>
    )}
  </div>
</section>
```

- [ ] **Step 4: Add Field + SuccessCard helper components**

At the **bottom** of `page.js`, after the default export's closing brace, add:

```js
function Field({ label, name, type = 'text', required, value, onChange, error, help, options }) {
  const id = `f-${name}`;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}{required && <span className={styles.req}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id} name={name} value={value} onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : help ? `${id}-help` : undefined}
          rows={4} className={styles.fieldInput}
        />
      ) : type === 'select' ? (
        <select
          id={id} name={name} value={value} onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error} className={styles.fieldInput}
        >
          {options?.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
      ) : (
        <input
          id={id} type={type} name={name} value={value}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error} aria-describedby={error ? `${id}-err` : help ? `${id}-help` : undefined}
          className={styles.fieldInput}
        />
      )}
      {help && !error && <small id={`${id}-help`} className={styles.fieldHelp}>{help}</small>}
      {error && <small id={`${id}-err`} className={styles.fieldError}><AlertCircle size={12} /> {error}</small>}
    </div>
  );
}

function SuccessCard({ firstName }) {
  return (
    <motion.div
      className={styles.successCard}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.successCheck}><Check size={28} strokeWidth={2.5} /></div>
      <h3 className={styles.successTitle}>Thanks{firstName ? `, ${firstName}` : ''}!</h3>
      <p className={styles.successDesc}>We received your inquiry and will get back within 2 business days.</p>
      <Link href="/" className={styles.successLink}>Browse our programs →</Link>
    </motion.div>
  );
}
```

- [ ] **Step 5: Append form CSS**

Append to `page.module.css`:

```css
/* ── Form ── */
.formSection { padding: 80px 0; }
.formInner { max-width: 720px; margin: 0 auto; padding: 0 24px; }
.form {
  background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 40px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.honeypot { position: absolute; left: -9999px; opacity: 0; pointer-events: none; }

.fieldset { border: 0; margin: 0 0 28px; padding: 0; }
.legend { font-size: 14px; font-weight: 700; margin-bottom: 12px; padding: 0; }
.req { color: var(--teal); margin-left: 2px; }

.pillGroup { display: flex; gap: 8px; flex-wrap: wrap; }
.pill {
  flex: 1 1 auto; padding: 14px 16px; border: 1.5px solid var(--line); background: var(--bg);
  border-radius: 12px; font: inherit; font-weight: 600; font-size: 14px; color: var(--ink);
  cursor: pointer; transition: all 0.2s;
}
.pill:hover { border-color: var(--teal); }
.pillActive {
  border-color: var(--teal); background: rgba(0,79,81,0.06); color: var(--teal);
}

.formGrid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px 14px; margin-bottom: 24px;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field:has(textarea), .field.fullWidth { grid-column: 1 / -1; }
.fieldLabel { font-size: 13px; font-weight: 600; color: var(--ink); }
.fieldInput {
  padding: 12px 14px; border: 1.5px solid var(--line); border-radius: 10px;
  background: #fff; font: inherit; font-size: 14px; color: var(--ink);
  transition: border-color 0.15s, transform 0.15s;
}
.fieldInput:focus {
  outline: none; border-color: var(--teal); transform: translateY(-1px);
}
.fieldHelp { font-size: 12px; color: var(--mute); }
.fieldError { font-size: 12px; color: #DC2626; display: inline-flex; align-items: center; gap: 4px; }

.submitBtn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 16px 24px; background: var(--teal); color: #fff; border: 0;
  border-radius: 12px; font: inherit; font-weight: 700; font-size: 15px; cursor: pointer;
  margin-top: 8px; transition: transform 0.15s, background 0.15s;
}
.submitBtn:hover:not(:disabled) { background: #003e40; transform: translateY(-1px); }
.submitBtn:disabled { opacity: 0.7; cursor: not-allowed; }
.spinIcon { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.submitError { display: inline-flex; gap: 6px; align-items: center; color: #DC2626; font-size: 13px; margin: 12px 0 0; }

.successCard {
  background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 56px 40px;
  text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.successCheck {
  width: 64px; height: 64px; margin: 0 auto 20px; border-radius: 50%;
  background: var(--green); color: #fff; display: flex; align-items: center; justify-content: center;
}
.successTitle { font-size: 28px; font-weight: 800; margin: 0 0 8px; letter-spacing: -0.02em; }
.successDesc { color: var(--mute); margin: 0 0 24px; }
.successLink { color: var(--teal); font-weight: 600; text-decoration: none; }
.successLink:hover { text-decoration: underline; }

@media (max-width: 600px) {
  .form { padding: 24px; }
  .formGrid { grid-template-columns: 1fr; }
  .pillGroup { flex-direction: column; }
}
```

- [ ] **Step 6: Verify in browser**

Reload `/partners`, scroll to the Form section. Expected:
- "GET IN TOUCH" eyebrow + "Tell us about your project" centered
- Three pill buttons (Business / Creator / Other), Business pre-selected (teal bg)
- 5 input fields visible: Full Name, Work Email, Country dropdown, Company/Brand, Role
- "Send inquiry →" submit button (disabled state when clicked since handler is no-op)
- Click any partnership-type card from grid above → page scrolls smoothly down to form

- [ ] **Step 7: Commit**

```bash
git add src/app/partners/
git commit -m "Add inquiry form scaffold (pill selector + always-shown fields)"
```

---

## Task 8: Form — conditional sections (Business / Creator / Other)

**Files:**
- Modify: `src/app/partners/page.js`
- Modify: `src/app/partners/page.module.css`

Add the three conditional blocks. Use `AnimatePresence` for smooth swap.

- [ ] **Step 1: Import AnimatePresence**

Update framer-motion import in `page.js`:

```js
import { motion, AnimatePresence } from 'framer-motion';
```

- [ ] **Step 2: Add a chip-checkbox helper component**

At the bottom of `page.js`, add:

```js
function ChipCheckbox({ name, options, value, onToggle, label, required }) {
  return (
    <fieldset className={styles.fieldset} style={{ marginBottom: 20 }}>
      <legend className={styles.legend}>{label}{required && <span className={styles.req}>*</span>}</legend>
      <div className={styles.chipGroup}>
        {options.map((opt) => {
          const active = (value || []).includes(opt.v);
          return (
            <button
              key={opt.v}
              type="button"
              onClick={() => onToggle(name, opt.v)}
              aria-pressed={active}
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 3: Insert conditional blocks where the TODO comment is**

Replace `{/* TODO Task 8: conditional sections (business / creator / other) here */}` with:

```jsx
<AnimatePresence mode="wait" initial={false}>
  {inquiryType === 'business' && (
    <motion.div
      key="business"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden' }}
    >
      <div className={styles.formGrid}>
        <Field
          label="Partnership Type" name="partnershipType" type="select" required
          options={[
            { v: '', label: 'Select…' },
            { v: 'corporate-wellness', label: 'Corporate Wellness' },
            { v: 'insurance', label: 'Insurance Partnership' },
            { v: 'distribution', label: 'Distribution / Reseller' },
            { v: 'white-label', label: 'White-label / Licensing' },
            { v: 'provider-referral', label: 'Healthcare Provider Referral' },
            { v: 'other', label: 'Other' },
          ]}
          value={partnershipType}
          onChange={(_, v) => setPartnershipType(v)}
          error={errors.partnershipType}
        />
        <Field
          label="Company size" name="companySize" type="select"
          options={[
            { v: '', label: 'Select…' }, { v: '<50', label: '<50' },
            { v: '50-500', label: '50–500' }, { v: '500-5000', label: '500–5,000' }, { v: '5000+', label: '5,000+' },
          ]}
          value={formData.companySize} onChange={setField}
        />
        <Field
          label="Company website" name="companyWebsite" type="url"
          value={formData.companyWebsite} onChange={setField}
        />
        <Field
          label="Timeline" name="timeline" type="select"
          options={[
            { v: '', label: 'Select…' }, { v: 'asap', label: 'ASAP' },
            { v: '1-3mo', label: '1–3 months' }, { v: '3-6mo', label: '3–6 months' }, { v: 'exploring', label: 'Just exploring' },
          ]}
          value={formData.timeline} onChange={setField}
        />
      </div>
      <Field
        label="Tell us about your goals" name="goals" type="textarea" required
        value={formData.goals} onChange={setField} error={errors.goals}
        help="What outcome are you hoping for? Any timeline, scope, or budget constraints? (50+ chars)"
      />
    </motion.div>
  )}

  {inquiryType === 'creator' && (
    <motion.div
      key="creator"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden' }}
    >
      <ChipCheckbox
        name="platforms" required label="Primary Platforms"
        value={formData.platforms} onToggle={toggleMulti}
        options={[
          { v: 'instagram', label: 'Instagram' }, { v: 'tiktok', label: 'TikTok' },
          { v: 'youtube', label: 'YouTube' }, { v: 'threads', label: 'Threads' }, { v: 'other', label: 'Other' },
        ]}
      />
      <div className={styles.formGrid}>
        <Field
          label="Handle or Channel URL" name="handleUrl" required
          value={formData.handleUrl} onChange={setField}
          help="@username or full link"
        />
        <Field
          label="Follower count" name="followerRange" type="select" required
          options={[
            { v: '', label: 'Select…' }, { v: '<10K', label: 'Under 10K' },
            { v: '10-50K', label: '10K–50K' }, { v: '50-100K', label: '50K–100K' },
            { v: '100-500K', label: '100K–500K' }, { v: '500K-1M', label: '500K–1M' }, { v: '1M+', label: '1M+' },
          ]}
          value={formData.followerRange} onChange={setField}
        />
      </div>
      <ChipCheckbox
        name="verticals" required label="Content Vertical"
        value={formData.verticals} onToggle={toggleMulti}
        options={[
          { v: 'health', label: 'Health & Wellness' }, { v: 'fitness', label: 'Fitness' },
          { v: 'food', label: 'Food / Cooking' }, { v: 'parenting', label: 'Parenting' },
          { v: 'lifestyle', label: 'Lifestyle' }, { v: 'beauty', label: 'Beauty' }, { v: 'other', label: 'Other' },
        ]}
      />
      <ChipCheckbox
        name="audienceMarkets" required label="Primary Audience Market"
        value={formData.audienceMarkets} onToggle={toggleMulti}
        options={[
          { v: 'TW', label: 'Taiwan' }, { v: 'SG', label: 'Singapore' },
          { v: 'MY', label: 'Malaysia' }, { v: 'US', label: 'United States' },
          { v: 'HK', label: 'Hong Kong' }, { v: 'OTHER', label: 'Other' },
        ]}
      />
      <Field
        label="Past brand collaborations" name="pastCollaborations" type="textarea"
        value={formData.pastCollaborations} onChange={setField}
        help="Share links to past brand work if available."
      />
      <ChipCheckbox
        name="preferredCollabTypes" label="Preferred Collaboration Type"
        value={formData.preferredCollabTypes} onToggle={toggleMulti}
        options={[
          { v: 'sponsored', label: 'Sponsored content' }, { v: 'ambassador', label: 'Long-term ambassador' },
          { v: 'affiliate', label: 'Affiliate / revenue share' }, { v: 'co-branded', label: 'Co-branded product' }, { v: 'other', label: 'Other' },
        ]}
      />
      <Field
        label="Anything else" name="notes" type="textarea"
        value={formData.notes} onChange={setField}
      />
    </motion.div>
  )}

  {inquiryType === 'other' && (
    <motion.div
      key="other"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden' }}
    >
      <Field
        label="Subject" name="subject" required
        value={formData.subject} onChange={setField} error={errors.subject}
      />
      <Field
        label="Message" name="message" type="textarea" required
        value={formData.message} onChange={setField} error={errors.message}
      />
    </motion.div>
  )}
</AnimatePresence>
```

- [ ] **Step 4: Append chip CSS**

Append to `page.module.css`:

```css
.chipGroup { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  padding: 8px 14px; border: 1.5px solid var(--line); background: #fff; border-radius: 999px;
  font: inherit; font-size: 13px; color: var(--ink); cursor: pointer; transition: all 0.2s;
}
.chip:hover { border-color: var(--teal); }
.chipActive {
  border-color: var(--teal); background: var(--teal); color: #fff;
}
```

- [ ] **Step 5: Verify in browser**

Reload `/partners`, scroll to form. Click each pill in turn:
- **Business** (default): shows Partnership Type + Company size + Website + Timeline + Goals textarea
- **Creator**: shows Platforms (chips), Handle URL, Follower count, Verticals (chips), Audience Markets (chips), Past collaborations, Preferred collab types (chips), Notes
- **Other**: shows Subject + Message

Switching pills: smooth height + opacity transition (~300ms).

Click partnership-type cards above the form: scrolls to form, switches to right pill, dropdown pre-selects partnership type.

- [ ] **Step 6: Commit**

```bash
git add src/app/partners/
git commit -m "Add conditional form sections (Business + Creator + Other) with AnimatePresence"
```

---

## Task 9: Form submission — wire up POST + states

**Files:**
- Modify: `src/app/partners/page.js`

- [ ] **Step 1: Add submit handler above the return statement**

Inside the `PartnersPage` component, above the `return`:

```js
async function handleSubmit(e) {
  e.preventDefault();
  setErrors({});
  setSubmitError('');

  const payload = buildPayload(inquiryType, partnershipType, formData);

  setSubmitState('submitting');
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setSubmitState('success');
      return;
    }
    const data = await res.json().catch(() => ({}));
    if (res.status === 400 && data.issues) {
      const flat = {};
      for (const [k, v] of Object.entries(data.issues)) flat[k] = Array.isArray(v) ? v[0] : v;
      setErrors(flat);
      setSubmitError('Please correct the highlighted fields.');
    } else if (res.status === 429) {
      setSubmitError('You just submitted — please wait 30 seconds before retrying.');
    } else {
      setSubmitError(data.error || 'Submission failed. Please email hello@cofit.me directly.');
    }
    setSubmitState('error');
  } catch {
    setSubmitError('Network error. Please email hello@cofit.me directly.');
    setSubmitState('error');
  }
}
```

- [ ] **Step 2: Add buildPayload helper at bottom of file**

Below `SuccessCard`:

```js
function buildPayload(inquiryType, partnershipType, d) {
  const base = {
    inquiryType,
    fullName: d.fullName, email: d.email, country: d.country, company: d.company,
    role: d.role || undefined,
    website_url: d.website_url || '',
  };
  if (inquiryType === 'business') {
    return {
      ...base,
      partnershipType: partnershipType || undefined,
      companySize: d.companySize || undefined,
      companyWebsite: d.companyWebsite || undefined,
      goals: d.goals,
      timeline: d.timeline || undefined,
    };
  }
  if (inquiryType === 'creator') {
    return {
      ...base,
      platforms: d.platforms,
      handleUrl: d.handleUrl,
      followerRange: d.followerRange,
      verticals: d.verticals,
      audienceMarkets: d.audienceMarkets,
      pastCollaborations: d.pastCollaborations || undefined,
      preferredCollabTypes: d.preferredCollabTypes?.length ? d.preferredCollabTypes : undefined,
      notes: d.notes || undefined,
    };
  }
  return { ...base, subject: d.subject, message: d.message };
}
```

- [ ] **Step 3: Wire the form's onSubmit**

Change `<form ... onSubmit={(e) => { e.preventDefault(); ... }}>` to `<form ... onSubmit={handleSubmit}>`.

- [ ] **Step 4: Verify happy path in browser**

Set `RESEND_API_KEY` in `.env.local`, restart dev server. On `/partners`:

1. Click **Other** pill
2. Fill: Name=Test, Email=you@yourdomain.com, Country=US, Company=Smoke, Subject=Plan test, Message=Hello
3. Submit → loading spinner → success card with "Thanks, Test!"
4. Check inbox at hello@cofit.me — email arrives with all fields rendered.

- [ ] **Step 5: Verify validation path**

Reload `/partners`, click Submit without filling anything → form shows red error text under each required field; submit button returns to idle.

- [ ] **Step 6: Verify rate limit**

Submit a valid Other inquiry → success.
Refresh, fill same form again, submit within 30s → red "You just submitted — please wait 30 seconds" error.

- [ ] **Step 7: Commit**

```bash
git add src/app/partners/page.js
git commit -m "Wire /partners form to POST /api/contact with loading/success/error states"
```

---

## Task 10: Replace homepage placeholder footer with real footer

**Files:**
- Modify: `src/app/partners/page.js`
- Modify: `src/app/partners/page.module.css`

The Task 5 scaffold has a thin placeholder footer. Replace with the same shared footer pattern as `src/app/page.js`.

- [ ] **Step 1: Read existing footer markup**

```bash
grep -n "footer" src/app/page.js | head
```

Expected: locate the `<footer>` block in `src/app/page.js` (around line 460-500).

- [ ] **Step 2: Port footer JSX into partners/page.js**

Replace the placeholder footer in `partners/page.js` with a copy of the footer JSX from `src/app/page.js`. Two adjustments:
- Add `<li><Link href="/partners">Partners</Link></li>` under the Company column
- Remove any homepage-only links if present

Specifically, the footer should have these columns:
- **Company**: About · Partners · Contact
- **Programs**: Flex8 · 1-on-1 Consultation
- **Connect**: Instagram, Facebook, YouTube social icons + a Contact via FB link

Example block:

```jsx
<footer className={styles.footer}>
  <div className={styles.footerInner}>
    <div className={styles.footerBrandCol}>
      <span className={styles.footerLogo}><span className={styles.navLogoGreen}>cofit</span></span>
      <p className={styles.footerTagline}>Science-led nutrition for healthier daily habits.</p>
      <div className={styles.footerSocials}>
        <a href="https://www.instagram.com/hicofit" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram"><Instagram size={16} strokeWidth={1.75} /></a>
        <a href="https://www.facebook.com/profile.php?id=61564521081758" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook"><Facebook size={16} strokeWidth={1.75} /></a>
        <a href="https://www.youtube.com/@Cofit211" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube"><Youtube size={16} strokeWidth={1.75} /></a>
      </div>
    </div>
    <div className={styles.footerCol}>
      <h4>Company</h4>
      <ul>
        <li><Link href="/partners">Partners</Link></li>
        <li><a href="https://www.facebook.com/profile.php?id=61564521081758" target="_blank" rel="noopener noreferrer">Contact via Facebook</a></li>
      </ul>
    </div>
    <div className={styles.footerCol}>
      <h4>Programs</h4>
      <ul>
        <li><Link href="/flex8">Flex8</Link></li>
        <li><Link href="/consultation">1-on-1 Consultation</Link></li>
      </ul>
    </div>
    <div className={styles.footerCol}>
      <h4>Get Started</h4>
      <ul>
        <li><Link href="/consultation">Book a session</Link></li>
        <li><Link href="/flex8">Join Flex8</Link></li>
      </ul>
    </div>
  </div>
  <div className={styles.footerBottom}>© {new Date().getFullYear()} Cofit Healthcare. All rights reserved.</div>
</footer>
```

- [ ] **Step 3: Port footer CSS from home.module.css**

Open `src/app/home.module.css`, find footer-related class blocks (`.footer`, `.footerInner`, `.footerCol`, `.footerSocials`, `.socialIcon`, `.footerBrandCol`, `.footerLogo`, `.footerTagline`, `.footerBottom`), copy them into `src/app/partners/page.module.css`. **Do not rename classes** — keep names identical so future refactor (extracting to a shared component) is clean.

If a class already exists in `partners/page.module.css` (e.g. `.footer`), replace it with the home.module.css version.

- [ ] **Step 4: Verify footer in browser**

Reload `/partners`, scroll to bottom. Expected: 4-column footer matching home page, with Partners link in Company column.

- [ ] **Step 5: Commit**

```bash
git add src/app/partners/
git commit -m "Replace /partners footer placeholder with full shared-style footer"
```

---

## Task 11: Homepage integration — nav, hero CTA, footer link

**Files:**
- Modify: `src/app/page.js`

Three swaps + one footer addition. The existing string is `mailto:partner@cofit.me`.

- [ ] **Step 1: Update homepage nav link**

In `src/app/page.js` around line 152, change:

```jsx
<a href="mailto:partner@cofit.me" className={styles.navLink}>Partner with Us</a>
```

to:

```jsx
<Link href="/partners" className={styles.navLink}>Partners</Link>
```

- [ ] **Step 2: Update homepage mobile menu link**

Around line 172, change:

```jsx
<a href="mailto:partner@cofit.me" className={styles.mobileMenuLink}>Partner with Us</a>
```

to:

```jsx
<Link href="/partners" className={styles.mobileMenuLink}>Partners</Link>
```

- [ ] **Step 3: Update hero CTA link + copy**

Around line 191, find:

```jsx
<a href="mailto:partner@cofit.me" className={styles.btnSecondary}>Partner with Us →</a>
```

Replace with:

```jsx
<Link href="/partners" className={styles.btnSecondary}>Explore partnerships →</Link>
```

Also update the surrounding hero CTA section copy. Find the line containing `cta: "Partner with Us"` (around line 130) and change to:

```js
cta: "Explore partnerships",
```

If there's a description string near it ("Become a partner..." or similar), change to "From corporate wellness to creator collaborations — let's talk." (re-read CONTEXT to confirm exact line; copy may vary).

- [ ] **Step 4: Update footer link**

Around line 489, change:

```jsx
<li><a href="mailto:partner@cofit.me">Partner with Us</a></li>
```

to:

```jsx
<li><Link href="/partners">Partners</Link></li>
```

- [ ] **Step 5: Verify in browser**

Reload `/`. Expected:
- Nav: "Flex8 Program · 1-on-1 Consultation · Partners" (no "Partner with Us")
- Mobile menu: same
- Hero secondary CTA: "Explore partnerships →" (clicks to /partners)
- Footer: "Partners" link in appropriate column

Click each → arrives at `/partners`.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.js
git commit -m "Homepage: replace partner mailto links with /partners route"
```

---

## Task 12: /flex8 + /consultation nav integration

**Files:**
- Modify: `src/app/flex8/page.js`
- Modify: `src/app/consultation/page.js`

- [ ] **Step 1: Locate flex8 nav links**

```bash
grep -n "Partner\|navLink\|mobileMenuLink" src/app/flex8/page.js | head -20
```

- [ ] **Step 2: Add Partners link to flex8 desktop nav**

In `src/app/flex8/page.js`, find the `navLinks` div (similar pattern to homepage). After the existing 1-on-1 / Flex8 links, add:

```jsx
<Link href="/partners" className={styles.navLink}>Partners</Link>
```

- [ ] **Step 3: Add Partners to flex8 mobile menu**

Find the `mobileMenu` div, after existing menu links, add:

```jsx
<Link href="/partners" className={styles.mobileMenuLink}>Partners</Link>
```

- [ ] **Step 4: Repeat for consultation/page.js**

Apply the same two additions to `src/app/consultation/page.js`. The consultation page imports CSS from `../flex8/page.module.css` so no CSS changes needed.

- [ ] **Step 5: Verify in browser**

Visit `/flex8` and `/consultation`. Both should now show "Partners" in nav (desktop) and hamburger menu (mobile). Click → arrives at `/partners`.

- [ ] **Step 6: Commit**

```bash
git add src/app/flex8/page.js src/app/consultation/page.js
git commit -m "Add Partners nav link to /flex8 and /consultation"
```

---

## Task 13: Engineer handoff doc

**Files:**
- Create: `docs/handoff/partners-page.md`

- [ ] **Step 1: Write handoff doc**

Create `docs/handoff/partners-page.md`:

```markdown
# /partners Page — Engineer Handoff

**Status**: Demo-mode ship. Production hardening below required before public launch.

## What ships in demo mode

- `/partners` page with nav + hero + Why-Partner cards + 6-card Partnership Types grid + conditional inquiry form (Business / Creator / Other)
- `POST /api/contact` validates with Zod, applies honeypot + 30s/IP rate limit, sends via Resend
- Homepage hero CTA, nav link, and footer link all point to `/partners`
- Same nav addition on `/flex8` and `/consultation`

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

- `npm run test` runs Vitest on the schema + helpers
- 18 tests cover schema variants, honeypot, rate limit, HTML formatter, HTML escaping
- Add tests when modifying `src/app/lib/contact-schema.js` or `src/app/lib/contact-helpers.js`
```

- [ ] **Step 2: Verify TODO comments match doc references**

```bash
grep -rn "TODO(engineer)" src/
```

Expected: at least 2 matches in `src/app/api/contact/route.js`. Each should reference `docs/handoff/partners-page.md` and an item number.

- [ ] **Step 3: Commit**

```bash
git add docs/handoff/partners-page.md
git commit -m "Add /partners engineer handoff doc with 10 production-hardening items"
```

---

## Task 14: Final verification + cleanup

**Files:**
- (verification only)

- [ ] **Step 1: Run full test suite**

```bash
npm run test
```

Expected: all tests pass (18 across schema + helpers).

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: build succeeds. No console errors during static generation. `/partners` and `/api/contact` both show in the build output.

- [ ] **Step 3: Manual browser walk-through (desktop)**

Visit each route and verify:
- `/` → hero CTA "Explore partnerships →" links to `/partners`. Nav has "Partners". Footer has Partners link.
- `/flex8` → Nav has Partners.
- `/consultation` → Nav has Partners.
- `/partners` → Hero, Why-Partner (3 cards), Partnership Types (6 cards), Form, Footer all render. Click each Partnership-Type card → form scrolls + pre-fills.
- Switch each pill (Business/Creator/Other) → conditional fields swap with smooth animation.
- Submit Other inquiry with valid data → success card; email lands in inbox.
- Submit invalid form → red errors under fields.
- Submit twice quickly → 429 rate-limit error.

- [ ] **Step 4: Mobile viewport check (375px)**

Resize to 375×812. Verify:
- All four pages: hamburger menu shows; "Partners" link inside.
- `/partners`: form is single-column; pill group stacks vertically; Partnership Types grid is 1 column; chips wrap.
- No horizontal scroll anywhere.

- [ ] **Step 5: Accessibility spot-check**

In `/partners`:
- Tab through the form. Each input has visible focus.
- Submit invalid form. Screen reader (or DevTools accessibility tree) reads error messages from the input's `aria-describedby`.
- Pill group: arrow-key navigation between Business / Creator / Other (browsers vary; if not implemented natively, leave as-is — `role="radiogroup"` is the contract).

- [ ] **Step 6: Lighthouse run (optional)**

In Chrome DevTools, run Lighthouse on `/partners`. Target: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 95, SEO ≥ 95.

If anything fails, fix inline and amend the relevant commit (or add a small follow-up commit).

- [ ] **Step 7: Push**

```bash
git push origin master
```

Expected: Vercel auto-deploys. Visit production URL `/partners` to confirm.

---

## Self-Review Checklist (run before declaring done)

- [ ] All 14 tasks committed
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] `/partners` renders end-to-end in production
- [ ] One real test inquiry from each type (Business / Creator / Other) submitted; emails arrived
- [ ] All `// TODO(engineer):` comments link back to handoff doc items
- [ ] `docs/handoff/partners-page.md` exists and is accurate
