"use client";

import { motion } from "framer-motion";
import { notificationSlide } from "@/shared/lib/animations";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Card, CardContent } from "@/components/ui/Card";
import { getInitials, relativeTime } from "@/shared/lib/utils";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/shared/types";
import {
  CalendarDays,
  Wrench,
  ClipboardCheck,
  CheckCircle2,
  ArrowRightLeft,
  PackagePlus,
} from "lucide-react";

const typeConfig: Record<NotificationType, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  booking: { icon: CalendarDays, color: "text-info", bgColor: "bg-info-muted" },
  maintenance: { icon: Wrench, color: "text-amber-600", bgColor: "bg-warning-muted" },
  audit: { icon: ClipboardCheck, color: "text-indigo-600", bgColor: "bg-info-muted" },
  approval: { icon: CheckCircle2, color: "text-green-600", bgColor: "bg-success-muted" },
  transfer: { icon: ArrowRightLeft, color: "text-zinc-500", bgColor: "bg-muted" },
  allocation: { icon: PackagePlus, color: "text-info", bgColor: "bg-info-muted" },
};

const priorityColors: Record<string, string> = {
  critical: "border-l-danger",
  high: "border-l-danger",
  medium: "border-l-warning",
  low: "border-l-transparent",
};

interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const { icon: TypeIcon, color, bgColor } = typeConfig[notification.type];

  return (
    <motion.div
      variants={notificationSlide}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      <Card
        className={cn(
          "rounded-2xl border-zinc-200 transition-all duration-200 cursor-pointer group overflow-hidden border-l-[3px]",
          notification.read
            ? "bg-white hover:bg-white/80"
            : "bg-zinc-100 hover:bg-zinc-50",
          priorityColors[notification.priority] || "border-l-transparent"
        )}
        onClick={() => !notification.read && onMarkRead?.(notification.id)}
        role="article"
        aria-label={`${notification.read ? "Read" : "Unread"} notification: ${notification.title}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3.5">
            {/* Icon */}
            <div className={cn("rounded-xl p-2.5 flex-shrink-0 mt-0.5", bgColor)}>
              <TypeIcon className={cn("h-4 w-4", color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm leading-snug",
                    notification.read ? "font-medium text-zinc-950" : "font-semibold text-zinc-950"
                  )}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                    {notification.description}
                  </p>
                </div>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 mt-2.5">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-muted text-zinc-500 text-[8px] font-medium">
                    {getInitials(notification.actor.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] text-zinc-500">{notification.actor.name}</span>
                <span className="text-zinc-500/30">·</span>
                <span className="text-[11px] text-zinc-500">{relativeTime(notification.timestamp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
