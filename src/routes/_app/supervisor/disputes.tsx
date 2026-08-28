import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DISPUTES, findItem, timelineFor, type Dispute } from "@/lib/mock/data";
import { StatusBadge, statusVariant } from "@/components/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CustodyTimeline } from "@/components/custody-timeline";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/supervisor/disputes")({
  component: Disputes,
});

function Disputes() {
  const [rows, setRows] = useState(DISPUTES);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [response, setResponse] = useState("");

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Disputes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seller-raised concerns about grading or pricing.
        </p>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Item</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Raised by</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reason</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => {
              const it = findItem(d.itemId);
              return (
                <tr key={d.id} onClick={() => { setSelected(d); setResponse(d.response ?? ""); }} className="border-t hover:bg-accent/40 cursor-pointer">
                  <td className="px-4 py-3">
                    <p className="font-medium">{it?.product ?? d.itemId}</p>
                    <p className="text-xs font-mono text-muted-foreground">{d.id} · {d.itemId}</p>
                  </td>
                  <td className="px-4 py-3">{d.raisedBy}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-md truncate">{d.reason}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-3"><StatusBadge variant={statusVariant(d.status)}>{d.status}</StatusBadge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (() => {
            const it = findItem(selected.itemId);
            return (
              <>
                <SheetHeader className="space-y-2">
                  <StatusBadge variant={statusVariant(selected.status)}>{selected.status}</StatusBadge>
                  <SheetTitle>{selected.id} · {it?.product}</SheetTitle>
                  <SheetDescription>Raised by {selected.raisedBy} on {selected.date}</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-5">
                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Reason</p>
                    <p className="text-sm mt-1">{selected.reason}</p>
                  </div>
                  {it && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Custody</p>
                      <CustodyTimeline steps={timelineFor(it)} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Your response</p>
                    <Textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={3} placeholder="Explain the outcome…" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setRows((r) => r.map((x) => x.id === selected.id ? { ...x, status: "Resolved", response: response || "Pricing adjusted." } : x));
                        setSelected(null);
                        toast.success("Pricing adjusted", { description: "Dispute closed, seller notified." });
                      }}
                    >
                      Adjust pricing
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setRows((r) => r.map((x) => x.id === selected.id ? { ...x, status: "Resolved", response: response || "Original decision upheld." } : x));
                        setSelected(null);
                        toast.success("Decision upheld", { description: "Dispute closed with a note." });
                      }}
                    >
                      Uphold original decision
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
