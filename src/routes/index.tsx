import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ACCOUNTS, useSession, type Role } from "@/lib/store";
import { 
  PackageCheck, 
  ShieldCheck, 
  Store, 
  ShoppingBag, 
  Wrench, 
  KeyRound, 
  ArrowRight, 
  Lock, 
  Mail,
  HelpCircle
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Route = createFileRoute("/")({
  component: Login,
});

const ROLE_META: Record<Role, { icon: any; blurb: string; landing: string }> = {
  supervisor: { icon: ShieldCheck, blurb: "Price, resolve disputes, and run hub reports.", landing: "/supervisor/dashboard" },
  seller: { icon: Store, blurb: "Accept buyback offers or consign returned inventory.", landing: "/seller/dashboard" },
  buyer: { icon: ShoppingBag, blurb: "Shop verified local returns in your neighborhood.", landing: "/buyer/home" },
  admin: { icon: Wrench, blurb: "Manage users, hubs, and auditing metrics.", landing: "/admin/overview" },
};

function Login() {
  const navigate = useNavigate();
  const { role, login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) navigate({ to: ROLE_META[role].landing });
  }, [role, navigate]);

  const handleDemo = (r: Role) => {
    setLoading(true);
    setTimeout(() => {
      login(r);
      navigate({ to: ROLE_META[r].landing });
      setLoading(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const found = (Object.entries(DEMO_ACCOUNTS) as Array<[Role, typeof DEMO_ACCOUNTS[Role]]>).find(
        ([, a]) => a.email === email.trim().toLowerCase()
      );
      const r: Role = found ? found[0] : "buyer";
      login(r);
      navigate({ to: ROLE_META[r].landing });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Dynamic ambient backdrop glows to tie the color temperature together */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-amber/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-ink/5 blur-3xl pointer-events-none" />

      {/* Floating Centered Container */}
      <div className="w-full max-w-5xl bg-card rounded-2xl border shadow-lg flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[580px]">
        
        {/* LEFT PANEL: Enterprise Branding & Story (Dark Theme with High Legibility) */}
        <div className="flex-1 bg-ink text-paper p-8 md:p-12 flex flex-col justify-between relative">
          {/* Subtle graphic accent */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-paper)/5,transparent_50%)] pointer-events-none" />
          
          {/* Header Logo */}
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="h-9 w-9 rounded-lg bg-paper flex items-center justify-center shadow-sm">
              <PackageCheck className="h-5 w-5 text-ink" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Return<span className="text-amber">Flow</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-paper/60 bg-paper/10 px-2 py-0.5 rounded border border-paper/15">
              Enterprise
            </span>
          </div>

          {/* Core Story */}
          <div className="my-auto max-w-lg relative z-10 space-y-5 pt-8 pb-8">
            <p className="text-[11px] uppercase tracking-widest text-amber font-semibold font-mono">
              Optimized Reverse Logistics Platform
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Connecting hubs, merchants, and buyers with absolute trust.
            </h1>
            <p className="text-xs md:text-sm text-paper/70 leading-relaxed">
              ReturnFlow orchestrates the entire lifecycle of returned inventory. By combining tamper-evident custody tracking, automated pricing rule engines, and local storefront resale, we turn warehouse overhead into a sustainable profit center.
            </p>

            {/* Feature Checkpoints */}
            <div className="pt-5 border-t border-paper/15 space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-green/10 flex items-center justify-center text-green shrink-0 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-paper/90">Chain-of-Custody Timeline</p>
                  <p className="text-[11px] text-paper/60 mt-0.5">Every hand-off and condition verification recorded on an immutable trust trail.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-green/10 flex items-center justify-center text-green shrink-0 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-paper/90">Automated Pricing Intelligence</p>
                  <p className="text-[11px] text-paper/60 mt-0.5">Suggested buyback and resale values calculated instantly using Hub condition grading.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-[10px] text-paper/50 relative z-10 flex items-center justify-between border-t border-paper/15 pt-4">
            <span>Logistics Network © 2026</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-paper transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-paper transition-colors">Terms</a>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: High-Fidelity Sign-In (Clean White Contrast Theme) */}
        <div className="w-full md:w-[420px] bg-card p-8 md:p-12 flex flex-col justify-center border-l md:border-l-0 border-t md:border-t-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in</h2>
              <p className="text-xs text-muted-foreground">
                Enter your credentials to access your administrative workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-medium text-foreground">
                  Corporate Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@returnflow.com"
                    className="pl-9 h-10 text-sm font-sans bg-muted/20 border-border/80 focus:bg-background"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-foreground">
                    Password
                  </Label>
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-10 bg-muted/20 border-border/80 focus:bg-background"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-10 font-medium bg-ink text-paper hover:opacity-90" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In to Portal"}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Need assistance? Contact support.</span>
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING DEMO ACCESS CONSOLE */}
      <div className="fixed bottom-4 right-4 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="rounded-full shadow-md hover:shadow-lg border-amber-foreground/20 bg-background hover:bg-accent/20 gap-2 h-10 px-4 transition-all"
            >
              <KeyRound className="h-4 w-4 text-amber-foreground" />
              <span className="text-xs font-medium text-foreground">Demo Accounts</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-4 border shadow-xl bg-card">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold tracking-tight">Select a Demo Profile</h4>
              <p className="text-xs text-muted-foreground">
                Instantly authenticate as any of the four workspaces for evaluation:
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              {(Object.keys(ROLE_META) as Role[]).map((r) => {
                const Icon = ROLE_META[r].icon;
                return (
                  <button
                    key={r}
                    onClick={() => handleDemo(r)}
                    disabled={loading}
                    className="flex items-start gap-3 rounded-md border p-2.5 text-left transition-all hover:bg-accent hover:border-foreground"
                  >
                    <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold capitalize text-foreground">{r}</span>
                        <span className="text-[9px] font-mono text-muted-foreground/80">Select →</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{DEMO_ACCOUNTS[r].email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
}
