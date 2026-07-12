"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
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
  error: "text-red-600 bg-red-50 border-red-100/50",
  warning: "text-amber-600 bg-amber-50 border-amber-100/50",
  info: "text-blue-600 bg-blue-50 border-blue-100/50",
};

export function NotificationsPanel() {
  const handleAction = (label: string, id: string) => {
    alert(`Action executed: "${label}" on notification ${id}. (Mock Flow)`);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-zinc-100 px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-zinc-900 tracking-tight">
          Actionable Alerts
        </CardTitle>
        <span className="flex h-5 items-center rounded-full bg-primary/10 px-2.5 text-xxs font-semibold text-primary">
          {mockNotifications.length} Actionable
        </span>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {mockNotifications.map((not) => {
            const Icon = iconMap[not.type];
            return (
              <div
                key={not.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 hover:bg-zinc-50/50
                  ${severityColorMap[not.severity]}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-current/10 shadow-xs">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-zinc-800 tracking-tight">
                        {not.title}
                      </h4>
                      <span className="text-[9px] text-zinc-400 font-medium">
                        {not.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      {not.description}
                    </p>
                  </div>
                </div>

                {not.actionLabel && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-[10px] font-semibold border-current/20 hover:bg-current/5 shrink-0 w-full sm:w-auto"
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
