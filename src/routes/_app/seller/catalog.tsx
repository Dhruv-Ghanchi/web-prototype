import { createFileRoute } from "@tanstack/react-router";
import { SELLER_CATALOG } from "@/lib/mock/data";

export const Route = createFileRoute("/_app/seller/catalog")({
  component: Catalog,
});

function Catalog() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
        <p className="text-sm text-muted-foreground mt-1">Your products and their return performance.</p>
      </div>
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">SKU</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">MRP</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Return rate</th>
            </tr>
          </thead>
          <tbody>
            {SELLER_CATALOG.map((p) => (
              <tr key={p.sku} className="border-t hover:bg-accent/40 cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-right font-mono">₹{p.mrp.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-mono ${p.returnRate > 5 ? "text-red" : p.returnRate > 3 ? "text-amber-foreground" : "text-green"}`}>
                    {p.returnRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
