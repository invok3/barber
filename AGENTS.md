<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.12) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Barber Reservation App

## Core Conventions

- **Language:** Arabic (AR), RTL only. All UI text is hardcoded Arabic. No i18n library, no English/LTR support.
- **Font:** Tajawal (Arabic-optimized) via `next/font/google` with `subsets: ["arabic", "latin"]`.
- **All pages are `'use client'`** — no server components, no server actions.
- **Route groups by role:** `(admin)`, `(customer)`, `(staff)` — one folder per role, each with its own layout + provider composition.
- **Layout patterns:** Customer-facing is mobile-first portrait (`w-screen landscape:w-[50vh] max-w-[50vh]`). Control panel (admin) will be widescreen/landscape.
- **No external state/data libraries** — only React `useState`, `useContext`, `useMemo`, `useCallback`.
- **No database** — all data is mocked in `data/` directory (barbers, services, reservations).
- **No auth** — `auth-provider.tsx` is a stub that sets `isAuthenticated = true` on any login attempt.
- **No middleware** — no `middleware.ts`, no route protection.
- **No API routes** — `/reserve` page calls `/api/queue/status?barber=...` but no handler exists (404).
- **Path alias:** `@/` maps to project root.
- **Tailwind CSS v4:** `@import "tailwindcss"` syntax in `globals.css`, `@theme inline` for CSS custom properties.

## Route Groups & Pages

| Route | File | Role |
|---|---|---|
| `/` | `app/page.tsx` | Public landing |
| `/reserve` | `app/(customer)/reserve/page.tsx` | Customer booking form |
| `/status` | `app/(customer)/status/page.tsx` | Customer queue status |
| `/login` | `app/(staff)/login/page.tsx` | Staff login |
| `/queue` | `app/(staff)/queue/page.tsx` | Staff queue management |
| (admin) | `app/(admin)/layout.tsx` | Admin group **no pages yet** |

## Provider Composition Pattern

Each role group composes its providers via `context/composer.tsx` (uses `reduceRight`):
- **Customer:** StaffProvider → ServiceProvider
- **Staff:** AuthProvider → QueueProvider → ServiceProvider → StaffProvider
- **Admin:** AuthProvider → QueueProvider

## Data Flow

- `data/barbers.ts`, `data/services.ts`, `data/reservations.ts` export typed arrays (mock data).
- Context providers initialize state from mock data via `useState`.
- Queue provider manages reservations CRUD (all in-memory).
- Data never persists — refreshes reset state.

## Project Tree

```
app/
├── globals.css              # Tailwind v4 + font-family
├── layout.tsx               # Root: <html lang="ar" dir="rtl">
├── page.tsx                 # Landing page
├── (admin)/layout.tsx
├── (customer)/
│   ├── layout.tsx
│   ├── reserve/page.tsx
│   └── status/page.tsx
├── (staff)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   └── queue/
│       ├── page.tsx
│       └── _components/
│           ├── actions-dropdown.tsx
│           └── card.tsx
components/
├── modals/
│   ├── cancel-modal.tsx
│   ├── rearrange-modal.tsx
│   └── request-modal.tsx
context/
├── composer.tsx             # reduceRight provider nesting
├── admin-providers.tsx
├── customer-providers.tsx
├── staff-providers.tsx
└── providers/
    ├── auth-provider.tsx    # Stub: login always succeeds
    ├── queue-provider.tsx   # CRUD + accepting toggle + filtering
    ├── service-provider.tsx # Services CRUD
    └── staff-provider.tsx   # Barbers list + selection
data/
├── barbers.ts
├── reservations.ts
└── services.ts
types/
├── index.ts
├── barber.ts
├── reservation.ts
└── service.ts
lib/
└── time.ts                  # Arabic AM/PM: ص/م
```

## Dependencies

- **next** 16.2.12, **react** 19.2.4, **react-dom** 19.2.4
- **tailwindcss** ^4, **@tailwindcss/postcss** ^4
- No Prisma, no ORM, no auth, no i18n, no form libraries.

## Key Files to Read Before Making Changes

1. `app/globals.css` — base styles and theme
2. `app/layout.tsx` — root HTML structure and font loading
3. The layout of the group you're modifying (e.g., `app/(customer)/layout.tsx`)
4. The relevant provider under `context/providers/`
5. The relevant data mock under `data/`
6. The relevant type under `types/`
7. `context/composer.tsx` — how providers are composed
