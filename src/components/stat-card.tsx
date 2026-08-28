import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  to,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  to?: string;
  tone?: "default" | "amber" | "green" | "red";
}) {
  const toneRing: Record<string, string> = {
    default: "",
    amber: "border-l-amber",
    green: "border-l-green",
    red: "border-l-red",
  };
  const Comp: any = to ? Link : "div";
  const compProps: any = to ? { to } : {};
  return (
    <Comp
      {...compProps}
      className={cn(
        "block rounded-lg border bg-card p-4 border-l-4 transition-colors",
        toneRing[tone],
        to && "hover:bg-accent cursor-pointer"
      )}
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Comp>
  );
}
