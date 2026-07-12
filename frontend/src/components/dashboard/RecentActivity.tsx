import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { mockActivities } from "@/lib/mock/activities";
import { Share2, Package, Calendar, Wrench, ClipboardCheck } from "lucide-react";

const iconMap = {
  ALLOCATION: Package,
  BOOKING: Calendar,
  MAINTENANCE: Wrench,
  AUDIT: ClipboardCheck,
  TRANSFER: Share2,
};

const colorMap = {
  ALLOCATION: "text-blue-600 bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
  BOOKING: "text-green-600 bg-green-50/50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30",
  MAINTENANCE: "text-amber-600 bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30",
  AUDIT: "text-purple-600 bg-purple-50/50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30",
  TRANSFER: "text-zinc-600 bg-zinc-50/50 border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900/30",
};

export function RecentActivity() {
  return (
    <Card className="flex flex-col h-full rounded-xl border border-border bg-card shadow-xs">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Recent Activity Timeline
        </h2>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Realtime feed
        </span>
      </div>

      <CardContent className="p-6 flex-1 overflow-y-auto">
        <div className="relative border-l border-border pl-4 space-y-6">
          {mockActivities.map((act) => {
            const Icon = iconMap[act.type];
            return (
              <div key={act.id} className="relative group">
                {/* Timeline Bullet Node Icon */}
                <div
                  className={`absolute -left-[30px] top-0 flex h-7 w-7 items-center justify-center rounded-lg border shadow-xs transition-transform duration-200 group-hover:scale-105
                    ${colorMap[act.type]}
                  `}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="space-y-1 pl-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-foreground leading-normal">
                      {act.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                    <span>Logged by:</span>
                    <span className="text-foreground font-semibold">{act.user}</span>
                    {act.status && (
                      <>
                        <span className="text-border">•</span>
                        <span className="text-primary font-semibold">
                          {act.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
