import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SELLER_DECISIONS, timelineFor } from "@/lib/mock/data";
import { GradeBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CustodyTimeline } from "@/components/custody-timeline";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";
import { AlertCircle, PackageCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/seller/decisions")({
  component: Decisions,
});

function Decisions() {
  const [items, setItems] = useState(SELLER_DECISIONS);
  const [gallery, setGallery] = useState<string | null>(null);
  const [dispute, setDispute] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  const handleDecision = (id: string, kind: "buyback" | "consign") => {
    setProcessing(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setProcessing(null);
      toast.success(kind === "buyback" ? "Buyback accepted" : "Consigned for resale", {
        description:
          kind === "buyback"
            ? "Payout will arrive within a few hours (UPI)."
            : "Listed on the storefront — 30 day window started.",
      });
    }, 800); // Wait for the checkmark animation before removing
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Returns awaiting your decision</h1>
        <p className="text-sm text-muted-foreground mt-1">
          For each item: accept the buyback offer, consign for resale, or raise a dispute.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={PackageCheck}
          title="All caught up!"
          description="No decisions waiting right now. New returns will show up here as hubs verify them."
          action={
            <Link to="/seller/catalog">
              <Button size="sm">View Sales Catalog</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.article
                key={it.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                className="rounded-lg border bg-card overflow-hidden relative"
              >
                {processing === it.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <CheckCircle2 className="h-12 w-12 text-green" />
                    </motion.div>
                    <p className="mt-2 text-sm font-medium">Done</p>
                  </motion.div>
                )}

                <div className="p-4 border-b flex items-start gap-3">
                  <img src={it.images[0]} alt="" className="h-14 w-14 rounded-md object-cover border" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{it.product}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {it.id} · {it.sku} · {it.city}
                    </p>
                    <div className="mt-1.5"><GradeBadge grade={it.grade} /></div>
                  </div>
                </div>

                <div className="px-4 py-3 border-b">
                  <button
                    onClick={() => setGallery(it.id)}
                    className="flex gap-1.5 hover:opacity-80"
                    title="View evidence"
                  >
                    {it.images.map((src, i) => (
                      <img key={i} src={src} alt="" className="h-10 w-10 rounded object-cover border" />
                    ))}
                  </button>
                  {it.note && (
                    <p className="mt-2 text-[11px] italic text-muted-foreground">Hub note: {it.note}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 divide-x">
                  <button
                    onClick={() => handleDecision(it.id, "buyback")}
                    className="p-4 text-left hover:bg-green-soft/60 transition-colors group"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Sell to us (buyback)
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      ₹{it.suggestedBuyback?.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-green font-medium">Accept buyback →</p>
                  </button>
                  <button
                    onClick={() => handleDecision(it.id, "consign")}
                    className="p-4 text-left hover:bg-amber-soft/40 transition-colors group"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Consign for resale
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      ₹{it.suggestedResale?.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-amber-foreground font-medium">
                      List it · 70% share →
                    </p>
                  </button>
                </div>

                <div className="px-4 py-2.5 border-t bg-muted/30 flex items-center justify-between">
                  <button
                    onClick={() => setDispute(it.id)}
                    className="text-xs text-muted-foreground hover:text-red flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" /> Something's wrong with this grading/price?
                  </button>
                  <span className="text-[10px] font-mono text-muted-foreground">MRP ₹{it.mrp.toLocaleString()}</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Gallery sheet */}
      <Sheet open={!!gallery} onOpenChange={(o) => !o && setGallery(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {(() => {
            const it = items.find((x) => x.id === gallery);
            if (!it) return null;
            return (
              <>
                <SheetHeader>
                  <SheetTitle>{it.product}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {it.images.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-full aspect-square rounded-md object-cover border" />
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Custody</p>
                  <CustodyTimeline steps={timelineFor(it)} />
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Dispute dialog */}
      <Dialog open={!!dispute} onOpenChange={(o) => !o && setDispute(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a dispute</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Tell the Supervisor what looks wrong. Pricing on this item will pause until it's reviewed.
          </p>
          <Textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Grade B seems harsh — sleeves look unworn in photos 2 and 3."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDispute(null)}>Cancel</Button>
            <Button
              onClick={() => {
                toast.success("Dispute raised", { description: "Supervisor will respond within a few hours." });
                setDispute(null);
                setReason("");
              }}
            >
              Submit dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
