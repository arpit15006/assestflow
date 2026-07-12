import * as React from "react";
import { Badge } from "@/shared/ui/badge";
import { AssetStatus } from "../types";

interface AssetStatusBadgeProps {
  status: AssetStatus;
}

export function AssetStatusBadge({ status }: AssetStatusBadgeProps) {
  const getStatusClass = (status: AssetStatus) => {
    switch (status) {
      case "Available":
        return "bg-green-500/10 text-green-700 border-green-200/50 hover:bg-green-500/10 font-medium";
      case "Allocated":
        return "bg-blue-500/10 text-blue-700 border-blue-200/50 hover:bg-blue-500/10 font-medium";
      case "Reserved":
        return "bg-amber-500/10 text-amber-700 border-amber-200/50 hover:bg-amber-500/10 font-medium";
      case "Maintenance":
        return "bg-purple-500/10 text-purple-700 border-purple-200/50 hover:bg-purple-500/10 font-medium";
      case "Lost":
        return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10 font-medium";
      case "Retired":
        return "bg-zinc-500/10 text-zinc-700 border-zinc-200/50 hover:bg-zinc-500/10 font-medium";
      case "Disposed":
        return "bg-red-500/10 text-red-700 border-red-200/50 hover:bg-red-500/10 font-medium";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted font-medium";
    }
  };

  return (
    <Badge variant="outline" className={getStatusClass(status)}>
      {status}
    </Badge>
  );
}
