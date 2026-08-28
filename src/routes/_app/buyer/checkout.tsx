import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LISTINGS } from "@/lib/mock/data";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/buyer/checkout")({ component: Checkout });

function Checkout() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [done, setDone] = useState<string | null>(null);
  const cart = LISTINGS.filter((l) => items.includes(l.id));
  const total = cart.reduce((s, l) => s + l.price, 0);
  const navigate = useNavigate();

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="mx-auto h-12 w-12 rounded-full bg-green-soft flex items-center justify-center">
          <Check className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Order confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-mono">{done}</span> · Expected today, 5–7 PM
        </p>
        <p className="mt-3 text-xs text-muted-foreground">A delivery agent will bring this directly to you.</p>
        <Button className="mt-6" onClick={() => navigate({ to: "/buyer/orders" })}>View my orders</Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return <EmptyState icon={ShoppingBag} title="Your bag is empty" description="Add a listing to check out." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold">Delivery address</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Full name</Label><Input defaultValue="Anita Sharma" className="mt-1" /></div>
            <div><Label className="text-xs">Phone</Label><Input defaultValue="+91 88•••• 07" className="mt-1 font-mono text-sm" /></div>
          </div>
          <div><Label className="text-xs">Address</Label><Textarea rows={2} defaultValue="204, Emerald Heights, Powai, Mumbai 400076" className="mt-1" /></div>
        </div>
      </section>

      <aside className="rounded-lg border bg-card p-5 h-fit">
        <h2 className="text-sm font-semibold">Order summary</h2>
        <ul className="mt-3 space-y-3">
          {cart.map((c) => (
            <li key={c.id} className="flex gap-3">
              <img src={c.images[0]} alt="" className="h-14 w-14 rounded object-cover border" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{c.product}</p>
                <p className="text-xs font-mono text-muted-foreground">{c.id}</p>
              </div>
              <span className="text-sm font-mono">₹{c.price.toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <div className="border-t mt-4 pt-3 flex justify-between text-sm font-semibold">
          <span>Total</span><span className="font-mono">₹{total.toLocaleString()}</span>
        </div>
        <Button
          className="w-full mt-4"
          onClick={() => {
            const id = `ORD-${90300 + Math.floor(Math.random() * 99)}`;
            clear();
            setDone(id);
            toast.success("Payment received");
          }}
        >
          Pay via UPI · ₹{total.toLocaleString()}
        </Button>
      </aside>
    </div>
  );
}
