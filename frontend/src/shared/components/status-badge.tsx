"use client";

import { Badge } from "@/shared/ui/badge";
import { cn } from "@/lib/utils";
import type { VerificationStatus, AuditStatus, NotificationPriority } from "@/shared/types";

type StatusType = VerificationStatus | AuditStatus | NotificationPriority | string;

const statusConfig: Record<string, { label: string; className: string }> = {
  // Verification
  verified: {
    label: "Verified",
    className: "bg-success-muted text-green-600 border-green-200",
  },
  missing: {
    label: "Missing",
    className: "bg-danger-muted text-red-600 border-red-200",
  },
  damaged: {
    label: "Damaged",
    className: "bg-warning-muted text-amber-600 border-amber-200",
  },
  pending: {
    label: "Pending",
    className: "bg-muted text-zinc-500 border-zinc-200",
  },
  // Audit
  "in-progress": {
    label: "In Progress",
    className: "bg-info-muted text-info border-info/20",
  },
  completed: {
    label: "Completed",
    className: "bg-success-muted text-green-600 border-green-200",
  },
  paused: {
    label: "Paused",
    className: "bg-warning-muted text-amber-600 border-amber-200",
  },
  draft: {
    label: "Draft",
    className: "bg-muted text-zinc-500 border-zinc-200",
  },
  // Priority
  low: {
    label: "Low",
    className: "bg-muted text-zinc-500 border-zinc-200",
  },
  medium: {
    label: "Medium",
    className: "bg-warning-muted text-amber-600 border-amber-200",
  },
  high: {
    label: "High",
    className: "bg-danger-muted text-red-600 border-red-200",
  },
  critical: {
    label: "Critical",
    className: "bg-danger-muted text-red-600 border-red-200 animate-pulse",
  },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  customLabel?: string;
  dot?: boolean;
}

export function StatusBadge({ status, className, customLabel, dot = false }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-muted text-zinc-500 border-zinc-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium px-2.5 py-0.5 rounded-full border gap-1.5 transition-colors",
        config.className,
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-success": status === "verified" || status === "completed",
            "bg-danger": status === "missing" || status === "high" || status === "critical",
            "bg-warning": status === "damaged" || status === "paused" || status === "medium",
            "bg-info": status === "in-progress",
            "bg-muted-foreground":
              status === "pending" || status === "draft" || status === "low",
          })}
        />
      )}
      {customLabel || config.label}
    </Badge>
  );
}
