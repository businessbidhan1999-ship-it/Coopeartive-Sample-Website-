# RMCL — Royal Multipurpose Cooperative Society Ltd.

Production-ready website and admin panel for Royal Multipurpose Cooperative Society Ltd., a Nepali cooperative providing banking, microfinance, insurance, remittance, and agricultural services since 1998.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** CSS Modules with custom design tokens
- **Auth:** JWT (jose) + bcrypt password hashing
- **Storage:** JSON file-based persistence (no database required)
- **i18n:** English + Nepali (React Context, localStorage)

## Features

**Public Website**
- 24 pages — homepage, products, branches, news, about, contact, apply
- EMI and Fixed Deposit calculators
- Bilingual toggle (English / Nepali) with 250+ translated strings
- Fully responsive (desktop, tablet, mobile)
- Premium UI with scroll-reveal animations, shimmer effects, and micro-interactions

**Admin Panel** (`/admin`)
- JWT-authenticated with middleware route protection
- Full CRUD for: news, products, branches, team, interest rates, site settings
- Application and contact form submission management
- Photo upload for team members

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local — see "Environment Setup" below

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Setup

Generate required values:

```bash
# Generate AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate admin password hash
node -e "console.log(require('bcryptjs').hashSync('YourPassword', 12))"
```

Then edit `.env.local`:

```env
AUTH_SECRET=<64-char-hex-string>
ADMIN_USERS=[{"username":"admin","passwordHash":"$2a$12$...","role":"admin"}]
SESSION_EXPIRY_HOURS=8
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/                    # Pages and API routes
│   ├── admin/              # Protected admin panel (8 pages)
│   ├── api/                # 13 API endpoints (auth, admin CRUD, public forms)
│   └── [public pages]      # About, products, branches, news, contact, apply
├── components/
│   ├── layout/             # Navbar, Footer, Topbar, I18nWrapper
│   ├── sections/           # 9 homepage sections
│   └── ui/                 # ScrollReveal, Spinner
├── lib/
│   ├── auth.ts             # JWT session management
│   ├── json-store.ts       # JSON file I/O with write locking
│   ├── data.ts             # Static content (single source of truth)
│   ├── i18n-context.tsx    # Language provider
│   └── translations/       # en.ts, ne.ts
├── middleware.ts            # Auth guard for /admin/*
└── styles/globals.css       # Design tokens, utilities, animations

data/                        # Persistent JSON storage (server-side)
```

## Build & Deploy

```bash
npm run build    # Type-check + compile + optimize
npm run start    # Serve production build
```

Designed for Oracle Cloud free tier — no database costs. See `docs/PROJECT_DOCUMENTATION.md` for full deployment guide.

## Documentation

Complete technical documentation is in [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md), covering:
- Architecture diagram and request flows
- All 13 API endpoints with examples
- Authentication and security details
- Data layer and persistence
- i18n system
- Component catalog
- Styling architecture and design tokens
- Environment configuration
- Deployment checklist
- Maintenance guide

## Security

- JWT auth with httpOnly cookies (8h expiry)
- bcrypt password hashing (12 rounds)
- Middleware-protected admin routes
- Server-side input validation on all forms
- CSP, HSTS, X-Frame-Options, and other security headers
- Path traversal protection on file operations

## License

Private. All rights reserved.
