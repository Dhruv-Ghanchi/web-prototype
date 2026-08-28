import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PRICING_RULES, type PricingRule } from "@/lib/mock/data";
import { GradeBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/supervisor/pricing-rules")({
  component: PricingRules,
});

function PricingRules() {
  const [rules, setRules] = useState(PRICING_RULES);
  const [editing, setEditing] = useState<PricingRule | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pricing rules</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rules pre-fill the pricing queue — Supervisors mostly confirm, only override when needed.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> Add rule
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Grade</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resale % of MRP</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buyback % of Resale</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Updated</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 font-medium">{r.category}</td>
                <td className="px-4 py-3"><GradeBadge grade={r.grade} /></td>
                <td className="px-4 py-3 font-mono">{r.resalePct}%</td>
                <td className="px-4 py-3 font-mono">{r.buybackPct}%</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.updated}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(r); setOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RuleDialog
        open={open}
        onClose={() => setOpen(false)}
        rule={editing}
        onSave={(r) => {
          setRules((prev) => {
            if (prev.find((p) => p.id === r.id)) return prev.map((p) => (p.id === r.id ? r : p));
            return [...prev, r];
          });
          setOpen(false);
          toast.success(editing ? "Rule updated" : "Rule added");
        }}
      />
    </div>
  );
}

function RuleDialog({ open, onClose, rule, onSave }: { open: boolean; onClose: () => void; rule: PricingRule | null; onSave: (r: PricingRule) => void }) {
  const [category, setCategory] = useState(rule?.category ?? "Apparel");
  const [grade, setGrade] = useState(rule?.grade ?? "A");
  const [resalePct, setResalePct] = useState(rule?.resalePct ?? 60);
  const [buybackPct, setBuybackPct] = useState(rule?.buybackPct ?? 50);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rule ? "Edit rule" : "Add pricing rule"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Grade</Label>
              <Input value={grade} onChange={(e) => setGrade(e.target.value as any)} className="mt-1 font-mono" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Resale % of MRP</Label>
              <Input type="number" value={resalePct} onChange={(e) => setResalePct(+e.target.value)} className="mt-1 font-mono" />
            </div>
            <div>
              <Label className="text-xs">Buyback % of Resale</Label>
              <Input type="number" value={buybackPct} onChange={(e) => setBuybackPct(+e.target.value)} className="mt-1 font-mono" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() =>
              onSave({
                id: rule?.id ?? `${category}-${grade}`,
                category,
                grade: grade as any,
                resalePct,
                buybackPct,
                updated: "2026-07-16",
              })
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
