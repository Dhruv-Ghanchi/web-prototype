# ReturnFlow Web App Prototype

A visually polished, non-functional prototype of the ReturnFlow **web app**. The web app serves four roles: **Supervisor, Seller, Buyer, Admin**. (The mobile app is a separate product for Delivery Agent, Hub Agent, and Admin — not built here.) The two products only share visual language, not role logic.

Shared visual language with mobile: ink/paper/amber/green/red palette, monospace for IDs/codes, identical status-badge colors, and the same **custody timeline** component styling.

## Scope

- **In scope:** All web screens in the spec — Login, Supervisor (7 screens), Seller (6), Buyer (6), Admin (5) — plus shared chrome (top bar, sidebar/nav, notification panel).
- **Out of scope:** Real auth, backend, payments, WhatsApp/SMS, uploads, and anything on the mobile app. All data is mocked in-memory; all actions resolve locally with toasts/animations. No Lovable Cloud.

## Design System

- **Palette (defined in `src/styles.css` `@theme`):** ink (near-black), paper (warm off-white bg), amber (pending/warning), green (verified/success), red (flagged/dispute), plus neutral greys.
- **Type:** Inter for UI; JetBrains Mono for SKUs, order numbers, UPI refs, item IDs.
- **Fonts** loaded via `<link>` in `__root.tsx`. All color usage goes through semantic tokens — no hardcoded `text-white` / `bg-black`.
- **Radius:** 6–8px. Flat, minimal shadows.
- **Status badges:** green = verified/completed, amber = pending/processing, red = flagged/disputed. Same convention everywhere.

## Routing (TanStack Start, file-based)

```
src/routes/
  __root.tsx                     shell, fonts, head meta
  index.tsx                      login (replaces template placeholder)
  _app.tsx                       authed layout: top bar + role sidebar/nav + <Outlet />
  _app/supervisor/
    dashboard.tsx, pricing-queue.tsx, expected-returns.tsx,
    pricing-rules.tsx, disputes.tsx, reports.tsx, settings.tsx
  _app/seller/
    dashboard.tsx, decisions.tsx, ledger.tsx, catalog.tsx,
    disputes.tsx, settings.tsx
  _app/buyer/
    home.tsx, browse.tsx, product.$id.tsx, checkout.tsx,
    orders.tsx, profile.tsx
  _app/admin/
    overview.tsx, users.tsx, fraud.tsx, notifications.tsx, settings.tsx
```

Role is stored in a small Zustand store + `localStorage`. `_app.tsx` reads it and renders the correct chrome — sidebar for Supervisor/Seller/Admin, wide top nav (with city selector + cart) for Buyer. Admin's top bar adds the hub/city scope selector.

## Login screen

Centered card: ReturnFlow wordmark, email + password, "Log In", "Forgot password?" link. Below the card, a small **"Demo accounts"** strip with 4 chips (Supervisor · Seller · Buyer · Admin) — clicking one fills credentials and enters that role, so reviewers can jump between roles quickly.

## Shared components (`src/components/`)

`TopBar`, `Sidebar` (collapsible), `BuyerNav`, `StatCard`, `DataTable` (sort + filter bar + row-click), `Drawer` (right slide-in for review/act), `Modal` (short forms), `StatusBadge`, `CustodyTimeline` (vertical dotted trail, reused in Supervisor/Seller/Buyer), `EvidenceGallery`, `NotificationPanel`, `EmptyState`, `Spinner`. Built on existing shadcn primitives (Sheet, Dialog, Table, Badge, DropdownMenu, Tabs, Button, Input).

## Mock data (`src/lib/mock/`)

Static TS modules for: pipeline items, pricing rules, disputes, sellers, listings, orders, ledger, notifications, hubs/cities, users by role. Enough breadth that every table/chart looks populated. A handful of generated product images stored in `src/assets/`.

## Charts (`recharts`)

- Supervisor Dashboard — "Pipeline by Status" bar chart.
- Seller Dashboard — 30-day returns line chart.
- Reports — hub throughput bar, aging table, category pie/bar.
- Admin Fraud — horizontal bar rankings for agents & buyers.

## Key screen behaviors

- **Supervisor Pricing Queue:** table → right drawer with gallery, grade badge, custody timeline, editable buyback + resale prices (pre-filled from rules), "Confirm Pricing & Send to Seller", "View pricing rule used" tooltip.
- **Seller Decisions:** card list. Each card: evidence strip, grade badge, two decision boxes (Buyback / Consign), inline "Raise Dispute" link, framer-motion slide-out + toast on decision.
- **Buyer Product Detail:** photo gallery labeled "Verified Condition Photos", grade badge with plain-language explainer, "Buy Now", expandable "Full Verification History" (same custody timeline), "What does 'returned item' mean?" info box.
- **Admin Ops Overview:** dense stat card row + per-hub table; hub selector in top bar filters everything.

## Dependencies

- `recharts`, `framer-motion`, `zustand`.

## Head metadata

`__root.tsx`: title "ReturnFlow — Verified returns, resold locally" + matching description/OG/Twitter. No `og:image` at root.

## Deliverable

A clickable prototype: log in as any of the 4 web roles → land on that role's dashboard → navigate every listed screen → open drawers/modals → see populated charts and tables. No real network calls.
