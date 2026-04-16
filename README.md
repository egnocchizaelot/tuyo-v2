# Tuyo v2

Collaborative donations platform — Tuyo.uy

## Project Structure

```
tuyo-v2/
├── app/                            # Next.js App Router
│   ├── (auth)/                     # Auth pages (login, register)
│   ├── (main)/                     # Main app pages
│   │   ├── feed/                   # Listing feed
│   │   ├── donations/              # Donations
│   │   ├── chat/                   # Private chat
│   │   ├── forums/                 # Forums
│   │   ├── notifications/          # Notifications
│   │   ├── user/                   # User profiles
│   │   └── map/                    # Map view
│   └── (admin)/                    # Admin panel
├── api/                            # API routes (replaces Django backend)
├── components/                     # Shared React components
├── lib/                            # Utilities, DB client, auth, realtime
├── prisma/                         # Prisma schema & migrations
├── legacy/                         # Existing Tuyo v1 code (reference)
│   ├── api/                        # Backend — Django REST Framework + MySQL
│   │   └── ab.config
│   ├── web/                        # Frontend — AngularJS 1.x SPA
│   │   └── ab.config
│   └── functions/                  # Cloud functions — emails and notifications
│       └── ab.config
└── specs/                          # Specs for the Abstract Architect pipeline
```

## v2 Technology Stack

### Web + API (unified Next.js fullstack)

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |
| Realtime | Socket.io (migrated from v1) |
| Package manager | pnpm |
| Unit tests | Vitest |
| E2E tests | Playwright CLI |

### Legacy v1 Stack (reference only)

The `legacy/` directory contains the original Tuyo v1 codebase, kept as reference during migration:

| Component | Technology |
|---|---|
| Backend | Django 1.8 + Django REST Framework (Python 2.7) |
| Frontend | AngularJS 1.4 SPA |
| Database | MySQL 5.7 |
| Build tools | Grunt + Bower |
| CSS | SCSS + Bootstrap 3 |
| Realtime | Socket.io |

### Key Changes from v1 to v2

- **Python 2.7 Django + AngularJS** → **TypeScript Next.js fullstack** — single language across the entire stack
- **MySQL** → **PostgreSQL** with Prisma ORM and type-safe queries
- **Grunt + Bower** → **pnpm** with Next.js native bundling
- **Bootstrap 3 + SCSS** → **Tailwind CSS v4** utility-first styling
- **Jasmine/Karma** → **Vitest** for unit tests + **Playwright** for E2E
- **Separate frontend/backend deploys** → **Unified Next.js deployment** with API routes

## Architect

This project is structured to be processed by Abstract Architect. The legacy sub-projects (`legacy/web/`, `legacy/api/`, `legacy/functions/`) each have their own `ab.config` serving as reference for the v1 stack being migrated.

To run the pipeline:

```bash
python architect/main.py /path/to/tuyo-v2 --auto
```
