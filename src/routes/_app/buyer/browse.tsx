import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { LISTINGS, CATEGORIES } from "@/lib/mock/data";
import { ProductCard } from "./home";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/store";

export const Route = createFileRoute("/_app/buyer/browse")({ component: Browse });

function Browse() {
  const { city } = useSession();
  const [cats, setCats] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [price, setPrice] = useState<number[]>([500, 50000]);
  const [sort, setSort] = useState("newest");

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const filtered = useMemo(() => {
    let out = LISTINGS.filter((l) =>
      (cats.length === 0 || cats.includes(l.category)) &&
      (grades.length === 0 || grades.includes(l.grade)) &&
      l.price >= price[0] && l.price <= price[1]
    );
    if (sort === "low") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "high") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "ending") out = [...out].sort((a, b) => a.daysLeft - b.daysLeft);
    return out;
  }, [cats, grades, price, sort]);

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Category</p>
          <div className="space-y-2">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <Checkbox checked={cats.includes(c)} onCheckedChange={() => toggle(cats, setCats, c)} /> {c}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Condition</p>
          <div className="space-y-2">
            {["A", "B", "C", "D"].map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <Checkbox checked={grades.includes(g)} onCheckedChange={() => toggle(grades, setGrades, g)} />
                Grade {g}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Price range</p>
          <Slider min={0} max={80000} step={500} value={price} onValueChange={setPrice} />
          <p className="mt-2 text-xs text-muted-foreground font-mono">
            ₹{price[0].toLocaleString()} — ₹{price[1].toLocaleString()}
          </p>
        </div>
      </aside>

      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filtered.length} items in <span className="text-foreground font-medium">{city}</span>
          </p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="low">Price: Low → High</SelectItem>
              <SelectItem value="high">Price: High → Low</SelectItem>
              <SelectItem value="ending">Ending soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => <ProductCard key={l.id} l={l} />)}
        </div>
      </section>
    </div>
  );
}
