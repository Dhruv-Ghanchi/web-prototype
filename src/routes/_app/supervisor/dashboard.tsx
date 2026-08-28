import { createFileRoute, Link } from "@tanstack/react-router";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { AWAITING_PRICING, EXPECTED_RETURNS, DISPUTES, FLAGGED_ITEMS, PIPELINE_CHART, PIPELINE, NOTIFICATIONS } from "@/lib/mock/data";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/supervisor/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const openDisputes = DISPUTES.filter((d) => d.status === "Open").length;
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Good morning, Priya</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {AWAITING_PRICING.length} items need pricing across your hubs today.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Awaiting Pricing"
          value={AWAITING_PRICING.length}
          hint="Verified & waiting"
          tone="amber"
          to="/supervisor/pricing-queue"
        />
        <StatCard
          label="Expected This Week"
          value={EXPECTED_RETURNS.length}
          hint="Not yet at hub"
          to="/supervisor/expected-returns"
        />
        <StatCard
          label="Open Disputes"
          value={openDisputes}
          tone="red"
          to="/supervisor/disputes"
        />
        <StatCard
          label="Flags from Hub"
          value={FLAGGED_ITEMS.length}
          tone="red"
          hint="Need review"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <section className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <Link to="/supervisor/pricing-queue" className="text-xs text-muted-foreground hover:text-foreground">
              View queue →
            </Link>
          </div>
          <ul className="mt-4 divide-y">
            {NOTIFICATIONS.concat(PIPELINE.slice(0, 3).map((p) => ({
              id: p.id,
              type: "pricing" as const,
              title: `${p.product}`,
              detail: `${p.hub} · Grade ${p.grade} · ${p.status}`,
              when: p.verifiedOn,
              read: true,
            }))).slice(0, 7).map((n) => (
              <li key={n.id} className="py-2.5 flex items-start gap-3">
                <StatusBadge variant={n.type === "dispute" ? "flagged" : n.type === "pricing" ? "pending" : "completed"}>
                  {n.type}
                </StatusBadge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.detail}</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">{n.when}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold">Pipeline by status</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Items currently in each stage</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PIPELINE_CHART} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="stage" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12, color: "var(--color-foreground)" }}
                  itemStyle={{ color: "var(--color-foreground)", fontWeight: 500 }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-ink)" 
                  radius={[4, 4, 0, 0]} 
                  onClick={(data) => {
                    toast.info(`Filtering view for ${data.stage}... (Simulated)`);
                  }}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
