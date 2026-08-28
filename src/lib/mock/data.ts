// Mock data for the ReturnFlow prototype. All in-memory.

export const HUBS = [
  "Mumbai · Andheri",
  "Mumbai · Bandra",
  "Bengaluru · Indiranagar",
  "Bengaluru · HSR",
  "Delhi · Saket",
  "Pune · Koregaon Park",
];

export const CITIES = ["Mumbai", "Bengaluru", "Delhi", "Pune"];

export const CATEGORIES = ["Apparel", "Footwear", "Electronics", "Home", "Beauty"];

export type Grade = "A" | "B" | "C" | "D";
export type ItemStatus =
  | "Awaiting Pickup"
  | "In Transit"
  | "Arrived"
  | "Verified"
  | "Awaiting Pricing"
  | "Priced"
  | "Seller Decided"
  | "Listed"
  | "Sold";

export type PipelineItem = {
  id: string;
  sku: string;
  product: string;
  category: string;
  mrp: number;
  hub: string;
  city: string;
  grade: Grade;
  verifiedOn: string;
  status: ItemStatus;
  suggestedBuyback?: number;
  suggestedResale?: number;
  seller: string;
  agent: string;
  hubPerson: string;
  images: string[];
  note?: string;
};

const img = (seed: string, w = 600, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const PRODUCTS: Array<Omit<PipelineItem, "id" | "verifiedOn" | "status" | "hub" | "city" | "grade" | "suggestedBuyback" | "suggestedResale" | "agent" | "hubPerson" | "images">> = [
  { sku: "NT-HDY-BLK-M", product: "Nordic Fleece Hoodie — Black · M", category: "Apparel", mrp: 2499, seller: "Nordic Threads" },
  { sku: "AC-SNK-WHT-9", product: "Arc Runner Sneakers — White · UK 9", category: "Footwear", mrp: 4299, seller: "Arc Athletics" },
  { sku: "LM-KTL-1L", product: "Lumen Electric Kettle 1L", category: "Home", mrp: 1899, seller: "Lumen Home" },
  { sku: "PX-CAM-M2", product: "Pixl Mirrorless Camera M2", category: "Electronics", mrp: 68999, seller: "Pixl Optics" },
  { sku: "GL-SRM-30", product: "Glow Vitamin C Serum 30ml", category: "Beauty", mrp: 1499, seller: "Glow Labs" },
  { sku: "NT-TEE-NAV-L", product: "Nordic Base Tee — Navy · L", category: "Apparel", mrp: 899, seller: "Nordic Threads" },
  { sku: "AC-BAG-GRY", product: "Arc Duffel Bag — Grey", category: "Apparel", mrp: 3299, seller: "Arc Athletics" },
  { sku: "LM-BLD-500", product: "Lumen Blender 500W", category: "Home", mrp: 2799, seller: "Lumen Home" },
  { sku: "PX-LNS-50", product: "Pixl 50mm f/1.8 Lens", category: "Electronics", mrp: 12999, seller: "Pixl Optics" },
  { sku: "GL-MSK-100", product: "Glow Clay Mask 100g", category: "Beauty", mrp: 799, seller: "Glow Labs" },
  { sku: "NT-JKT-OLV-L", product: "Nordic Utility Jacket — Olive · L", category: "Apparel", mrp: 3899, seller: "Nordic Threads" },
  { sku: "AC-SHR-BLK-M", product: "Arc Training Shorts — Black · M", category: "Apparel", mrp: 1499, seller: "Arc Athletics" },
];

const AGENTS = ["Ravi K.", "Suman P.", "Nitin D.", "Kabir S."];
const HUB_PEOPLE = ["Aarav M.", "Isha R.", "Vikram T.", "Neha J."];
const GRADES: Grade[] = ["A", "B", "C", "D"];
const STATUSES: ItemStatus[] = [
  "Awaiting Pricing",
  "Priced",
  "Seller Decided",
  "Listed",
  "Sold",
  "Verified",
  "In Transit",
  "Arrived",
  "Awaiting Pickup",
];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

const RULES = {
  Apparel: { A: [0.55, 0.7], B: [0.4, 0.65], C: [0.25, 0.55], D: [0.15, 0.4] },
  Footwear: { A: [0.55, 0.7], B: [0.4, 0.6], C: [0.25, 0.5], D: [0.15, 0.35] },
  Electronics: { A: [0.7, 0.8], B: [0.55, 0.7], C: [0.35, 0.55], D: [0.2, 0.4] },
  Home: { A: [0.6, 0.75], B: [0.45, 0.65], C: [0.3, 0.5], D: [0.15, 0.35] },
  Beauty: { A: [0.5, 0.7], B: [0.35, 0.55], C: [0.2, 0.4], D: [0.1, 0.3] },
} as const;

export const PIPELINE: PipelineItem[] = Array.from({ length: 28 }, (_, i) => {
  const p = pick(PRODUCTS, i);
  const grade = pick(GRADES, i + 1);
  const category = p.category as keyof typeof RULES;
  const [bbPct, rsPct] = RULES[category][grade];
  const resale = Math.round(p.mrp * rsPct);
  const buyback = Math.round(resale * bbPct);
  const day = 26 - Math.floor(i * 0.7);
  return {
    ...p,
    id: `RF-${(24001 + i).toString()}`,
    hub: pick(HUBS, i),
    city: pick(CITIES, i),
    grade,
    verifiedOn: `2026-07-${String(Math.max(1, day)).padStart(2, "0")}`,
    status: pick(STATUSES, i * 3),
    suggestedBuyback: buyback,
    suggestedResale: resale,
    agent: pick(AGENTS, i),
    hubPerson: pick(HUB_PEOPLE, i + 2),
    images: [img(p.sku + "-1"), img(p.sku + "-2"), img(p.sku + "-3"), img(p.sku + "-4")],
    note: i % 5 === 0 ? "Minor packaging wear noted at hub." : undefined,
  };
});

// Awaiting pricing subset
export const AWAITING_PRICING = PIPELINE.filter((i) => i.status === "Awaiting Pricing" || i.status === "Verified");

// Expected returns (not physically arrived)
export const EXPECTED_RETURNS = PIPELINE.filter((i) =>
  ["Awaiting Pickup", "In Transit", "Arrived"].includes(i.status)
).slice(0, 8);

// Seller-facing decisions
export const SELLER_DECISIONS = PIPELINE.filter(
  (i) => i.status === "Priced" && i.seller === "Nordic Threads"
).slice(0, 6);

// If empty, take priced ones
if (SELLER_DECISIONS.length === 0) {
  SELLER_DECISIONS.push(...PIPELINE.filter((i) => i.suggestedBuyback).slice(0, 6));
}

// Buyer listings
export const LISTINGS = PIPELINE.filter((i) => i.suggestedResale && i.grade !== "D").slice(0, 14).map((i, idx) => ({
  ...i,
  price: i.suggestedResale!,
  daysLeft: 30 - (idx * 2) % 28,
}));

// Pricing rules
export type PricingRule = { id: string; category: string; grade: Grade; resalePct: number; buybackPct: number; updated: string };
export const PRICING_RULES: PricingRule[] = ([] as PricingRule[]).concat(
  ...CATEGORIES.map((cat) =>
    GRADES.map((g) => {
      const [bb, rs] = (RULES[cat as keyof typeof RULES] as Record<Grade, readonly [number, number]>)[g];
      return {
        id: `${cat}-${g}`,
        category: cat,
        grade: g,
        resalePct: Math.round(rs * 100),
        buybackPct: Math.round(bb * 100),
        updated: "2026-07-10",
      };
    })
  )
);

// Disputes
export type Dispute = {
  id: string;
  itemId: string;
  raisedBy: string;
  reason: string;
  date: string;
  status: "Open" | "Resolved";
  response?: string;
};
export const DISPUTES: Dispute[] = [
  { id: "D-4102", itemId: PIPELINE[2].id, raisedBy: "Nordic Threads", reason: "Grade seems harsh — item looks unworn.", date: "2026-07-14", status: "Open" },
  { id: "D-4103", itemId: PIPELINE[5].id, raisedBy: "Arc Athletics", reason: "Buyback price below rule table.", date: "2026-07-13", status: "Open" },
  { id: "D-4104", itemId: PIPELINE[8].id, raisedBy: "Pixl Optics", reason: "Missing accessory not reflected in grade.", date: "2026-07-12", status: "Resolved", response: "Adjusted grade to C and re-priced." },
];

// Ledger
export type LedgerEntry = {
  id: string;
  itemId: string;
  product: string;
  type: "Buyback Payout" | "Resale Settlement";
  amount: number;
  channel: string;
  status: "Processing" | "Completed";
  date: string;
  ageDays: number;
};
export const LEDGER: LedgerEntry[] = PIPELINE.slice(0, 12).map((it, i) => ({
  id: `TXN-${8100 + i}`,
  itemId: it.id,
  product: it.product,
  type: i % 2 === 0 ? "Buyback Payout" : "Resale Settlement",
  amount: Math.round((it.suggestedBuyback ?? 500) * (i % 2 === 0 ? 1 : 1.3)),
  channel: `UPI/${(1000000 + i * 137).toString().slice(0, 10)}`,
  status: i % 4 === 0 ? "Processing" : "Completed",
  date: `2026-07-${String(20 - i).padStart(2, "0")}`,
  ageDays: i % 4 === 0 ? 1 : 0,
}));

// Seller catalog
export const SELLER_CATALOG = [
  { sku: "NT-HDY-BLK-M", title: "Nordic Fleece Hoodie — Black · M", category: "Apparel", mrp: 2499, returnRate: 4.2 },
  { sku: "NT-TEE-NAV-L", title: "Nordic Base Tee — Navy · L", category: "Apparel", mrp: 899, returnRate: 6.1 },
  { sku: "NT-JKT-OLV-L", title: "Nordic Utility Jacket — Olive · L", category: "Apparel", mrp: 3899, returnRate: 3.4 },
  { sku: "NT-CAP-BLK", title: "Nordic Cap — Black", category: "Apparel", mrp: 699, returnRate: 2.1 },
];

// Buyer orders
export type BuyerOrder = {
  id: string;
  itemId: string;
  product: string;
  price: number;
  status: "Processing" | "Out for Delivery" | "Delivered";
  placed: string;
  eta: string;
  image: string;
};
export const BUYER_ORDERS: BuyerOrder[] = LISTINGS.slice(0, 5).map((l, i) => ({
  id: `ORD-${90210 + i}`,
  itemId: l.id,
  product: l.product,
  price: l.price,
  status: (["Delivered", "Out for Delivery", "Processing", "Delivered", "Delivered"] as const)[i],
  placed: `2026-07-${String(14 - i * 2).padStart(2, "0")}`,
  eta: "Today, 5–7 PM",
  image: l.images[0],
}));

// Notifications
export type Notification = {
  id: string;
  type: "pricing" | "decision" | "dispute" | "delivery" | "system";
  title: string;
  detail: string;
  when: string;
  read: boolean;
};
export const NOTIFICATIONS: Notification[] = [
  { id: "N1", type: "pricing", title: "3 items awaiting your pricing", detail: "Andheri hub verified batch #B-241", when: "12m ago", read: false },
  { id: "N2", type: "dispute", title: "New dispute from Nordic Threads", detail: "Item RF-24003 grade contested", when: "1h ago", read: false },
  { id: "N3", type: "decision", title: "Seller consigned RF-24009", detail: "Now listed on Bengaluru storefront", when: "3h ago", read: true },
  { id: "N4", type: "delivery", title: "Order ORD-90211 out for delivery", detail: "Arc Runner Sneakers · Anita Sharma", when: "5h ago", read: true },
  { id: "N5", type: "system", title: "Weekly report ready", detail: "Hub Throughput · Jul 8–14", when: "1d ago", read: true },
];

// Admin: users
export const USERS = {
  Agents: [
    { name: "Ravi K.", hub: "Mumbai · Andheri", status: "Active", tasks: 142 },
    { name: "Suman P.", hub: "Bengaluru · Indiranagar", status: "Active", tasks: 128 },
    { name: "Nitin D.", hub: "Delhi · Saket", status: "Inactive", tasks: 94 },
    { name: "Kabir S.", hub: "Pune · Koregaon Park", status: "Active", tasks: 111 },
  ],
  "Hub Persons": [
    { name: "Aarav M.", hub: "Mumbai · Andheri", status: "Active", verified: 302 },
    { name: "Isha R.", hub: "Bengaluru · HSR", status: "Active", verified: 271 },
    { name: "Vikram T.", hub: "Delhi · Saket", status: "Active", verified: 189 },
  ],
  Supervisors: [
    { name: "Priya Nair", hub: "Mumbai · Andheri", status: "Active", avgTurnaround: "3.2h" },
    { name: "Farah Q.", hub: "Bengaluru · Indiranagar", status: "Active", avgTurnaround: "4.1h" },
  ],
  Sellers: [
    { name: "Nordic Threads", hub: "—", status: "Active", items: 214 },
    { name: "Arc Athletics", hub: "—", status: "Active", items: 178 },
    { name: "Lumen Home", hub: "—", status: "Active", items: 96 },
    { name: "Pixl Optics", hub: "—", status: "Pending KYC", items: 12 },
  ],
} as const;

// Admin: fraud
export const FLAGGED_ITEMS = PIPELINE.slice(0, 6).map((i, idx) => ({
  ...i,
  reason: ["Photo mismatch", "Weight anomaly", "Repeat return buyer", "Grade dispute", "Late scan", "Duplicate SKU"][idx],
  flaggedBy: ["Auto", "Hub Person", "Auto", "Supervisor", "Auto", "Auto"][idx],
}));

export const AGENT_DISCREPANCIES = [
  { name: "Nitin D.", rate: 8.2 },
  { name: "Kabir S.", rate: 4.1 },
  { name: "Ravi K.", rate: 2.7 },
  { name: "Suman P.", rate: 1.9 },
];
export const BUYER_RETURN_RATE = [
  { name: "buyer_2214", rate: 41 },
  { name: "buyer_0912", rate: 28 },
  { name: "buyer_5501", rate: 19 },
  { name: "buyer_8843", rate: 12 },
];

// Notifications log (admin)
export const NOTIFICATION_LOG = Array.from({ length: 14 }, (_, i) => ({
  id: `L-${5000 + i}`,
  recipient: [
    "+91 98•••• 42",
    "+91 90•••• 11",
    "+91 88•••• 07",
    "priya@returnflow.in",
    "raj@nordicthreads.in",
  ][i % 5],
  message: [
    "Pickup scheduled 4–6 PM",
    "Return verified · Grade B",
    "Payout ₹1,240 initiated",
    "New pricing task assigned",
    "Order dispatched",
  ][i % 5],
  channel: (i % 3 === 0 ? "WhatsApp" : i % 3 === 1 ? "SMS (fallback)" : "In-App") as string,
  fellBack: i % 3 === 1,
  timestamp: `2026-07-${String(15 - (i % 10)).padStart(2, "0")} 1${i % 9}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}`,
}));

// Pipeline chart data (supervisor dashboard)
export const PIPELINE_CHART = [
  { stage: "Verified", count: 42 },
  { stage: "Priced", count: 28 },
  { stage: "Seller Decided", count: 19 },
  { stage: "Listed", count: 34 },
  { stage: "Sold", count: 22 },
];

// Seller 30d line
export const SELLER_RETURNS_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  returns: Math.round(4 + Math.sin(i / 3) * 3 + (i % 5)),
}));

