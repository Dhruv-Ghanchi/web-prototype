import { createFileRoute } from "@tanstack/react-router";
import { FLAGGED_ITEMS, AGENT_DISCREPANCIES, BUYER_RETURN_RATE } from "@/lib/mock/data";
import { GradeBadge, StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/admin/fraud")({ component: Fraud });

function Fraud() {
  const max1 = Math.max(...AGENT_DISCREPANCIES.map((a) => a.rate));
  const max2 = Math.max(...BUYER_RETURN_RATE.map((a) => a.rate));
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Fraud & discrepancies</h1>
        <p className="text-sm text-muted-foreground mt-1">Flagged items across every hub, plus patterns worth watching.</p>
      </div>

      <section className="rounded-lg border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b"><h2 className="text-sm font-semibold">Flagged items · all hubs</h2></div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hub</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grade</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reason</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Flagged by</th>
            </tr>
          </thead>
          <tbody>
            {FLAGGED_ITEMS.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-medium">{f.product}</p>
                  <p className="text-xs font-mono text-muted-foreground">{f.id}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{f.hub}</td>
                <td className="px-4 py-3"><GradeBadge grade={f.grade} /></td>
                <td className="px-4 py-3"><StatusBadge variant="flagged">{f.reason}</StatusBadge></td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{f.flaggedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <RankPanel title="Agents by discrepancy rate" data={AGENT_DISCREPANCIES} max={max1} suffix="%" tone="red" />
        <RankPanel title="Buyers by return rate" data={BUYER_RETURN_RATE} max={max2} suffix="%" tone="amber" />
      </div>
    </div>
  );
}

function RankPanel({ title, data, max, suffix, tone }: { title: string; data: { name: string; rate: number }[]; max: number; suffix: string; tone: "red" | "amber" }) {
  const barColor = tone === "red" ? "bg-red" : "bg-amber";
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {data.map((d) => (
          <li key={d.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono">{d.name}</span>
              <span className="font-mono">{d.rate}{suffix}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full ${barColor}`} style={{ width: `${(d.rate / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
