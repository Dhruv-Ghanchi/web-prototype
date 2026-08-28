import { createFileRoute, Link } from "@tanstack/react-router";
import { LISTINGS } from "@/lib/mock/data";
import { GradeBadge } from "@/components/status-badge";
import { useSession } from "@/lib/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/buyer/home")({ component: Home });

function Home() {
  const { city } = useSession();
  const [showBanner, setShowBanner] = useState(true);
  const filtered = LISTINGS;
  const recent = filtered.slice(0, 8);
  return (
    <div className="space-y-8">
      {showBanner && (
        <Alert className="bg-blue-50/50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-200">
          <Info className="h-4 w-4 !text-blue-900 dark:!text-blue-200" />
          <AlertTitle>Welcome to ReturnFlow Local!</AlertTitle>
          <AlertDescription className="mt-2">
            Every item you see here is a genuine, verified return from a local hub. We inspect every product, take actual photos, and assign a condition grade so you know exactly what you are getting.
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={() => setShowBanner(false)} className="border-blue-300 hover:bg-blue-100 dark:border-blue-800 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-200">
                Start shopping
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <section className="rounded-xl border bg-card p-8 md:p-10 relative overflow-hidden">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Verified · Local · Real</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Genuine returned products, verified and sold locally.</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-lg">
            Every item has its full history — from pickup to hub to your doorstep. No stock photos, no mystery. Just real things at fair prices in {city}.
          </p>
          <Link to="/buyer/browse" className="mt-5 inline-flex items-center rounded-md bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-ink/90">
            Browse listings in {city}
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recently listed</h2>
          <Link to="/buyer/browse" className="text-xs text-muted-foreground hover:text-foreground">See all →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {recent.map((l) => (
            <MiniCard key={l.id} l={l} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">In {city} right now</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((l) => <ProductCard key={l.id} l={l} />)}
        </div>
      </section>
    </div>
  );
}

function MiniCard({ l }: { l: any }) {
  return (
    <Link to="/buyer/product/$id" params={{ id: l.id }} className="w-48 shrink-0 rounded-lg border bg-card overflow-hidden hover:shadow-sm">
      <img src={l.images[0]} alt="" className="aspect-square w-full object-cover" />
      <div className="p-2.5">
        <p className="text-xs font-medium truncate">{l.product}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-semibold font-mono">₹{l.price.toLocaleString()}</span>
          <GradeBadge grade={l.grade} />
        </div>
      </div>
    </Link>
  );
}

export function ProductCard({ l }: { l: any }) {
  return (
    <Link to="/buyer/product/$id" params={{ id: l.id }} className="group block rounded-lg border bg-card overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative">
        <img src={l.images[0]} alt="" className="aspect-square w-full object-cover" />
        <span className="absolute top-2 left-2"><GradeBadge grade={l.grade} /></span>
        <span className="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 text-[10px] font-mono border">
          {l.daysLeft}d left
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate">{l.product}</p>
        <p className="text-xs text-muted-foreground truncate">{l.city} · {l.category}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold font-mono">₹{l.price.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground line-through font-mono">₹{l.mrp.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
