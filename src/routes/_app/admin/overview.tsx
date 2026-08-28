import { createFileRoute } from "@tanstack/react-router";
import { StatCard } from "@/components/stat-card";
import { PIPELINE, DISPUTES, FLAGGED_ITEMS, HUBS, HUB_THROUGHPUT, LEDGER } from "@/lib/mock/data";
import { useSession } from "@/lib/store";

export const Route = createFileRoute("/_app/admin/overview")({ component: Overview });

function Overview() {
  const { hubScope } = useSession();
  const totalPayouts = LEDGER.reduce((s, l) => s + l.amount, 0);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ops overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Scope: <span className="font-medium text-foreground">{hubScope}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Items in pipeline" value={PIPELINE.length} />
        <StatCard label="Payouts (month)" value={`₹${totalPayouts.toLocaleString()}`} tone="green" />
        <StatCard label="Resale revenue" value="₹1,84,220" tone="green" />
        <StatCard label="Open flags" value={FLAGGED_ITEMS.length} tone="red" />
        <StatCard label="Open disputes" value={DISPUTES.filter((d) => d.status === "Open").length} tone="amber" />
      </div>

      <section className="rounded-lg border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-semibold">By hub</h2>
          <p className="text-xs text-muted-foreground">Spot the hub that's underperforming or overloaded.</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hub</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Items processed</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Avg turnaround</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {HUBS.map((h, i) => (
              <tr key={h} className="border-t">
                <td className="px-4 py-3 font-medium">{h}</td>
                <td className="px-4 py-3 text-right font-mono">{HUB_THROUGHPUT[i]?.processed ?? 0}</td>
                <td className="px-4 py-3 text-right font-mono">{(3 + (i % 4) * 0.7).toFixed(1)}h</td>
                <td className="px-4 py-3 text-right font-mono">₹{(38200 + i * 4200).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
