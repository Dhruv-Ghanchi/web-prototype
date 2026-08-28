import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/buyer/profile")({ component: Profile });

function Profile() {
  const { logout } = useSession();
  const navigate = useNavigate();
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Delivery address</h2>
        <div><Label className="text-xs">Full name</Label><Input defaultValue="Anita Sharma" className="mt-1" /></div>
        <div><Label className="text-xs">Phone</Label><Input defaultValue="+91 88•••• 07" className="mt-1 font-mono text-sm" /></div>
        <div><Label className="text-xs">Address</Label><Textarea rows={3} defaultValue="204, Emerald Heights, Powai, Mumbai 400076" className="mt-1" /></div>
      </section>
      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Payment</h2>
        <div><Label className="text-xs">UPI ID (optional, for faster checkout)</Label><Input defaultValue="anita@okhdfc" className="mt-1 font-mono text-sm" /></div>
      </section>
      <Button variant="outline" onClick={() => { logout(); navigate({ to: "/" }); }}>Log out</Button>
    </div>
  );
}
