import { cn } from "@/lib/utils";
import type { Grade } from "@/lib/mock/data";

type Variant = "verified" | "pending" | "flagged" | "processing" | "completed" | "neutral";

export function StatusBadge({
  variant,
  children,
  className,
}: {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  const styles: Record<Variant, string> = {
    verified: "bg-green-soft text-green border-green/20",
    completed: "bg-green-soft text-green border-green/20",
    pending: "bg-amber-soft text-amber-foreground border-amber/30",
    processing: "bg-amber-soft text-amber-foreground border-amber/30",
    flagged: "bg-red-soft text-red border-red/20",
    neutral: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

const GRADE_STYLES: Record<Grade, string> = {
  A: "bg-green-soft text-green border-green/30",
  B: "bg-amber-soft text-amber-foreground border-amber/40",
  C: "bg-amber-soft text-amber-foreground border-amber/40",
  D: "bg-red-soft text-red border-red/30",
};

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function GradeBadge({ grade, className }: { grade: Grade; className?: string }) {
  const labels: Record<Grade, string> = {
    A: "Grade A · Like new",
    B: "Grade B · Minor wear",
    C: "Grade C · Visible wear",
    D: "Grade D · Heavy wear",
  };
  const descriptions: Record<Grade, string> = {
    A: "Opened box, unused, perfect condition.",
    B: "Opened box, minor cosmetic wear, fully functional.",
    C: "Noticeable wear, scratches, fully functional.",
    D: "Heavy wear or missing accessories.",
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold font-mono cursor-help",
            GRADE_STYLES[grade],
            className
          )}
        >
          <span className="text-[10px] opacity-70">GRADE</span> {grade}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="font-semibold text-sm">{labels[grade]}</p>
        <p className="text-xs text-primary-foreground/80 mt-0.5">{descriptions[grade]}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function statusVariant(status: string): Variant {
  const s = status.toLowerCase();
  if (s.includes("await") || s.includes("pending") || s.includes("transit") || s.includes("processing") || s.includes("open")) return "pending";
  if (s.includes("verif") || s.includes("complete") || s.includes("deliver") || s.includes("resolv") || s.includes("sold") || s.includes("active")) return "completed";
  if (s.includes("flag") || s.includes("reject") || s.includes("inactive")) return "flagged";
  return "neutral";
}
