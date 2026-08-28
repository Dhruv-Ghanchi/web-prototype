# ReturnFlow — Web App Design Specification
## Supervisor · Seller · Buyer · Admin

Same visual language as the mobile app (ink/paper/amber/green/red, monospace for IDs/codes) so the two products feel like one system, not two unrelated tools.

---

## 0. App Shell — Present on Every Screen

### 0.1 Login Screen
- Centered card, username + password fields (or email + password), "Log In" button.
- Below the form: small text "Forgot password?" link.
- After login, the app reads the account's role and shows that role's layout automatically — same account-to-role logic as mobile, no manual role picker.

### 0.2 Top Bar (every screen after login)
- Left: ReturnFlow logo/name + current section title.
- Right, in order: search icon (context-aware — searches items/orders relevant to the current role), notification bell with badge count, account menu (avatar circle → dropdown: Profile, Settings, Logout).
- For Admin specifically: a **hub/city selector dropdown** appears here too, since Admin can view data scoped to "All Hubs" or drill into one specific hub/city.

### 0.3 Left Sidebar (role-specific — see each role's section below)
- Collapsible (icon-only collapsed state for smaller screens/more workspace).
- Active section: filled background bar, ink-colored icon+text; inactive: grey icon+text.
- Sidebar persists across all pages within that role — this is the primary navigation, the top bar is secondary.

### 0.4 Notification Panel
- Same pattern as mobile: dropdown from the bell icon, list of recent alerts by type, click to jump to the relevant record, "Mark all read" link.

---

## 1. SUPERVISOR

**Sidebar:** `Dashboard · Pricing Queue · Expected Returns · Pricing Rules · Disputes · Reports · Settings`

### 1.1 Dashboard
- **Layout:** top row of 4 stat cards (Awaiting Pricing, Expected This Week, Open Disputes, Flags from Hub), then two side-by-side panels below: a small "Recent Activity" feed (left, 60% width) and a "Pipeline by Status" bar chart (right, 40% width) showing counts of items at each stage (verified, priced, seller-decided, listed, sold).
- Each stat card is clickable and jumps straight to the filtered relevant screen (e.g., clicking "Awaiting Pricing" → Pricing Queue).

