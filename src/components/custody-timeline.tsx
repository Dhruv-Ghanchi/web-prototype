import { Check, Circle, Clock } from "lucide-react";
import type { TimelineStep } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export function CustodyTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative pl-8">
      <div className="dotted-trail absolute left-3 top-2 bottom-2 w-[2px]" aria-hidden />
      {steps.map((s, i) => {
        const Icon = s.status === "done" ? Check : s.status === "current" ? Clock : Circle;
        const iconClass =
          s.status === "done"
            ? "bg-green text-green-foreground border-green"
            : s.status === "current"
            ? "bg-amber text-amber-foreground border-amber"
            : "bg-background text-muted-foreground border-border";
        return (
          <li key={i} className="relative mb-5 last:mb-0">
            <span
              className={cn(
                "absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2",
                iconClass
              )}
            >
              <Icon className="h-3 w-3" strokeWidth={3} />
            </span>
            <div className="flex flex-col">
              <p className={cn("text-sm font-medium", s.status === "upcoming" && "text-muted-foreground")}>
                {s.label}
              </p>
              <p className="text-xs text-muted-foreground">{s.who}</p>
              <p className="text-xs font-mono text-muted-foreground/80 mt-0.5">{s.when}</p>
              {s.note && <p className="text-xs mt-1 text-muted-foreground italic">{s.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
