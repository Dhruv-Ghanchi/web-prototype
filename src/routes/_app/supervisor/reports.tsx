import { createFileRoute } from "@tanstack/react-router";
import { HUB_THROUGHPUT, AGING, CATEGORY_BREAKDOWN } from "@/lib/mock/data";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_app/supervisor/reports")({
  component: Reports,
});

const CHART_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function Reports() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Throughput, aging, and category breakdowns.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1.5" /> Last 30 days
          </Button>
        </div>
      </div>

      <section className="rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Hub throughput</h2>
            <p className="text-xs text-muted-foreground">Items processed per hub, last 7 days</p>
          </div>
          <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> CSV</Button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={HUB_THROUGHPUT} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="hub" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
              <Bar dataKey="processed" fill="var(--color-green)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold">Aging report</h2>
              <p className="text-xs text-muted-foreground">Avg hours per stage</p>
            </div>
            <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" /> CSV</Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2 text-xs uppercase text-muted-foreground font-semibold">Stage</th>
                <th className="pb-2 text-xs uppercase text-muted-foreground font-semibold text-right">Avg hours</th>
              </tr>
            </thead>
            <tbody>
              {AGING.map((a) => (
                <tr key={a.stage} className="border-b last:border-b-0">
                  <td className="py-2.5">{a.stage}</td>
                  <td className="py-2.5 text-right font-mono">{a.avgHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-sm font-semibold">Category breakdown</h2>
          <p className="text-xs text-muted-foreground">What's being returned most</p>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_BREAKDOWN} dataKey="count" nameKey="category" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {CATEGORY_BREAKDOWN.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {CATEGORY_BREAKDOWN.map((c, i) => (
              <span key={c.category} className="inline-flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {c.category} <span className="text-muted-foreground font-mono">{c.count}</span>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
