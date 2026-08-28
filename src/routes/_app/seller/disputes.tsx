import { createFileRoute } from "@tanstack/react-router";
import { DISPUTES, findItem } from "@/lib/mock/data";
import { StatusBadge, statusVariant } from "@/components/status-badge";

export const Route = createFileRoute("/_app/seller/disputes")({
  component: SellerDisputes,
});

function SellerDisputes() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My disputes</h1>
        <p className="text-sm text-muted-foreground mt-1">Concerns you've raised and how they were resolved.</p>
      </div>
      <div className="space-y-3">
        {DISPUTES.map((d) => {
          const it = findItem(d.itemId);
          return (
            <div key={d.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{it?.product ?? d.itemId}</p>
                    <StatusBadge variant={statusVariant(d.status)}>{d.status}</StatusBadge>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{d.id} · {d.itemId} · {d.date}</p>
                  <p className="text-sm mt-2">{d.reason}</p>
                  {d.response && (
                    <div className="mt-3 rounded-md bg-muted/50 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Supervisor response</p>
                      <p className="text-sm mt-1">{d.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
