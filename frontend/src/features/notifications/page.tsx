"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeIn } from "@/shared/lib/animations";
import { PageHeader, EmptyState } from "@/shared/components";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Settings, CheckCheck, Bell } from "lucide-react";
import { NotificationCard } from "./components/notification-card";
import { notifications as initialNotifications } from "./data/mock-data";
import type { NotificationType } from "@/shared/types";

const tabs: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Alerts", value: "maintenance" },
  { label: "Approvals", value: "approval" },
  { label: "Bookings", value: "booking" },
  { label: "Maintenance", value: "maintenance-tab" },
  { label: "Audit", value: "audit" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    if (activeTab === "maintenance-tab") {
      return notifications.filter((n) => n.type === "maintenance");
    }
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6 lg:p-8 max-w-[1000px] mx-auto"
    >
      {/* Header */}
      <PageHeader title="Notifications" subtitle="Stay on top of asset activity across your organization.">
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <motion.div variants={fadeIn}>
              <Badge className="bg-primary/15 text-indigo-600 border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium">
                {unreadCount} unread
              </Badge>
            </motion.div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-lg gap-2 text-sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-lg"
            aria-label="Notification settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </PageHeader>

      {/* Tabs */}
      <motion.div variants={fadeIn}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-50 border border-zinc-200 rounded-xl p-1 h-auto flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg text-xs px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm text-zinc-500"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Notification Feed */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3 pr-4">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up. New notifications will appear here."
            />
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}
