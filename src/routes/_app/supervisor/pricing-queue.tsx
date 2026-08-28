import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PIPELINE, timelineFor, PRICING_RULES, type PipelineItem } from "@/lib/mock/data";
import { GradeBadge, StatusBadge, statusVariant } from "@/components/status-badge";
import { CustodyTimeline } from "@/components/custody-timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/supervisor/pricing-queue")({
  component: PricingQueue,
});

function PricingQueue() {
  const [city, setCity] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [grade, setGrade] = useState<string>("all");
  const [selected, setSelected] = useState<PipelineItem | null>(null);
  const [decided, setDecided] = useState<Set<string>>(new Set());

  const rows = useMemo(
    () =>
      PIPELINE.filter((p) => ["Verified", "Awaiting Pricing"].includes(p.status) || !decided.has(p.id))
        .filter((p) => (city === "all" ? true : p.city === city))
        .filter((p) => (category === "all" ? true : p.category === category))
        .filter((p) => (grade === "all" ? true : p.grade === grade))
        .filter((p) => !decided.has(p.id))
        .slice(0, 18),
    [city, category, grade, decided]
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pricing queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {rows.length} verified item{rows.length === 1 ? "" : "s"} ready for buyback + resale pricing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FilterSelect label="City" value={city} onChange={setCity} options={["Mumbai", "Bengaluru", "Delhi", "Pune"]} />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={["Apparel", "Footwear", "Electronics", "Home", "Beauty"]} />
          <FilterSelect label="Grade" value={grade} onChange={setGrade} options={["A", "B", "C", "D"]} />
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <Th>Item</Th>
              <Th>City / Hub</Th>
              <Th>Grade</Th>
              <Th>Verified</Th>
              <Th>Status</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => setSelected(r)}
                className="border-t hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={r.images[0]} alt="" className="h-10 w-10 rounded-md object-cover border" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{r.product}</p>
                      <p className="text-xs text-muted-foreground font-mono">{r.id} · {r.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.hub}</td>
                <td className="px-4 py-3"><GradeBadge grade={r.grade} /></td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.verifiedOn}</td>
                <td className="px-4 py-3"><StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge></td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline">Price it</Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No items in the queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PricingDrawer
        item={selected}
        onClose={() => setSelected(null)}
        onConfirm={(id) => {
          setDecided((s) => new Set(s).add(id));
          setSelected(null);
          toast.success("Pricing sent to seller", { description: "They'll accept or consign within 24h." });
        }}
      />
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${className}`}>{children}</th>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function PricingDrawer({ item, onClose, onConfirm }: { item: PipelineItem | null; onClose: () => void; onConfirm: (id: string) => void }) {
  const [buyback, setBuyback] = useState<number>(0);
  const [resale, setResale] = useState<number>(0);

  // reset when item changes
  useMemoResetPrices(item, setBuyback, setResale);

  const rule = item ? PRICING_RULES.find((r) => r.category === item.category && r.grade === item.grade) : null;

  return (
    <Sheet open={!!item} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {item && (
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 pt-6 pb-4 border-b space-y-2">
              <div className="flex items-center gap-2">
                <GradeBadge grade={item.grade} />
                <StatusBadge variant="pending">{item.status}</StatusBadge>
              </div>
              <SheetTitle className="text-xl">{item.product}</SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {item.id} · {item.sku} · {item.hub}
              </SheetDescription>
            </SheetHeader>

            <div className="px-6 py-5 space-y-6">
              <section>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Verification photos
                </p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {item.images.map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-square rounded-md object-cover border" />
                  ))}
                </div>
                {item.note && (
                  <p className="mt-3 text-xs italic text-muted-foreground rounded-md bg-muted/50 px-3 py-2">
                    Hub note: {item.note}
                  </p>
                )}
              </section>

              <section>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Custody timeline
                </p>
                <div className="mt-3">
                  <CustodyTimeline steps={timelineFor(item)} />
                </div>
              </section>

              <section className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Set prices</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        <Info className="h-3 w-3" />
                        View pricing rule used
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="text-xs">
                          Rule: <span className="font-mono">{item.category} · Grade {item.grade}</span>
                        </p>
                        <p className="text-xs mt-1">
                          Resale = {rule?.resalePct}% of MRP (₹{item.mrp.toLocaleString()})
                        </p>
                        <p className="text-xs">
                          Buyback = {rule?.buybackPct}% of Resale
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Buyback price (₹)</Label>
                    <Input
                      type="number"
                      value={buyback}
                      onChange={(e) => setBuyback(Number(e.target.value))}
                      className="mt-1 font-mono"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Suggested: ₹{item.suggestedBuyback?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs">Resale price (₹)</Label>
                    <Input
                      type="number"
                      value={resale}
                      onChange={(e) => setResale(Number(e.target.value))}
                      className="mt-1 font-mono"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Suggested: ₹{item.suggestedResale?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-auto border-t px-6 py-4 flex items-center gap-3 bg-background">
              <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button onClick={() => onConfirm(item.id)} className="flex-[2]">
                Confirm pricing & send to seller
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function useMemoResetPrices(item: PipelineItem | null, sb: (n: number) => void, sr: (n: number) => void) {
  useMemo(() => {
    if (item) {
      sb(item.suggestedBuyback ?? 0);
      sr(item.suggestedResale ?? 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);
}
