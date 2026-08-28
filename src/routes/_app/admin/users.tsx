import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { USERS } from "@/lib/mock/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge, statusVariant } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/users")({ component: UsersPage });

const TABS: Array<keyof typeof USERS> = ["Agents", "Hub Persons", "Supervisors", "Sellers"];

function UsersPage() {
  const [tab, setTab] = useState<keyof typeof USERS>("Agents");
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User management</h1>
          <p className="text-sm text-muted-foreground mt-1">Add and manage every account on the network.</p>
        </div>
        <Button size="sm" onClick={() => toast.success(`Invite sent for new ${tab.slice(0, -1)}`)}>
          <Plus className="h-4 w-4 mr-1.5" /> Add {tab.slice(0, -1)}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          {TABS.map((t) => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t} value={t}>
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hub / Assignment</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">Metric</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS[t].map((u: any) => (
                    <tr key={u.name} className="border-t hover:bg-accent/40 cursor-pointer">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.hub}</td>
                      <td className="px-4 py-3"><StatusBadge variant={statusVariant(u.status)}>{u.status}</StatusBadge></td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
                        {u.tasks ?? u.verified ?? u.avgTurnaround ?? u.items ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
