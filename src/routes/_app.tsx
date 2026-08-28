import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "@/lib/store";
import { TopBar } from "@/components/top-bar";
import { RoleSidebar } from "@/components/role-sidebar";
import { BuyerNav } from "@/components/buyer-navbar";

import { toast } from "sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const TITLE_MAP: Record<string, string> = {
  "supervisor/dashboard": "Dashboard",
  "supervisor/pricing-queue": "Pricing Queue",
  "supervisor/expected-returns": "Expected Returns",
  "supervisor/pricing-rules": "Pricing Rules",
  "supervisor/disputes": "Disputes",
  "supervisor/reports": "Reports",
  "supervisor/settings": "Settings",
  "seller/dashboard": "Dashboard",
  "seller/decisions": "Returns / Decisions",
  "seller/ledger": "Ledger",
  "seller/catalog": "Catalog",
  "seller/disputes": "Disputes",
  "seller/settings": "Settings",
  "admin/overview": "Ops Overview",
  "admin/users": "User Management",
  "admin/fraud": "Fraud & Discrepancies",
  "admin/notifications": "Notifications Log",
  "admin/settings": "Settings",
};

const MOCK_EVENTS = [
  "🚚 Agent Nitin D. just dropped off 3 items at Andheri Hub.",
  "✅ Item RF-24011 verified by Hub Person Isha R.",
  "⚠️ Dispute D-4105 raised by Lumen Home.",
  "💰 Resale settlement of ₹1,240 completed.",
  "🛒 Buyer checkout completed for ORD-90215.",
];

function AppLayout() {
  const { role } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!role) navigate({ to: "/" });
    
    // Simulated real-time events
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const randomEvent = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
        toast(randomEvent, {
          description: "Live system event",
        });
      }
    }, 45000); // Every 45 seconds chance of an event
    return () => clearInterval(interval);
  }, [role, navigate]);

  if (!role) return null;

  if (role === "buyer") {
    return (
      <div className="min-h-screen bg-background">
        <BuyerNav />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    );
  }

  const key = pathname.replace(/^\/_app\//, "").replace(/^\//, "");
  const title = TITLE_MAP[key] ?? "";

  return (
    <div className="min-h-screen bg-background flex">
      <RoleSidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
