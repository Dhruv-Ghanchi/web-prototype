import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/seller/settings")({
  component: SellerSettings,
});

function SellerSettings() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Business profile, KYC, and payouts.</p>
      </div>

      <section className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Business profile</h2>
          <StatusBadge variant="verified">KYC Verified</StatusBadge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs">Business name</Label><Input defaultValue="Nordic Threads" className="mt-1" /></div>
          <div><Label className="text-xs">GSTIN</Label><Input defaultValue="27AABCU9603R1ZM" className="mt-1 font-mono text-sm" /></div>
          <div><Label className="text-xs">Contact</Label><Input defaultValue="Raj Kapoor" className="mt-1" /></div>
          <div><Label className="text-xs">Phone</Label><Input defaultValue="+91 90•••• 11" className="mt-1 font-mono text-sm" /></div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Payout (UPI)</h2>
        <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
          <div>
            <Label className="text-xs">UPI ID</Label>
            <Input defaultValue="nordicthreads@icici" className="mt-1 font-mono text-sm" />
          </div>
          <Button variant="outline">Verify</Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Payouts are credited to this UPI ID within a few hours of buyback acceptance.
        </p>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <p className="text-xs text-muted-foreground">Get pinged when new returns land, disputes resolve, or payouts complete.</p>
      </section>
    </div>
  );
}
