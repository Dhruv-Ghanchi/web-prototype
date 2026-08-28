import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LISTINGS, timelineFor, findItem } from "@/lib/mock/data";
import { GradeBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CustodyTimeline } from "@/components/custody-timeline";
import { useCart } from "@/lib/store";
import { ChevronDown, Info, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/buyer/product/$id")({ component: ProductDetail });

const GRADE_TEXT: Record<string, string> = {
  A: "Like new — no visible wear. Original packaging intact.",
  B: "Minor wear — used briefly, no functional issues.",
  C: "Visible wear — cosmetic marks, fully functional.",
  D: "Heavy wear — sold at deep discount, use as-is.",
};

function ProductDetail() {
  const { id } = Route.useParams();
  const item = LISTINGS.find((l) => l.id === id) ?? findItem(id) as any;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  if (!item) return <p className="p-6">Not found.</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <img src={item.images[active]} alt="" className="w-full aspect-square object-cover rounded-lg border bg-muted" />
        <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-green" /> Verified condition photos · taken at hub
        </p>
        <div className="mt-3 flex gap-2">
          {item.images.map((src: string, i: number) => (
            <button key={i} onClick={() => setActive(i)} className={`h-16 w-16 rounded-md overflow-hidden border-2 ${active === i ? "border-ink" : "border-transparent"}`}>
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground font-mono">{item.id} · {item.sku}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{item.product}</h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-semibold font-mono">₹{(item.price ?? item.suggestedResale).toLocaleString()}</span>
          <span className="text-sm text-muted-foreground line-through font-mono">₹{item.mrp.toLocaleString()}</span>
        </div>

        <div className="mt-5 rounded-md border bg-muted/30 p-3 flex items-start gap-3">
          <GradeBadge grade={item.grade} />
          <p className="text-xs text-muted-foreground">{GRADE_TEXT[item.grade]}</p>
        </div>

        <Button
          size="lg"
          className="w-full mt-5"
          onClick={() => {
            add(item.id);
            navigate({ to: "/buyer/checkout" });
          }}
        >
          Buy now
        </Button>

        <div className="mt-6 rounded-md border bg-amber-soft/40 p-3 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 mt-0.5 text-amber-foreground shrink-0" />
          <div>
            <p className="text-xs font-semibold">What does "returned item" mean here?</p>
            <p className="text-xs text-muted-foreground mt-1">
              A previous buyer returned this. Our neighborhood hub verified its condition, graded it, and photographed it. You're seeing those exact photos — not stock — and you can view its full trust trail below.
            </p>
          </div>
        </div>

        <Collapsible open={open} onOpenChange={setOpen} className="mt-6 rounded-lg border">
          <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50">
            <span className="text-sm font-medium">Full verification history</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pt-2 pb-5">
            <CustodyTimeline steps={timelineFor(item)} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
