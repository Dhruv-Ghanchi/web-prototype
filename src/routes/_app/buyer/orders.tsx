import { createFileRoute, Link } from "@tanstack/react-router";
import { BUYER_ORDERS } from "@/lib/mock/data";
import { StatusBadge, statusVariant } from "@/components/status-badge";

export const Route = createFileRoute("/_app/buyer/orders")({ component: Orders });

function Orders() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">My orders</h1>
      <div className="space-y-3">
        {BUYER_ORDERS.map((o) => (
          <div key={o.id} className="rounded-lg border bg-card p-4 flex items-center gap-4">
            <img src={o.image} alt="" className="h-16 w-16 rounded object-cover border" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{o.product}</p>
              <p className="text-xs font-mono text-muted-foreground">{o.id} · placed {o.placed}</p>
              <div className="mt-1.5"><StatusBadge variant={statusVariant(o.status)}>{o.status}</StatusBadge></div>
            </div>
            <div className="text-right">
              <p className="font-mono">₹{o.price.toLocaleString()}</p>
              {o.status === "Delivered" && (
                <Link to="/buyer/product/$id" params={{ id: o.itemId }} className="text-xs text-muted-foreground hover:text-foreground">
                  View history →
                </Link>
              )}
              {o.status === "Out for Delivery" && (
                <p className="text-xs text-amber-foreground mt-1">{o.eta}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
