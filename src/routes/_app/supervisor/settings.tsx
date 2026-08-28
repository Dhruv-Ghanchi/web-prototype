import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/supervisor/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Your profile, notifications, and password.</p>
      </div>

      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">Profile</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Full name</Label><Input defaultValue="Priya Nair" className="mt-1" /></div>
          <div><Label className="text-xs">Email</Label><Input defaultValue="priya@returnflow.in" className="mt-1 font-mono text-sm" /></div>
          <div><Label className="text-xs">Assigned hub</Label><Input defaultValue="Mumbai · Andheri" className="mt-1" /></div>
          <div><Label className="text-xs">Phone</Label><Input defaultValue="+91 98•••• 42" className="mt-1 font-mono text-sm" /></div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <NotifRow label="New item awaiting pricing" />
        <NotifRow label="New dispute raised" />
        <NotifRow label="Weekly report ready" defaultSMS={false} />
        <NotifRow label="Flag raised by hub" />
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Password</h2>
        <div className="grid gap-3">
          <div><Label className="text-xs">Current password</Label><Input type="password" className="mt-1" /></div>
          <div><Label className="text-xs">New password</Label><Input type="password" className="mt-1" /></div>
        </div>
        <div><Button>Update password</Button></div>
      </section>
    </div>
  );
}

function NotifRow({ label, defaultSMS = true }: { label: string; defaultSMS?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <p className="text-sm">{label}</p>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          In-app <Switch defaultChecked />
        </label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          WhatsApp/SMS <Switch defaultChecked={defaultSMS} />
        </label>
      </div>
    </div>
  );
}