### 1.2 Pricing Queue
- **Layout:** a data table, one row per item, columns: Product, City/Hub, Hub Person's Grade (badge), Date Verified, Action button.
- Table supports column-sort (click header) and a filter bar above it (by city, by category, by grade).
- **Row click → Pricing Drawer** slides in from the right:
  - Product photo gallery (from Hub Person's evidence), condition grade shown prominently as a badge.
  - Full custody timeline (vertical dotted-line trail) showing every step from pickup to now — this is the same visual component used across all role views, so the "trust trail" always looks and feels identical wherever it appears.
  - Two input fields: **Buyback Price** (what to offer the seller) and **Resale Price** (what to list it for), each pre-filled with a suggested number computed from the Pricing Rules (editable — Supervisor can override).
  - **"Confirm Pricing & Send to Seller"** button — this is what moves the item into the Seller's decision queue.
  - A small link "View pricing rule used" opens a tooltip showing which rule/formula generated the suggested numbers, so pricing isn't a black box even internally.

### 1.3 Expected Returns
- **Purpose:** returns already initiated (known in advance) but not yet physically arrived at a hub.
- **Layout:** table — Product, Expected Hub, Initiated Date, Days Until Expected Arrival, Status (`Awaiting Pickup` / `In Transit` / `Arrived`).
- Lets the Supervisor pre-plan pricing/capacity before the item shows up physically — clicking a row shows whatever info is already known (seller, category, original order) even though the physical evidence doesn't exist yet.

### 1.4 Pricing Rules
- **Layout:** table of rules — Category, Grade, Resale % of MRP, Buyback % of Resale, Last Updated.
- **"Add Rule"** / **"Edit"** opens a simple form modal: category dropdown, grade dropdown, two percentage input fields, save button.
- This is what feeds the pre-filled suggestions in the Pricing Queue drawer — so Supervisors mostly *confirm* numbers rather than calculating every single one by hand, only overriding when a specific item needs it.

### 1.5 Disputes
- **Layout:** table — Item, Raised By (Seller), Reason, Date, Status (`Open`/`Resolved`).
- Row click → drawer showing the full custody timeline + the dispute reason + a text box for the Supervisor's response + buttons **"Adjust Pricing"** (jumps back into the pricing fields) or **"Uphold Original Decision"** (closes the dispute with a note).

### 1.6 Reports
- **Layout:** a set of filterable report views (date range picker top of page): Hub Throughput (items processed per hub per day, bar chart), Aging Report (how long items sit at each stage, table), Category Breakdown (pie/bar of what's being returned most).
- **"Export"** button (CSV) on each report table.

### 1.7 Settings
- Supervisor's own profile info, notification preferences (which alert types come via app vs. also WhatsApp/SMS), password change.

---

## 2. SELLER

**Sidebar:** `Dashboard · Returns/Decisions · Ledger · Catalog · Disputes · Settings`

### 2.1 Dashboard
- Stat cards: Pending Decisions, Total Paid Out, Items Currently in Resale, Average Decision Turnaround Time.
- Below: a simple line chart of "Returns received over time" (last 30 days) — helps the seller notice if a particular product is getting returned unusually often, which is useful information for them beyond just this platform.

### 2.2 Returns/Decisions
- **Layout:** card list (not a dense table, since each card needs to show enough evidence to decide confidently) — one card per item awaiting a decision.
- **Each card:**
  - Product name, SKU, city, condition grade badge.
  - Small evidence thumbnail strip (click any to view full-screen gallery + video).
  - Two side-by-side decision boxes: **"Sell to Client"** (shows buyback price, one click = **Accept Buyback**) and **"Consign for Resale"** (shows resale price + profit-share %, one click = **Consign Instead**).
  - A small "Something's wrong with this grading/price?" link opens the **Raise Dispute** form inline (reason text box + submit) instead of forcing a decision.
- **After a decision is made,** the card animates out of the list and a toast confirms the action + shows what happens next ("Payout will arrive within a few hours" for buyback, or "Listed on the storefront — 30 day window started" for consign).

### 2.3 Ledger
- **Layout:** table — Item, Type (Buyback Payout / Resale Settlement), Amount, Channel (UPI reference), Status (`Processing`/`Completed`, color-coded badge), Date, Age (days).
- Filter bar: status, date range, item type.
- Top of page: 3 small summary numbers (Total Paid This Month, Pending Amount, Average Payout Time) — the direct answer to "is this actually faster than what I had before," which is the core selling point of the whole platform for a seller.

### 2.4 Catalog
- **Layout:** table of the seller's products — SKU, Title, Category, MRP, Return Rate (%).
- Click a row to edit basic info, or view a simple graph of that specific product's return history — again, useful business insight for the seller beyond just processing returns.

### 2.5 Disputes
- List of disputes the seller has raised, status, Supervisor's response once given.

### 2.6 Settings
- Business profile, KYC status (badge: Verified/Pending/Rejected with reason if rejected), UPI payout details (editable, with a "Verify" step before saving a new UPI ID), notification preferences.

---

## 3. BUYER

**Navbar (not sidebar — this is a shopping site, wide top nav):** `Home · Browse · Orders · Profile`, plus a persistent **city selector** always visible near the logo (since listings are always city-scoped) and a cart/bag icon.

### 3.1 Home
- **Layout:** hero-ish banner strip explaining the concept briefly ("Genuine returned products, verified and sold locally"), then a horizontal-scroll "Recently Listed" row, then a grid of listings for the buyer's selected city.
- Each **product card:** thumbnail, title, condition grade badge, price, small "X days left" tag (since resale listings have a 30-day window).

### 3.2 Browse
- **Layout:** left filter panel (category checkboxes, price range slider, condition grade checkboxes) + main product grid on the right.
- City selector still applies here (filtering is always within the already-chosen city, category/price/grade are the only listing-level filters).
- Sort dropdown top-right of the grid: Price Low-High, Price High-Low, Newest, Ending Soon.

### 3.3 Product Detail
- **Layout:** left column = photo gallery (from the actual evidence photos, clearly labeled "Verified Condition Photos" so it's obvious these are real, not stock images), right column = title, price, condition grade badge with a short plain-language description of what that grade means, **"Buy Now"** button.
- Below the main fold: an expandable **"Full Verification History"** section showing the same custody timeline component used in the Supervisor/Seller views — letting a buyer literally see the item's journey (collected → verified at hub → priced → listed) if they want that level of trust before buying.
- A short **"What does 'returned item' mean here?"** info box explaining the model briefly, since this is a new concept for buyers unfamiliar with it.

### 3.4 Checkout
- **Layout:** simple single-page checkout — delivery address form, order summary (item, price), **"Pay via UPI"** button which triggers a UPI payment flow.
- Confirmation screen after payment: order number, expected delivery window, note "A delivery agent will bring this directly to you."

### 3.5 Orders
- **Layout:** list of past orders, each showing product, price paid, status (`Processing`/`Out for Delivery`/`Delivered`), and for delivered orders, a link to view the item's full verification history again.
- Status updates live as the assigned Delivery Agent progresses through their Delivery Flow steps on mobile — this is the buyer-facing mirror of that same underlying event.

### 3.6 Profile
- Saved delivery address(es), phone number, UPI details (optional, for faster checkout), logout.

---

## 4. ADMIN (Web — Full Control)

**Sidebar:** `Ops Overview · User Management · Fraud & Discrepancies · Notifications Log · Settings`, plus the hub/city scope selector in the top bar mentioned in section 0.2.

### 4.1 Ops Overview
- **Layout:** the most data-dense screen in the system — top row of stat cards (Total Items in Pipeline, Total Payouts This Month, Total Resale Revenue, Open Flags, Open Disputes) scoped to whichever hub/city is selected (or "All").
- Below: a table breaking down activity by city/hub (Items Processed, Avg. Turnaround, Revenue) — this is what lets Admin spot which hub is underperforming or overloaded at a glance.

### 4.2 User Management
- **Layout:** tabs for each role type — `Agents · Hub Persons · Supervisors · Sellers` — each a table with name, hub/assignment, status (Active/Inactive), and an "Add New" button that opens a form to create a new account (which then gets sent an invite/credentials).
- Clicking a person opens their profile with basic performance stats relevant to their role (e.g. an Agent's completed task count, a Supervisor's average pricing turnaround).

### 4.3 Fraud & Discrepancies (All Hubs)
- **Layout:** same structure as the mobile Admin's lighter version, but full detail — a table of flagged items across every hub, filterable by hub/city, plus two ranked lists: "Agents by discrepancy rate" and "Buyers by return rate" (both simple horizontal bar-chart style rankings), so patterns across the whole network are visible, not just one hub.

### 4.4 Notifications Log
- **Layout:** a table of every WhatsApp/SMS/system notification sent across the platform — recipient, message, channel used, whether it fell back from WhatsApp to SMS, timestamp. Mainly a debugging/audit tool for Admin to confirm the notification system is actually working, not a screen other roles need.

### 4.5 Settings
- Platform-wide settings: default pricing rule access, hub list management (add/edit hub details, geofence radius), language options available in the mobile app.

---

## Appendix — Shared Component Behavior Reference

- **Data tables:** sortable columns, filter bar above, row-click opens a detail drawer/modal rather than navigating to a whole new page — keeps the person's place in the list intact when they close the drawer.
- **Drawers vs. Modals:** drawers (slide in from the right, full height) are used for "review/act on this specific record" actions (pricing, grading, disputes); centered modals are used for short, single-purpose forms (add a rule, add a user).
- **Status badges:** identical color convention to mobile — green/amber/red mean the same thing everywhere in both apps.
- **Custody Timeline component:** the vertical dotted-line trail is the one visual element deliberately reused in Supervisor, Seller, and Buyer views — reinforcing that this is the same underlying trust record just viewed from different roles' perspectives.
- **Loading/empty/error states:** same conventions as mobile — inline spinners over full-page blockers, plain-language error text, clear empty-state messaging with a next action where relevant (e.g. "No disputes right now" rather than a blank table).
