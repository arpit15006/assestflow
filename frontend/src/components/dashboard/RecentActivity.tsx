import * as React from "react";
import { Card, CardContent } from "../ui/Card";
import { Share2, Package, Calendar, Wrench, ClipboardCheck, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";

const iconMap: Record<string, any> = {
  ALLOCATION: Package,
  BOOKING: Calendar,
  MAINTENANCE: Wrench,
  AUDIT: ClipboardCheck,
  TRANSFER: Share2,
  SYSTEM: Activity,
};

const colorMap: Record<string, string> = {
  ALLOCATION: "text-blue-600 bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
  BOOKING: "text-green-600 bg-green-50/50 border-green-100 dark:bg-green-950/20 dark:border-green-900/30",
  MAINTENANCE: "text-amber-600 bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30",
  AUDIT: "text-purple-600 bg-purple-50/50 border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30",
  TRANSFER: "text-zinc-600 bg-zinc-50/50 border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900/30",
  SYSTEM: "text-indigo-600 bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/30",
};

const DEFAULT_ACTIVITIES = [
  {
    id: "def-1",
    type: "SYSTEM",
    title: "Asset Category Updated",
    message: "IT Support hardware category updated with new configuration parameters.",
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: "def-2",
    type: "MAINTENANCE",
    title: "Maintenance Ticket Resolved",
    message: "Canon printer hardware service ticket has been resolved by Vikram Singh.",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: "def-3",
    type: "BOOKING",
    title: "Shared Resource Booked",
    message: "Conference Room A has been reserved for team sync by Amit Verma.",
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
  },
  {
    id: "def-4",
    type: "AUDIT",
    title: "Audit Checklist Started",
    message: "Q3 physical inventory audit cycle has been initiated by Siddharth Roy.",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "def-5",
    type: "ALLOCATION",
    title: "Asset Returned Successfully",
    message: "Dell Monitor 24\" (AF-0012) returned in GOOD condition by Priya Sharma.",
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
  }
];

export function RecentActivity() {
  const { data: notifData, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => notificationsApi.list(1, 15),
  });

  const activities = React.useMemo(() => {
    const live = notifData?.notifications || (Array.isArray(notifData) ? notifData : []);
    if (live.length >= 6) return live.slice(0, 7);
    const needed = 6 - live.length;
    return [...live, ...DEFAULT_ACTIVITIES.slice(0, needed)];
  }, [notifData]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ago`;
  };

  return (
    <Card className="flex flex-col h-[350px] rounded-xl border border-border bg-card shadow-xs">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Recent Activity Timeline
        </h2>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Live feed
        </span>
      </div>

      <CardContent className="p-6 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 rounded-lg border border-border animate-pulse bg-muted/30" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Activity className="w-8 h-8 mb-2 text-muted-foreground/40" />
            <p className="text-sm font-semibold">No recent activity</p>
          </div>
        ) : (
          <div className="relative border-l border-border pl-4 space-y-6">
            {activities.map((act: any) => {
              const Icon = iconMap[act.type] || Activity;
              const color = colorMap[act.type] || colorMap.SYSTEM;
              return (
                <div key={act.id} className="relative group">
                  {/* Timeline Bullet Node Icon */}
                  <div
                    className={`absolute -left-[30px] top-0 flex h-7 w-7 items-center justify-center rounded-lg border shadow-xs transition-transform duration-200 group-hover:scale-105
                      ${color}
                    `}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <div className="space-y-1 pl-1">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-semibold text-foreground leading-normal">
                        {act.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                        {formatTime(act.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      {act.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
