import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListTodo,
  Truck,
  SlidersHorizontal,
  Flag,
  BarChart3,
  Settings,
  Wallet,
  Package,
  Users,
  ShieldAlert,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/store";

type Item = { to: string; label: string; icon: any };

const NAV: Record<Exclude<Role, "buyer">, Item[]> = {
  supervisor: [
    { to: "/supervisor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/supervisor/pricing-queue", label: "Pricing Queue", icon: ListTodo },
    { to: "/supervisor/expected-returns", label: "Expected Returns", icon: Truck },
    { to: "/supervisor/pricing-rules", label: "Pricing Rules", icon: SlidersHorizontal },
    { to: "/supervisor/disputes", label: "Disputes", icon: Flag },
    { to: "/supervisor/reports", label: "Reports", icon: BarChart3 },
    { to: "/supervisor/settings", label: "Settings", icon: Settings },
  ],
  seller: [
    { to: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/seller/decisions", label: "Returns / Decisions", icon: ListTodo },
    { to: "/seller/ledger", label: "Ledger", icon: Wallet },
    { to: "/seller/catalog", label: "Catalog", icon: Package },
    { to: "/seller/disputes", label: "Disputes", icon: Flag },
    { to: "/seller/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { to: "/admin/overview", label: "Ops Overview", icon: LayoutDashboard },
    { to: "/admin/users", label: "User Management", icon: Users },
    { to: "/admin/fraud", label: "Fraud & Discrepancies", icon: ShieldAlert },
    { to: "/admin/notifications", label: "Notifications Log", icon: Bell },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ],
};

export function RoleSidebar({ role }: { role: Exclude<Role, "buyer"> }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV[role];
  return (
    <aside className="hidden md:flex w-56 shrink-0 border-r bg-sidebar flex-col">
      <div className="h-14 flex items-center px-6 border-b shrink-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {role} workspace
        </p>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {items.map((it) => {
          const active = pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-ink text-paper font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t shrink-0">
        <p className="text-[10px] text-muted-foreground/50 font-mono tracking-tight">
          ReturnFlow Enterprise v2.4.0
        </p>
      </div>
    </aside>
  );
}
