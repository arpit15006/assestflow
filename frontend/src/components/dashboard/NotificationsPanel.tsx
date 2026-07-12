"use client";

import * as React from "react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { AlertTriangle, Clock, Share2, Wrench, Calendar, Bell, CheckCheck } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";

const typeIconMap: Record<string, any> = {
  OVERDUE: AlertTriangle,
  TRANSFER: Share2,
  MAINTENANCE: Wrench,
  BOOKING: Calendar,
  ALLOCATION: Bell,
  SYSTEM: Clock,
  AUDIT: CheckCheck,
};

const typeColorMap: Record<string, string> = {
  MAINTENANCE: "text-amber-600 bg-amber-500/5 border-amber-500/10",
  BOOKING: "text-blue-600 bg-blue-500/5 border-blue-500/10",
  ALLOCATION: "text-green-600 bg-green-500/5 border-green-500/10",
  SYSTEM: "text-zinc-600 bg-zinc-500/5 border-zinc-200",
  AUDIT: "text-purple-600 bg-purple-500/5 border-purple-500/10",
  TRANSFER: "text-indigo-600 bg-indigo-500/5 border-indigo-500/10",
  OVERDUE: "text-destructive bg-destructive/5 border-destructive/10",
};

export function NotificationsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifData, isLoading } = useQuery({
    queryKey: ["notifications-panel"],
    queryFn: () => notificationsApi.list(1, 10),
  });

  const notifications = notifData?.notifications || (Array.isArray(notifData) ? notifData : []);

  const readMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.read(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications-panel"] }),
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationsApi.readAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-panel"] });
      toast({ type: "success", title: "All notifications marked as read." });
    },
  });

  const unread = notifications.filter((n: any) => !n.isRead);

  return (
    <Card className="flex flex-col h-full rounded-xl border border-border bg-card shadow-xs">
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Actionable Alerts
        </h2>
        <div className="flex items-center gap-2">
          {unread.length > 0 && (
            <span className="flex h-5 items-center rounded-full bg-primary/10 px-2.5 text-[10px] font-semibold text-primary">
              {unread.length} Unread
            </span>
          )}
          {unread.length > 0 && (
            <button
              onClick={() => readAllMutation.mutate()}
              className="text-[10px] text-muted-foreground hover:text-primary font-semibold transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <CardContent className="p-5 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl border border-border animate-pulse bg-muted/30" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Bell className="w-8 h-8 mb-2 text-muted-foreground/40" />
            <p className="text-sm font-semibold">No notifications</p>
            <p className="text-xs mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 8).map((notif: any) => {
              const Icon = typeIconMap[notif.type] || Bell;
              const color = typeColorMap[notif.type] || typeColorMap.SYSTEM;
              return (
                <div
                  key={notif.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 hover:opacity-90 ${color} ${notif.isRead ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card border border-border shadow-2xs">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground tracking-tight">{notif.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-normal">{notif.message}</p>
                    </div>
                  </div>
                  {!notif.isRead && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-[10px] font-medium border border-border text-foreground hover:bg-muted bg-background shadow-sm active:scale-95 transition-all duration-200 shrink-0 w-full sm:w-auto"
                      onClick={() => readMutation.mutate(notif.id)}
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
