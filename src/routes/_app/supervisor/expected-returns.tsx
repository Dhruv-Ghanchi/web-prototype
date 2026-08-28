import { createFileRoute } from "@tanstack/react-router";
import { EXPECTED_RETURNS } from "@/lib/mock/data";
import { StatusBadge, statusVariant } from "@/components/status-badge";

export const Route = createFileRoute("/_app/supervisor/expected-returns")({
  component: ExpectedReturns,
});

function ExpectedReturns() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Expected returns</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Returns already initiated — pre-plan pricing and hub capacity before they arrive.
        </p>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Expected hub</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Initiated</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Days out</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {EXPECTED_RETURNS.map((r, i) => (
              <tr key={r.id} className="border-t hover:bg-accent/40">
                <td className="px-4 py-3">
                  <p className="font-medium">{r.product}</p>
                  <p className="text-xs text-muted-foreground font-mono">{r.id} · {r.seller}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.hub}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.verifiedOn}</td>
                <td className="px-4 py-3 font-mono text-xs">{(i % 4) + 1}d</td>
                <td className="px-4 py-3"><StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
