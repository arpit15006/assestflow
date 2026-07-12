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
  ALLOCATION: "text-blue-600 bg-blue-50 border-blue-100",
  BOOKING: "text-green-600 bg-green-50 border-green-100",
  MAINTENANCE: "text-amber-600 bg-amber-50 border-amber-100",
  AUDIT: "text-purple-600 bg-purple-50 border-purple-100",
  TRANSFER: "text-zinc-600 bg-zinc-50 border-zinc-100",
};

export function RecentActivity() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b border-zinc-100 px-6 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-zinc-900 tracking-tight">
          Recent Activity Timeline
        </CardTitle>
        <span className="text-xxs font-bold text-zinc-400 uppercase tracking-widest">
          Realtime feed
        </span>
      </CardHeader>

      <CardContent className="p-6 flex-1 overflow-y-auto">
        <div className="relative border-l border-zinc-200 pl-4 space-y-6">
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
                    <p className="text-xs font-semibold text-zinc-800 leading-normal">
                      {act.message}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-medium shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
                    <span>Logged by:</span>
                    <span className="text-zinc-600 font-semibold">{act.user}</span>
                    {act.status && (
                      <>
                        <span className="text-zinc-300">•</span>
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
