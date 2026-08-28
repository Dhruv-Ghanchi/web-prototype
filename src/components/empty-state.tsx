import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Package,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: any;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-lg border border-dashed py-12 px-6 text-center", className)}>
      <Icon className="h-8 w-8 text-muted-foreground/60" />
      <h3 className="mt-3 text-sm font-medium">{title}</h3>
      {description && <p className="mt-1 text-xs text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
