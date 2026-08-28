import { useState } from "react";
import { Bell, Search, LogOut, User, Settings as SettingsIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/store";
import { NOTIFICATIONS, HUBS } from "@/lib/mock/data";
import { StatusBadge } from "@/components/status-badge";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopBar({ title }: { title: string }) {
  const { role, name, email, hubScope, setHubScope, logout } = useSession();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(NOTIFICATIONS.filter((n) => !n.read).length);
  const initials = (name || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/90 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <div className="font-semibold tracking-tight text-ink">
          Return<span className="text-amber-foreground">Flow</span>
        </div>
        <span className="hidden md:inline text-muted-foreground">·</span>
        <span className="hidden md:inline text-sm text-muted-foreground truncate">{title}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items, orders, IDs…"
            className="h-8 pl-8 w-56 text-xs font-mono bg-muted/40"
          />
        </div>

        {role === "admin" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <span className="text-xs text-muted-foreground">Scope:</span>
                <span className="text-xs font-medium">{hubScope}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hub / City scope</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setHubScope("All Hubs")}>All Hubs</DropdownMenuItem>
              <DropdownMenuSeparator />
              {HUBS.map((h) => (
                <DropdownMenuItem key={h} onClick={() => setHubScope(h)}>
                  {h}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <ThemeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-4 rounded-full bg-red text-[10px] text-red-foreground px-1 flex items-center justify-center font-medium">
                  {unread}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <p className="text-sm font-medium">Notifications</p>
              <button
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setUnread(0);
                  toast.success("Marked all as read");
                }}
              >
                Mark all read
              </button>
            </div>
            <ul className="max-h-80 overflow-auto">
              {NOTIFICATIONS.map((n) => (
                <li key={n.id} className="border-b last:border-b-0 px-3 py-2.5 hover:bg-muted/40">
                  <div className="flex items-start gap-2">
                    <StatusBadge variant={n.type === "dispute" ? "flagged" : n.type === "pricing" ? "pending" : "completed"}>
                      {n.type}
                    </StatusBadge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.detail}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">{n.when}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted/60">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-paper">
                {initials}
              </span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm">{name}</p>
              <p className="text-xs text-muted-foreground font-normal">{email}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{role}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="h-4 w-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
