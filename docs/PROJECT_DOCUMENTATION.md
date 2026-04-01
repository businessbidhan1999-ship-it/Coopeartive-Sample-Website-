# RMCL Website — Technical Documentation

**Royal Multipurpose Cooperative Society Ltd.**
Production-ready website with admin panel, bilingual support, and JSON-based persistence.

**Version:** 1.0.0
**Last Updated:** April 1, 2026
**Stack:** Next.js 14 (App Router) · TypeScript · CSS Modules · JSON File Storage

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [What Was Built (Phase-by-Phase)](#2-what-was-built-phase-by-phase)
3. [Architecture Overview](#3-architecture-overview)
4. [Directory Structure](#4-directory-structure)
5. [Tech Stack & Dependencies](#5-tech-stack--dependencies)
6. [Authentication & Security](#6-authentication--security)
7. [Data Layer](#7-data-layer)
8. [Internationalization (i18n)](#8-internationalization-i18n)
9. [Frontend Components](#9-frontend-components)
10. [API Reference](#10-api-reference)
11. [Admin Panel](#11-admin-panel)
12. [Styling Architecture](#12-styling-architecture)
13. [Environment Configuration](#13-environment-configuration)
14. [Build & Deployment](#14-build--deployment)
15. [Maintenance Guide](#15-maintenance-guide)

---

## 1. Project Summary

RMCL is a Nepali cooperative that provides banking, microfinance, insurance, remittance, and agricultural services. This website serves as the organization's public-facing portal and internal content management system.

**Core capabilities:**
- Public website with 24 pages (homepage, products, branches, news, about, contact, apply)
- Admin panel with full CRUD for all content (news, products, branches, team, rates, settings)
- Bilingual interface (English and Nepali) with localStorage-persisted language preference
- JWT-authenticated admin access with role-based users (admin/editor)
- EMI and Fixed Deposit calculators
- Online application and contact form submission system
- JSON file-based persistence (no external database required)
- Responsive design across mobile, tablet, and desktop breakpoints

**Why JSON instead of a database:**
The site is designed for deployment on Oracle Cloud free tier where database costs are a concern. JSON files provide zero-cost persistence with write locking for concurrency safety. For the expected traffic volume of a cooperative website (~100-500 daily visitors), this approach is more than adequate.

---

## 2. What Was Built (Phase-by-Phase)

### Phase 1 — Security Hardening
Implemented authentication and security infrastructure from scratch.

| Deliverable | File(s) | Purpose |
|---|---|---|
| JWT auth | `src/lib/auth.ts` | Session creation, verification, cookie management using `jose` |
| API auth guard | `src/lib/api-auth.ts` | `requireAdminSession()` for all admin API routes |
| Route middleware | `src/middleware.ts` | Intercepts `/admin/*`, validates JWT, redirects if unauthenticated |
| Login page | `src/app/admin/login/page.tsx` | Admin login with bcrypt password verification |
| Auth API | `src/app/api/auth/*/route.ts` | Login, logout, session check endpoints |
| Security headers | `next.config.js` | CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| Environment config | `.env.local`, `.env.example` | AUTH_SECRET, ADMIN_USERS (bcrypt hashes), SESSION_EXPIRY_HOURS |

**Key decisions:**
- Used `jose` over `jsonwebtoken` for edge runtime compatibility (Next.js middleware runs at the edge)
- bcryptjs for password hashing (12 salt rounds)
- 8-hour session expiry with httpOnly cookie
- Separate `from` parameter on login redirect to return users to their intended page

### Phase 2 — Data Layer
Built a file-based persistence layer that the admin panel writes to and the public site reads from.

| Deliverable | File(s) | Purpose |
|---|---|---|
| JSON store | `src/lib/json-store.ts` | Read/write JSON files with in-process write locking |
| Data files | `data/*.json` | Persistent storage for news, products, branches, team, rates, settings |
| Admin APIs | `src/app/api/admin/*/route.ts` | 7 CRUD endpoints (news, products, branches, team, rates, settings, upload) |
| Static data | `src/lib/data.ts` | Compile-time content (siteConfig, aboutData, products, branches, etc.) |

**Key decisions:**
- Write locking prevents corruption from concurrent admin edits
- Path traversal protection via character filtering on file names
- `generateId()` uses timestamp + random suffix for collision-free IDs
- File upload handler saves to `public/uploads/` with filename sanitization

### Phase 3 — Form Submissions
Connected the public-facing forms to the backend.

| Deliverable | File(s) | Purpose |
|---|---|---|
| Apply API | `src/app/api/public/apply/route.ts` | Receives online applications, stores in `data/submissions/applications.json` |
| Contact API | `src/app/api/public/contact/route.ts` | Receives contact messages, stores in `data/submissions/contacts.json` |
| Submissions admin | `src/app/admin/submissions/page.tsx` | Tabbed view of applications/contacts with status management |
| Form wiring | `ApplySection.tsx`, `contact/page.tsx` | `fetch()` POST with loading, error, success states |

**Key decisions:**
- Validation runs client-side (UX) AND server-side (security)
- Status workflow: `new` → `reviewed` → `contacted`/`replied`
- Fixed Next.js Suspense boundary requirement for `useSearchParams()` in login page

### Phase 4 — Admin CRUD (Real Persistence)
Rewrote all 6 admin pages from static `useState` to live API-backed CRUD.

| Admin Page | API Endpoint | Operations |
|---|---|---|
| News | `/api/admin/news` | GET, POST, PUT, DELETE |
| Products | `/api/admin/products` | GET, POST, PUT, DELETE |
| Branches | `/api/admin/branches` | GET, POST, PUT, DELETE |
| Team | `/api/admin/team` | GET, PUT (chairman + members) |
| Rates | `/api/admin/rates` | GET, PUT |
| Settings | `/api/admin/settings` | GET, PUT |

**Notable implementations:**
- Products page: `TagInput` component for managing features/requirements/facilities (Enter to add, × to remove). Auto-generates slug from product name.
- Team page: Photo upload via `/api/admin/upload` with preview. Chairman has dedicated edit form with `action: "update-chairman"` body.
- Settings page: Flattens nested `siteConfig` for form fields, reconstructs nested shape on save.

### Phase 5 — Navigation & Premium UI
Complete rewrite of navigation and addition of premium hover effects across all card-based sections.

| Deliverable | Description |
|---|---|
| Desktop navigation | Dropdown menus with fade-in + translate, mega menu for Products (3-column), gold underline sweep on links |
| Mobile navigation | Side panel sliding from right, accordion sub-menus, staggered entrance animation, backdrop blur |
| CTA shimmer | `::before` pseudo-element with `translateX(-100% → 100%)` gradient sweep |
| Card hover effects | Gold shimmer sweep, gold top-edge accent line, emoji tilt, arrow slide, border glow |
| Product tabs | Animated tab switching with fade-out/fade-in transition (`gridFading`/`gridVisible`) |
| Branch cards | Phone number pill styling, proper phone `tel:` link (first number only from comma-separated list) |
| Responsive | 1024px (tablet stack), 768px (mobile), 480px (small mobile) breakpoints |

### Phase 6 — Bilingual Support (English/Nepali)
Full internationalization using React Context with localStorage persistence.

| Deliverable | File(s) | Purpose |
|---|---|---|
| English translations | `src/lib/translations/en.ts` | 250+ strings covering all UI text, exported as `const en` with `as const` |
| Nepali translations | `src/lib/translations/ne.ts` | Complete Devanagari translations implementing same `Translations` type |
| i18n context | `src/lib/i18n-context.tsx` | `I18nProvider` with `useLanguage()` hook, localStorage persistence |
| Client wrapper | `src/components/layout/I18nWrapper.tsx` | Client boundary for server root layout |
| Language toggle | Navbar + mobile nav | Button switching between EN/नेपाली |

**Components wired to translations:**
- All 9 homepage sections (Hero, Ticker is data-driven, Products, Calculator, About, Services, News, Branches, Apply)
- All 5 public pages (About, Branches, News, Products, Contact)
- Navbar (desktop + mobile, all labels and dropdown items)
- Footer (all columns, links, tagline, copyright)

**Type system:** `DeepWritable<typeof en>` utility type widens `as const` string literals so Nepali strings aren't rejected by TypeScript.

### Phase 7 — UI/UX Refinements
Final polish pass for production-grade visual quality.

| Deliverable | Description |
|---|---|
| Scroll reveal | `ScrollReveal` component using IntersectionObserver — sections fade up as user scrolls |
| Loading spinner | `Spinner` component with CSS `spin` animation on form submit buttons |
| Global card glow | Enhanced `.card:hover` with layered gold glow (`0 0 20px rgba(201,168,76,0.06)`) |
| News/Services cards | Added shimmer sweep + gold top-edge accent matching Products/Branches pattern |
| Page entrance | `page-hero` fades in on load, next section follows with 150ms delay |
| Responsive additions | `page-two-col` stacks at 1024px, hero stats 2×2 grid at 480px, CTA full-width on mobile |
| Micro-interactions | Hero stat hover lift, footer link indent on hover, slider thumb glow, Firefox range thumb |
| Button states | `btn[disabled]` with opacity + pointer-events, spinner replaces text during submit |

---

## 3. Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                       │
│                                                               │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Navbar  │  │  Pages   │  │  Sections │  │  Admin Panel  │  │
│  │ Footer  │  │ (routes) │  │ (homepage)│  │  (CRUD UI)    │  │
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘  │
│       │             │             │                │          │
│       └─────────────┴──────┬──────┴────────────────┘          │
│                            │                                  │
│                   ┌────────┴────────┐                         │
│                   │  I18n Context   │                         │
│                   │  (EN / NE)      │                         │
│                   └─────────────────┘                         │
└──────────────────────────┬───────────────────────────────────┘
                           │ fetch()
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     SERVER (Next.js)                           │
│                                                               │
│  ┌─────────────┐  ┌────────────────┐  ┌───────────────────┐  │
│  │ Middleware   │  │  API Routes    │  │  Static Data      │  │
│  │ (JWT check) │  │  /api/admin/*  │  │  (data.ts)        │  │
│  │             │  │  /api/public/* │  │                   │  │
│  │             │  │  /api/auth/*   │  │                   │  │
│  └──────┬──────┘  └───────┬────────┘  └───────────────────┘  │
│         │                 │                                   │
│         │          ┌──────┴──────┐                            │
│         │          │ json-store  │                            │
│         │          │ (read/write │                            │
│         │          │  with lock) │                            │
│         │          └──────┬──────┘                            │
│         │                 │                                   │
│  ┌──────┴──────┐   ┌─────┴──────┐                            │
│  │  auth.ts    │   │  data/*.json│                            │
│  │  (jose JWT) │   │  (persist) │                            │
│  └─────────────┘   └────────────┘                            │
└──────────────────────────────────────────────────────────────┘
```

**Request flow for admin operations:**
1. Browser sends request to `/admin/*` route
2. `middleware.ts` intercepts, checks JWT cookie
3. If invalid/missing → redirect to `/admin/login`
4. If valid → page renders, admin UI fetches from `/api/admin/*`
5. API route calls `requireAdminSession()` to re-verify
6. `json-store.ts` reads/writes `data/*.json` with write locking
7. Response returned to admin UI

**Request flow for public forms:**
1. User fills form on `/apply` or `/contact`
2. Client-side validation runs first (UX)
3. `fetch()` POST to `/api/public/apply` or `/api/public/contact`
4. Server-side validation runs (security)
5. Data written to `data/submissions/*.json`
6. Success/error response returned

---

## 4. Directory Structure

```
rmcl/
├── .env.local                    # Environment variables (secrets, admin users)
├── .env.example                  # Template for .env.local
├── next.config.js                # Security headers, CSP, image config
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript strict mode, path aliases
│
├── data/                         # Persistent JSON storage (server-side)
│   ├── settings.json
│   ├── products.json
│   ├── news.json
│   ├── branches.json
│   ├── rates.json
│   ├── team.json
│   └── submissions/
│       ├── applications.json
│       └── contacts.json
│
├── public/
│   ├── images/team/              # Team member photos
│   └── uploads/                  # Admin-uploaded files
│
└── src/
    ├── middleware.ts              # Auth guard for /admin/* routes
    │
    ├── app/
    │   ├── layout.tsx            # Root layout (metadata, I18nWrapper, Navbar, Footer)
    │   ├── page.tsx              # Homepage (9 sections with ScrollReveal)
    │   ├── not-found.tsx         # Custom 404
    │   │
    │   ├── about/                # About pages
    │   │   ├── page.tsx          # Overview (mission, vision, objectives)
    │   │   ├── chairman/page.tsx # Chairman's message
    │   │   ├── board/page.tsx    # Board of directors
    │   │   └── management/page.tsx # Top management
    │   │
    │   ├── products/
    │   │   ├── page.tsx          # All products + interest rate table
    │   │   └── [category]/[slug]/page.tsx  # Product detail (SSG)
    │   │
    │   ├── news/
    │   │   ├── page.tsx          # News listing with featured card
    │   │   └── [id]/page.tsx     # News detail (SSG)
    │   │
    │   ├── branches/page.tsx     # Branch listing + OpenStreetMap embed
    │   ├── contact/page.tsx      # Contact info + form
    │   ├── apply/page.tsx        # Online application form
    │   │
    │   ├── admin/
    │   │   ├── layout.tsx        # Admin layout (sidebar, auth check)
    │   │   ├── page.tsx          # Dashboard
    │   │   ├── login/page.tsx    # Login form (Suspense-wrapped)
    │   │   ├── news/page.tsx     # Manage news articles
    │   │   ├── products/page.tsx # Manage products (TagInput for features)
    │   │   ├── branches/page.tsx # Manage branches
    │   │   ├── team/page.tsx     # Manage team (photo upload)
    │   │   ├── rates/page.tsx    # Manage interest rates
    │   │   ├── settings/page.tsx # Site-wide settings
    │   │   └── submissions/page.tsx # View applications & contact messages
    │   │
    │   └── api/
    │       ├── auth/login/route.ts     # POST: authenticate, set JWT cookie
    │       ├── auth/logout/route.ts    # POST: clear session cookie
    │       ├── auth/session/route.ts   # GET: check current session
    │       ├── admin/news/route.ts     # GET/POST/PUT/DELETE
    │       ├── admin/products/route.ts # GET/POST/PUT/DELETE
    │       ├── admin/branches/route.ts # GET/POST/PUT/DELETE
    │       ├── admin/team/route.ts     # GET/PUT
    │       ├── admin/rates/route.ts    # GET/PUT
    │       ├── admin/settings/route.ts # GET/PUT
    │       ├── admin/submissions/route.ts # GET/PUT (status updates)
    │       ├── admin/upload/route.ts   # POST (file upload)
    │       ├── public/apply/route.ts   # POST (application form)
    │       └── public/contact/route.ts # POST (contact form)
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx + .module.css   # Desktop/mobile nav, dropdowns, mega menu
    │   │   ├── Footer.tsx + .module.css   # 4-column footer
    │   │   ├── Topbar.tsx + .module.css   # Contact info bar (hidden on mobile)
    │   │   └── I18nWrapper.tsx            # Client boundary for i18n context
    │   │
    │   ├── sections/                      # Homepage sections
    │   │   ├── HeroSection.tsx + .css     # Animated counters, stats, CTAs
    │   │   ├── TickerSection.tsx + .css   # Scrolling news ticker
    │   │   ├── ProductsSection.tsx + .css # Tabbed product cards with animation
    │   │   ├── CalculatorSection.tsx + .css # EMI/FD calculator with sliders
    │   │   ├── AboutSection.tsx + .css    # Mission/vision/objectives
    │   │   ├── ServicesSection.tsx + .css  # 8 service cards
    │   │   ├── NewsSection.tsx + .css     # Latest 4 news cards
    │   │   ├── BranchesSection.tsx + .css # Branch cards with phone links
    │   │   └── ApplySection.tsx + .css    # Application form with validation
    │   │
    │   └── ui/
    │       ├── ScrollReveal.tsx           # IntersectionObserver fade-up wrapper
    │       └── Spinner.tsx               # CSS loading spinner
    │
    ├── lib/
    │   ├── data.ts                # Static content (siteConfig, about, products, branches, etc.)
    │   ├── auth.ts                # JWT create/verify, cookie management, admin user parsing
    │   ├── api-auth.ts            # requireAdminSession() for API routes
    │   ├── json-store.ts          # JSON file I/O with write locking
    │   ├── utils.ts               # sanitize, formatNPR, calcEMI, calcFD, validators
    │   ├── i18n-context.tsx       # I18nProvider, useLanguage() hook
    │   └── translations/
    │       ├── en.ts              # English strings (250+), exports Translations type
    │       └── ne.ts              # Nepali (Devanagari) translations
    │
    └── styles/
        └── globals.css            # Design tokens, utility classes, animations, responsive base
```

---

## 5. Tech Stack & Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.2.5 | React framework (App Router, SSR/SSG, API routes) |
| `react` | 18.3.1 | UI library |
| `react-dom` | 18.3.1 | React DOM renderer |
| `jose` | 6.2.2 | JWT signing/verification (edge-compatible, unlike jsonwebtoken) |
| `bcryptjs` | 3.0.3 | Password hashing (12 salt rounds) |
| `lucide-react` | 0.383.0 | Icon library |
| `clsx` | 2.1.1 | Conditional classname utility |

### Dev Dependencies

| Package | Version | Purpose |
|---|---|---|
| `typescript` | 5.x | Type safety |
| `@types/react` | 18.x | React type definitions |
| `@types/react-dom` | 18.x | React DOM types |
| `@types/node` | 20.x | Node.js types |
| `eslint` | 8.x | Code linting |
| `eslint-config-next` | 14.2.5 | Next.js ESLint rules |

### Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build (type-checks + compiles)
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 6. Authentication & Security

### Authentication Flow

```
User → /admin/login → POST /api/auth/login
  ├── bcrypt.compare(password, storedHash)
  ├── jose.SignJWT({ username, role }).sign(AUTH_SECRET)
  └── Set cookie: rmcl_admin_session (httpOnly, secure, sameSite: lax)

User → /admin/* → middleware.ts
  ├── Read cookie → jose.jwtVerify(token, AUTH_SECRET)
  ├── Valid → NextResponse.next()
  └── Invalid → redirect /admin/login?from=/admin/intended-page

User → /api/admin/* → requireAdminSession()
  ├── cookies().get(COOKIE_NAME)
  ├── verifySession(token)
  └── Return { session } or { error: 401 }
```

### Security Headers (next.config.js)

| Header | Value | Purpose |
|---|---|---|
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer info |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Disables device APIs |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | Forces HTTPS |
| Content-Security-Policy | Strict CSP (unsafe-eval only in dev) | Prevents XSS |

### Admin User Management

Admin users are defined in the `ADMIN_USERS` environment variable as a JSON array:

```json
[
  {"username":"admin","passwordHash":"$2a$12...","role":"admin"},
  {"username":"editor","passwordHash":"$2a$12...","role":"editor"}
]
```

**Generate a password hash:**
```bash
node -e "console.log(require('bcryptjs').hashSync('YourPassword', 12))"
```

**Generate AUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 7. Data Layer

### json-store.ts

The persistence layer is a simple JSON file reader/writer with concurrency protection.

```typescript
readJSON<T>(name: string): Promise<T>      // Read a JSON file from data/
writeJSON<T>(name: string, data: T): void  // Write with in-process lock
generateId(): string                        // Timestamp + random suffix
```

**Write locking:** An in-memory `Map<string, Promise>` ensures that concurrent writes to the same file are serialized. This prevents data corruption when two admin users edit simultaneously.

**Path traversal protection:** File names are filtered to only allow `[a-zA-Z0-9_-/]` characters.

### Data Files

| File | Content | Admin Page |
|---|---|---|
| `data/settings.json` | Site name, contact info, social links, stats | `/admin/settings` |
| `data/products.json` | Loan, deposit, microfinance products | `/admin/products` |
| `data/news.json` | News articles with title, excerpt, content, category | `/admin/news` |
| `data/branches.json` | Branch name, address, phone, in-charge, type | `/admin/branches` |
| `data/rates.json` | Interest rate tables (loans + deposits) | `/admin/rates` |
| `data/team.json` | Chairman message, board members, management team | `/admin/team` |
| `data/submissions/applications.json` | Online application submissions | `/admin/submissions` |
| `data/submissions/contacts.json` | Contact form messages | `/admin/submissions` |

### Static Data (data.ts)

`src/lib/data.ts` is the compile-time single source of truth. It exports:

- `siteConfig` — Organization name, contact, stats, social links
- `aboutData` — Mission, vision, goal, objectives, introduction
- `chairmanMessage` — Chairman's name, title, full message
- `boardOfDirectors` — Array of board member objects
- `topManagement` — Array of management team members
- `loanProducts` — 8 loan products with features, requirements
- `depositProducts` — 4 deposit products
- `microfinanceProducts` — 3 microfinance products
- `branches` — 8 branch locations with addresses and phone numbers
- `newsItems` — News articles
- `interestRateTable` — Current loan and deposit rates
- `tickerItems` — Scrolling ticker text items

---

## 8. Internationalization (i18n)

### Architecture

The i18n system uses React Context with no external library. Language preference persists in `localStorage` under the key `rmcl-lang`.

```
I18nProvider (wraps entire app)
  ├── State: lang ("en" | "ne")
  ├── On mount: reads localStorage
  ├── toggle(): switches lang, writes to localStorage
  └── Provides: { t: Translations, lang, toggle }

useLanguage() hook → returns { t, lang, toggle }
```

### Translation Files

**English** (`src/lib/translations/en.ts`):
- 250+ translation keys organized by section
- Exported as `const en` with `as const`
- Type exported as `Translations` (using `DeepWritable` to widen string literals)

**Nepali** (`src/lib/translations/ne.ts`):
- Implements `Translations` type from English file
- Full Devanagari script translations

### Translation Sections

| Key | Coverage |
|---|---|
| `t.nav` | All navigation labels, product names in mega menu |
| `t.hero` | Hero title, subtitle, stat labels, CTA text |
| `t.about` | Section label, title, mission/vision/goal labels |
| `t.products` | Tab labels, feature count text, view all CTA |
| `t.branches` | Section header, in-charge label, HQ badge |
| `t.news` | Section header, featured badge, read more |
| `t.calc` | Calculator labels, result row labels, disclaimer |
| `t.apply` | Form labels, placeholders, validation errors, success message |
| `t.contact` | Contact page hero, form labels, validation errors |
| `t.footer` | Column titles, link labels, tagline, copyright |
| `t.breadcrumb` | Page breadcrumb labels |
| `t.pages` | Inner page hero titles and subtitles |

### Adding a New Language

1. Create `src/lib/translations/xx.ts` implementing `Translations`
2. Add to the translations map in `src/lib/i18n-context.tsx`
3. Update the toggle logic to cycle through languages

---

## 9. Frontend Components

### Layout Components

| Component | File | Description |
|---|---|---|
| `Navbar` | `layout/Navbar.tsx` | Sticky nav with desktop dropdowns, mega menu, mobile side panel, language toggle |
| `Footer` | `layout/Footer.tsx` | 4-column footer (brand, quick links, products, contact) |
| `Topbar` | `layout/Topbar.tsx` | Slim bar with address, phone, hours, email (hidden on mobile) |
| `I18nWrapper` | `layout/I18nWrapper.tsx` | Client boundary that wraps children with `I18nProvider` |

### Homepage Sections

| Section | Key Features |
|---|---|
| `HeroSection` | Animated number counters (IntersectionObserver), radial gradient background, grid pattern, decorative ornament |
| `TickerSection` | Infinite scrolling marquee, pauses on hover |
| `ProductsSection` | Tab switching with fade animation, card entrance stagger, word-boundary truncation |
| `CalculatorSection` | EMI/FD mode toggle, range sliders with gold styling, live calculation results, NRB disclaimer |
| `AboutSection` | Mission/vision/goal pillars, objectives checklist card |
| `ServicesSection` | 8 service cards with shimmer sweep on hover |
| `NewsSection` | Latest 4 news cards, featured items first |
| `BranchesSection` | Branch cards with HQ badge, phone pill links (first number extracted) |
| `ApplySection` | 5-field form with client + server validation, spinner on submit |

### UI Components

| Component | File | Description |
|---|---|---|
| `ScrollReveal` | `ui/ScrollReveal.tsx` | Wraps children in a `div.reveal` that fades up when scrolled into view |
| `Spinner` | `ui/Spinner.tsx` | Pure CSS spinning circle, `size` prop |

### Shared CSS Effects

All card-based sections share a consistent hover pattern:
1. **Shimmer sweep** — `::before` gradient translates from -100% to +100%
2. **Gold top-edge** — `::after` 2px gradient line fades in
3. **Lift** — `translateY(-5px)` with enhanced box-shadow
4. **Border glow** — Border color brightens + subtle gold glow
5. **Icon tilt** — Emoji scales 1.12× and rotates -5°

---

## 10. API Reference

### Authentication

#### `POST /api/auth/login`
```json
Request:  { "username": "admin", "password": "..." }
Response: { "ok": true }
Cookie:   rmcl_admin_session=<JWT> (httpOnly, secure, sameSite: lax)
```

#### `POST /api/auth/logout`
```json
Response: { "ok": true }
Cookie:   rmcl_admin_session deleted
```

#### `GET /api/auth/session`
```json
Response: { "user": { "username": "admin", "role": "admin" } }
   or:    { "user": null }
```

### Admin CRUD (all require valid session cookie)

#### `GET /api/admin/news`
Returns array of news articles.

#### `POST /api/admin/news`
```json
Request:  { "title": "...", "excerpt": "...", "content": "...", "category": "...", "emoji": "📰", "featured": false }
Response: { "ok": true, "item": { "id": "...", ... } }
```

#### `PUT /api/admin/news`
```json
Request:  { "id": "...", "title": "...", ... }
Response: { "ok": true }
```

#### `DELETE /api/admin/news`
```json
Request:  { "id": "..." }
Response: { "ok": true }
```

The same GET/POST/PUT/DELETE pattern applies to:
- `/api/admin/products`
- `/api/admin/branches`

#### `PUT /api/admin/rates`
```json
Request:  { "loans": [...], "deposits": [...] }
Response: { "ok": true }
```

#### `PUT /api/admin/settings`
```json
Request:  { "name": "...", "shortName": "...", "contact": {...}, "social": {...}, "stats": {...} }
Response: { "ok": true }
```

#### `PUT /api/admin/team`
```json
Request:  { "action": "update-chairman", "name": "...", "title": "...", "message": "..." }
   or:    { "action": "update-member", "id": "...", "name": "...", "position": "...", "imageUrl": "..." }
Response: { "ok": true }
```

#### `POST /api/admin/upload`
```
Request:  FormData with "file" field
Response: { "path": "/uploads/filename.jpg" }
```

### Public Endpoints

#### `POST /api/public/apply`
```json
Request:  { "name": "...", "phone": "...", "email": "...", "product": "...", "message": "..." }
Response: { "ok": true }
```

#### `POST /api/public/contact`
```json
Request:  { "name": "...", "phone": "...", "email": "...", "subject": "...", "message": "..." }
Response: { "ok": true }
```

---

## 11. Admin Panel

### Access
- URL: `/admin`
- Login: `/admin/login`
- Protected by middleware (JWT cookie) + API-level auth

### Pages

| Route | Purpose | Features |
|---|---|---|
| `/admin` | Dashboard | Overview with links to all sections |
| `/admin/news` | News management | Create/edit/delete articles, set featured flag |
| `/admin/products` | Product management | Full CRUD, TagInput for features/requirements, auto-slug |
| `/admin/branches` | Branch management | Add/edit/delete branches, isHQ toggle |
| `/admin/team` | Team management | Chairman edit, member list with photo upload |
| `/admin/rates` | Rate management | Edit loan + deposit rate tables together |
| `/admin/settings` | Site settings | Name, contact info, social links, stats |
| `/admin/submissions` | Form submissions | Tabbed view (Applications/Contacts), status updates, expandable rows |

---

## 12. Styling Architecture

### Design Tokens (CSS Custom Properties)

```css
/* Colors */
--royal-crimson: #8B1A1A;        /* Primary brand red */
--royal-crimson-dark: #6d1313;   /* Hover state */
--royal-gold: #C9A84C;           /* Accent gold */
--royal-gold-light: #E8C97A;     /* Light gold variant */
--royal-dark: #0F0A04;           /* Page background */
--royal-deep: #1A1008;           /* Section alternate bg */
--royal-cream: #FAF6EE;          /* Primary text */
--royal-parchment: #F0E8D5;      /* Secondary text */
--royal-muted: #8A7F72;          /* Muted text */
--royal-border: rgba(201,168,76,0.2); /* Default border */

/* Typography */
--font-display: 'Playfair Display', Georgia, serif;  /* Headings */
--font-body: 'DM Sans', sans-serif;                   /* Body text */
--font-mono: 'DM Mono', monospace;                     /* Numbers, rates */

/* Motion */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);    /* Deceleration curve */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Balanced curve */

/* Spacing */
--space-xs: 4px → --space-3xl: 100px

/* Shadows */
--shadow-card: 0 4px 24px rgba(0,0,0,0.25);
--shadow-hover: 0 20px 60px rgba(0,0,0,0.35);
```

### CSS Module Convention

Every component has a co-located `.module.css` file. Class names are scoped at build time.

### Responsive Breakpoints

| Breakpoint | Target | Key Changes |
|---|---|---|
| 1024px | Tablet | 2-column → 1-column grids, hide desktop nav |
| 768px | Mobile | Reduced padding/spacing, single-column layouts |
| 480px | Small mobile | Tighter spacing, hero stats 2×2 grid, CTA full-width |

### Animations

| Animation | Trigger | Duration |
|---|---|---|
| `fadeUp` | Page load / scroll reveal | 0.6-0.8s |
| `cardReveal` | Tab switch (products) | 0.45s with stagger |
| `mobileFadeIn` | Mobile nav open | 0.35s with nth-child delay |
| `ticker` | Continuous | 35s linear infinite |
| `pulse` | Badge dot | 2s infinite |
| `spin` | Loading spinner | 0.6s linear infinite |
| Shimmer sweep | Card hover | 0.6s translateX |
| Accordion | Mobile nav / FAQ | 0.38s max-height |

---

## 13. Environment Configuration

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Example | Description |
|---|---|---|
| `AUTH_SECRET` | `a1b2c3...` (64 hex chars) | JWT signing secret |
| `ADMIN_USERS` | `[{"username":"admin",...}]` | Admin accounts with bcrypt hashes |

### Optional Variables

| Variable | Default | Description |
|---|---|---|
| `SESSION_EXPIRY_HOURS` | `8` | JWT cookie lifetime |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public URL for metadata |
| `SMTP_*` | — | Email notification config |

### Setting Up Admin Users

```bash
# 1. Generate a password hash
node -e "console.log(require('bcryptjs').hashSync('MySecurePassword123', 12))"
# Output: $2a$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 2. Generate AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: a1b2c3d4e5f6...

# 3. Set in .env.local
AUTH_SECRET=a1b2c3d4e5f6...
ADMIN_USERS=[{"username":"admin","passwordHash":"$2a$12$xxxx...","role":"admin"}]
```

---

## 14. Build & Deployment

### Local Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
```

### Production Build

```bash
npm run build        # Type-check + compile + optimize
npm run start        # Serve production build
```

### Deployment Checklist

1. **Environment:** Set all required env vars on the server
2. **AUTH_SECRET:** Generate a fresh secret for production (never reuse dev secret)
3. **ADMIN_USERS:** Set strong passwords, generate fresh bcrypt hashes
4. **NEXT_PUBLIC_SITE_URL:** Set to production domain
5. **data/ directory:** Ensure writable by the Node.js process
6. **public/uploads/:** Ensure writable for file uploads
7. **HTTPS:** Required for secure cookies and HSTS
8. **DNS:** Point domain to server IP

### Oracle Cloud Free Tier Deployment

The site is designed for Oracle Cloud's always-free tier:
- ARM-based compute instance (Ampere A1)
- No database cost (JSON files on disk)
- Reverse proxy with Nginx for HTTPS

```bash
# Example Nginx config
server {
    server_name royalcooperative.com.np;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 15. Maintenance Guide

### Adding a New Product

**Via Admin Panel:**
1. Log in at `/admin/login`
2. Go to `/admin/products`
3. Click "Add Product"
4. Fill in name (slug auto-generates), rate, description, features, requirements
5. Save

**Via Code (data.ts):**
Add to the appropriate array (`loanProducts`, `depositProducts`, or `microfinanceProducts`) in `src/lib/data.ts`.

### Adding a New Page

1. Create `src/app/your-page/page.tsx`
2. Add translation keys to `en.ts` and `ne.ts`
3. Add to navbar in `Navbar.tsx` (both desktop `navLinks` and mobile)
4. Add to footer links in `Footer.tsx`

### Adding a New Admin Section

1. Create API route at `src/app/api/admin/your-section/route.ts`
2. Use `requireAdminSession()` guard
3. Use `readJSON()`/`writeJSON()` for persistence
4. Create admin page at `src/app/admin/your-section/page.tsx`
5. Add navigation link in admin layout

### Updating Translations

1. Add new key to `src/lib/translations/en.ts`
2. Add corresponding Nepali translation to `ne.ts`
3. TypeScript will enforce both files stay in sync (compile error if key missing)

### Common Operations

```bash
# Check build health
npm run build

# Lint code
npm run lint

# Add a new admin user (generate hash first)
node -e "console.log(require('bcryptjs').hashSync('NewPassword', 12))"
# Then add to ADMIN_USERS in .env.local

# Rotate AUTH_SECRET (invalidates all sessions)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Update AUTH_SECRET in .env.local, restart server
```

### Backup Strategy

The `data/` directory contains all dynamic content. Back it up regularly:

```bash
tar -czf rmcl-data-backup-$(date +%Y%m%d).tar.gz data/
```

---

*Documentation generated April 1, 2026. Covers all 7 phases of the RMCL production upgrade.*
