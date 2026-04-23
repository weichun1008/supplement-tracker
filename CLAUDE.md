# Cofit Healthcare — International Brand Site

Marketing site for **Cofit Healthcare**, a digital nutrition / DTx company based in Taiwan. This repo is the international-facing site targeting English-speaking Asian diaspora (Singapore, US) acquired via influencer marketing.

## Tech stack

- **Framework**: Next.js 16 (App Router, Turbopack) · React 19
- **Styling**: CSS Modules (`*.module.css`) — no Tailwind
- **Animation**: framer-motion (`useInView`, `useMotionValue`, `useSpring`)
- **DB**: `@vercel/postgres` / Neon (only used by legacy experimental routes)
- **Deploy**: Vercel, auto-deploys on push to `master`

## Active pages (the ones that matter)

| Route | File | Purpose |
|---|---|---|
| `/` | [src/app/page.js](src/app/page.js) + [home.module.css](src/app/home.module.css) | International brand homepage (hero, proof bar, media, solutions, DTx layered-stack, nutritionists, partner CTA, footer) |
| `/flex8` | [src/app/flex8/page.js](src/app/flex8/page.js) | 8-week Flex-Carb program landing |
| `/consultation` | [src/app/consultation/page.js](src/app/consultation/page.js) | 1-on-1 nutritionist booking |

External registration forms (users are redirected out — **we do not handle auth or payment**):
- 1-on-1: `https://pro.cofit.me/administrator/registration_forms/3088/new_group_class_order?org_id=3`
- Flex8: `https://pro.cofit.me/administrator/registration_forms/3094/new_group_class_order?org_id=3`

## Don't touch (legacy experiments, not part of the marketing site)

- `src/app/(services)/supplements`, `(services)/wounds`, `(services)/intimacy`
- `src/app/hq`, `src/app/medications`, `src/app/calendar`
- `src/app/login`, `src/app/api/auth/*`, `src/app/lib/auth.js`, `LiffProvider`

All pages are **publicly accessible — no login required**. The auth scaffolding exists from earlier DTx experiments; leave it alone.

## Design principles

- **Aesthetic**: international SaaS / health-tech, not Taiwanese brochure style
- **Palette**: `--green: #00C300` (logo) · `--teal: #004F51` (primary action) · warm bg `#FCFCFA`
- **Typography**: Inter, tight letter-spacing on display
- **Motion is a feature**: scroll-triggered entrance, count-up stats, 3D tilt — keep it tasteful, not busy
- **Copy language**: English-first (the zh-TW audience has a separate site)
- **Images**: Pexels CDN works; Unsplash new-format IDs do NOT load via `images.unsplash.com`

## Commands

```bash
npm run dev        # localhost:3000 — clear .next/dev/lock if it sticks
npm run build      # production build
git push master    # deploys to Vercel automatically
```

If dev server misbehaves after dep changes, `rm -rf .next node_modules/.cache && npm install`.

## Coding conventions

- Client components: `'use client'` directive at top
- Prefer inline motion components in the page file unless reused across pages
- Don't add comments explaining *what* — only *why* (and only if non-obvious)
- No backwards-compat shims, no dead `_vars`, no TODO breadcrumbs

## Environment

- `.env.local` pulled from Vercel: `vercel env pull .env.local`
- Vercel project: `johnson-cofitmes-projects/supplement-tracker`
- Production: `https://supplement-tracker-kappa.vercel.app`
- GitHub: `weichun1008/supplement-tracker`
