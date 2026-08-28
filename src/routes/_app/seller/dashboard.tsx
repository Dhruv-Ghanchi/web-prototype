import { createFileRoute, Link } from "@tanstack/react-router";
import { StatCard } from "@/components/stat-card";
import { SELLER_DECISIONS, LEDGER, LISTINGS, SELLER_RETURNS_30D } from "@/lib/mock/data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/seller/dashboard")({
  component: SellerDashboard,
});

function SellerDashboard() {
  const [showTour, setShowTour] = useState(true);
  const totalPaid = LEDGER.filter((l) => l.status === "Completed").reduce((s, l) => s + l.amount, 0);
  const inResale = LISTINGS.length;
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nordic Threads · Seller workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {SELLER_DECISIONS.length} return{SELLER_DECISIONS.length === 1 ? "" : "s"} awaiting your decision.
        </p>
      </div>

      {showTour && (
        <Alert className="bg-amber-soft border-amber/30 text-amber-foreground">
          <Info className="h-4 w-4 !text-amber-foreground" />
          <AlertTitle className="text-amber-foreground">Welcome to your new Returns Dashboard!</AlertTitle>
          <AlertDescription className="text-amber-foreground/90 mt-2">
            You now have two choices for every verified returned item:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Buyback:</strong> We instantly pay you a lower cash amount and take ownership.</li>
              <li><strong>Consign:</strong> We list it on our local storefront. You earn a higher profit share if it sells within 30 days.</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4 border-amber/50 hover:bg-amber/10" onClick={() => setShowTour(false)}>
              Got it, let's start
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Decisions" value={SELLER_DECISIONS.length} tone="amber" to="/seller/decisions" />
        <StatCard label="Total Paid Out" value={`₹${totalPaid.toLocaleString()}`} hint="This month" tone="green" />
        <StatCard label="In Resale" value={inResale} hint="Listed items" />
        <StatCard label="Avg. Turnaround" value="9.4h" hint="Decision to payout" />
      </div>

      <section className="rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Returns received · last 30 days</h2>
            <p className="text-xs text-muted-foreground">Spot products getting returned unusually often</p>
          </div>
          <Link to="/seller/catalog" className="text-xs text-muted-foreground hover:text-foreground">
            View catalog →
          </Link>
        </div>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SELLER_RETURNS_30D} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
              <Line type="monotone" dataKey="returns" stroke="var(--color-ink)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
