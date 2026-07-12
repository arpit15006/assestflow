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
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useNotificationsStore } from "../store/notifications-store";

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
  onClickDetails: (n: Notification) => void;
}

export function NotificationCard({ notification, onClickDetails }: NotificationCardProps) {
  const { icon: TypeIcon, color, bgColor } = typeConfig[notification.type];
  const { markRead, deleteNotification } = useNotificationsStore();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking dropdown
    if ((e.target as HTMLElement).closest('[data-dropdown]')) return;
    
    if (!notification.read) {
      markRead(notification.id);
    }
    onClickDetails(notification);
  };

  const handleDropdownAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (action === 'delete') {
      deleteNotification(notification.id);
      toast.success("Notification deleted");
    } else if (action === 'archive') {
      deleteNotification(notification.id);
      toast.success("Notification archived");
    } else if (action === 'copy') {
      navigator.clipboard.writeText(`Notification: ${notification.title}`);
      toast.success("Link copied to clipboard");
    } else if (action === 'details') {
      onClickDetails(notification);
    }
  };

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
        onClick={handleCardClick}
        role="article"
      >
        <CardContent className="p-4 relative">
          <div className="absolute top-4 right-4" data-dropdown>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 rounded-lg">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-40 bg-white border-zinc-200 rounded-xl p-1">
                <DropdownMenuItem onClick={(e) => handleDropdownAction(e, 'details')} className="rounded-lg text-sm text-zinc-600 focus:bg-zinc-50 cursor-pointer">
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDropdownAction(e, 'archive')} className="rounded-lg text-sm text-zinc-600 focus:bg-zinc-50 cursor-pointer">
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDropdownAction(e, 'copy')} className="rounded-lg text-sm text-zinc-600 focus:bg-zinc-50 cursor-pointer">
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleDropdownAction(e, 'delete')} className="rounded-lg text-sm text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-start gap-3.5 pr-10">
            {/* Icon */}
            <div className={cn("rounded-xl p-2.5 flex-shrink-0 mt-0.5", bgColor)}>
              <TypeIcon className={cn("h-4 w-4", color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm leading-snug pr-4",
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
