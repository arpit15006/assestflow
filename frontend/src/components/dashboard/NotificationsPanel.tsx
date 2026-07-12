"use client";

import * as React from "react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { mockNotifications } from "@/lib/mock/notifications";
import { AlertTriangle, Clock, Share2, Wrench, Calendar } from "lucide-react";

const iconMap = {
  OVERDUE: AlertTriangle,
  TRANSFER: Share2,
  MAINTENANCE: Wrench,
  BOOKING: Calendar,
};

const severityColorMap = {
  error: "text-destructive bg-destructive/5 border-destructive/10 dark:bg-destructive/10",
  warning: "text-amber-600 bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10",
  info: "text-blue-600 bg-blue-500/5 border-blue-500/10 dark:bg-blue-500/10",
};

export function NotificationsPanel() {
  const handleAction = (label: string, id: string) => {
    alert(`Action executed: "${label}" on notification ${id}. (Mock Flow)`);
  };

  return (
    <Card className="flex flex-col h-full rounded-xl border border-border bg-card shadow-xs">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Actionable Alerts
        </h2>
        <span className="flex h-5 items-center rounded-full bg-primary/10 px-2.5 text-[10px] font-semibold text-primary">
          {mockNotifications.length} Actionable
        </span>
      </div>

      <CardContent className="p-5 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {mockNotifications.map((not) => {
            const Icon = iconMap[not.type];
            return (
              <div
                key={not.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20
                  ${severityColorMap[not.severity]}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card border border-border shadow-2xs">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground tracking-tight">
                        {not.title}
                      </h4>
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {not.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {not.description}
                    </p>
                  </div>
                </div>

                {not.actionLabel && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-[10px] font-medium border border-border text-foreground hover:bg-muted bg-background shadow-sm active:scale-95 transition-all duration-200 shrink-0 w-full sm:w-auto"
                    onClick={() => handleAction(not.actionLabel!, not.id)}
                  >
                    {not.actionLabel}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
