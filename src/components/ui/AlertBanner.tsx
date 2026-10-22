import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2, AlertOctagon } from "lucide-react";

export interface AlertBannerProps {
  type?: "info" | "warning" | "success" | "critical";
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AlertBanner({ type = "info", title, description, action, className }: AlertBannerProps) {
  const styles = {
    info: "bg-blue-50/90 border-blue-200 text-blue-900",
    warning: "bg-amber-50 border-amber-200 text-amber-950",
    success: "bg-emerald-50 border-emerald-200 text-emerald-950",
    critical: "bg-rose-50 border-rose-200 text-rose-950",
  };

  const icons = {
    info: <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />,
    critical: <AlertOctagon className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />,
  };

  return (
    <div className={cn("rounded-lg border p-4 flex items-start gap-3 shadow-xs", styles[type], className)}>
      {icons[type]}
      <div className="flex-1 text-sm">
        <h4 className="font-semibold leading-tight">{title}</h4>
        {description && <p className="mt-1 text-xs opacity-90 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
