import { createFileRoute } from "@tanstack/react-router";
import { HUBS } from "@/lib/mock/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Platform settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Hubs, defaults, and languages.</p>
      </div>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Hubs</h2>
          <Button size="sm" variant="outline">Add hub</Button>
        </div>
        <ul className="divide-y">
          {HUBS.map((h) => (
            <li key={h} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{h}</p>
                <p className="text-xs text-muted-foreground font-mono">geofence: 2.5 km</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Defaults</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Default resale window (days)</Label><Input defaultValue="30" className="mt-1 font-mono" /></div>
          <div><Label className="text-xs">Default profit share (%)</Label><Input defaultValue="70" className="mt-1 font-mono" /></div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Mobile app languages</h2>
        <div className="flex flex-wrap gap-2">
          {["English", "हिन्दी", "मराठी", "ಕನ್ನಡ", "தமிழ்"].map((l) => (
            <span key={l} className="rounded-full border px-3 py-1 text-xs">{l}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