// Reports
export const HUB_THROUGHPUT = HUBS.map((h, i) => ({
  hub: h.split(" · ")[1],
  processed: 40 + ((i * 17) % 60),
}));
export const AGING = [
  { stage: "Awaiting Pricing", avgHours: 3.4 },
  { stage: "Seller Decision", avgHours: 12.1 },
  { stage: "Listing", avgHours: 1.2 },
  { stage: "Sold", avgHours: 96.5 },
];
export const CATEGORY_BREAKDOWN = CATEGORIES.map((c, i) => ({
  category: c,
  count: [82, 61, 44, 33, 28][i],
}));

// Custody timeline (shared)
export type TimelineStep = {
  label: string;
  who: string;
  when: string;
  status: "done" | "current" | "upcoming";
  note?: string;
};

export function timelineFor(item: PipelineItem): TimelineStep[] {
  const base: TimelineStep[] = [
    { label: "Pickup requested", who: `Agent · ${item.agent}`, when: "Jul 12 · 10:14", status: "done" },
    { label: "Collected from buyer", who: `Agent · ${item.agent}`, when: "Jul 12 · 14:02", status: "done" },
    { label: "Received at hub", who: `Hub · ${item.hub}`, when: "Jul 12 · 17:20", status: "done" },
    { label: "Verified & graded", who: `Hub Person · ${item.hubPerson}`, when: `Verified · Grade ${item.grade}`, status: "done" },
    { label: "Pricing", who: "Supervisor", when: "In review", status: item.status === "Awaiting Pricing" ? "current" : "done" },
    { label: "Seller decision", who: `Seller · ${item.seller}`, when: item.status === "Seller Decided" ? "Consigned" : "Awaiting", status: item.status === "Seller Decided" || item.status === "Listed" || item.status === "Sold" ? "done" : item.status === "Priced" ? "current" : "upcoming" },
    { label: "Listed on storefront", who: `${item.city} storefront`, when: "—", status: item.status === "Listed" || item.status === "Sold" ? "done" : "upcoming" },
    { label: "Sold & delivered", who: "Delivery agent", when: "—", status: item.status === "Sold" ? "done" : "upcoming" },
  ];
  return base;
}

export function findItem(id: string) {
  return PIPELINE.find((i) => i.id === id);
}
