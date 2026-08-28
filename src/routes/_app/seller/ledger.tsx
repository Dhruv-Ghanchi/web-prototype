import { createFileRoute } from "@tanstack/react-router";
import { LEDGER } from "@/lib/mock/data";
import { StatusBadge, statusVariant } from "@/components/status-badge";

export const Route = createFileRoute("/_app/seller/ledger")({
  component: Ledger,
});

function Ledger() {
  const totalMonth = LEDGER.filter((l) => l.status === "Completed").reduce((s, l) => s + l.amount, 0);
  const pending = LEDGER.filter((l) => l.status === "Processing").reduce((s, l) => s + l.amount, 0);
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ledger</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Payouts, settlements, and how fast your money actually arrives.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="Paid this month" value={`₹${totalMonth.toLocaleString()}`} tone="green" />
        <Summary label="Pending" value={`₹${pending.toLocaleString()}`} tone="amber" />
        <Summary label="Avg. payout time" value="6.2h" hint="Buyback → UPI credit" />
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Amount</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Channel</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Age</th>
            </tr>
          </thead>
          <tbody>
            {LEDGER.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-medium truncate max-w-xs">{l.product}</p>
                  <p className="text-xs font-mono text-muted-foreground">{l.id} · {l.itemId}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.type}</td>
                <td className="px-4 py-3 text-right font-mono">₹{l.amount.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.channel}</td>
                <td className="px-4 py-3"><StatusBadge variant={statusVariant(l.status)}>{l.status}</StatusBadge></td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.date}</td>
                <td className="px-4 py-3 text-right font-mono text-xs">{l.ageDays === 0 ? "—" : `${l.ageDays}d`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Summary({ label, value, tone = "default", hint }: { label: string; value: string; tone?: "default" | "green" | "amber"; hint?: string }) {
  const border = tone === "green" ? "border-l-green" : tone === "amber" ? "border-l-amber" : "";
  return (
    <div className={`rounded-lg border bg-card p-4 border-l-4 ${border}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
