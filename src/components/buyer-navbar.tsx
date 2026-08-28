import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, useCart } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CITIES } from "@/lib/mock/data";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { to: "/buyer/home", label: "Home" },
  { to: "/buyer/browse", label: "Browse" },
  { to: "/buyer/orders", label: "Orders" },
  { to: "/buyer/profile", label: "Profile" },
];

export function BuyerNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { city, setCity } = useSession();
  const cart = useCart((s) => s.items);
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link to="/buyer/home" className="font-semibold tracking-tight text-ink shrink-0">
          Return<span className="text-amber-foreground">Flow</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0">
            <MapPin className="h-3.5 w-3.5" />
            <span>{city}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {CITIES.map((c) => (
              <DropdownMenuItem key={c} onClick={() => setCity(c)}>
                {c}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <nav className="ml-6 hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/buyer/checkout"
            className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-ink text-[10px] text-paper px-1 flex items-center justify-center font-medium">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
