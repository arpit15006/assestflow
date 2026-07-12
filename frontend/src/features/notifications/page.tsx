"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, fadeIn } from "@/shared/lib/animations";
import { PageHeader, EmptyState, SearchBar } from "@/shared/components";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Settings, CheckCheck, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationCard } from "./components/notification-card";
import { NotificationSettingsDialog, NotificationDetailsSheet } from "./components/notification-dialogs";
import { useNotificationsStore } from "./store/notifications-store";
import { Notification } from "@/shared/types";
import { toast } from "sonner";

const tabs: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Alerts", value: "maintenance" },
  { label: "Approvals", value: "approval" },
  { label: "Bookings", value: "booking" },
  { label: "Maintenance", value: "maintenance-tab" },
  { label: "Audit", value: "audit" },
];

export default function NotificationsPage() {
  const {
    notifications,
    isLoading,
    searchQuery,
    activeTab,
    fetchNotifications,
    setSearchQuery,
    setActiveTab,
    markAllRead,
    addSimulatedNotification
  } = useNotificationsStore();

  const [localSearch, setLocalSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Simulate real-time websocket
    const interval = setInterval(() => {
      addSimulatedNotification();
      toast.message("New notification received", { icon: <Bell className="h-4 w-4" /> });
    }, 25000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications, addSimulatedNotification]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    
    if (activeTab !== "all") {
      if (activeTab === "maintenance-tab") {
        filtered = filtered.filter((n) => n.type === "maintenance");
      } else {
        filtered = filtered.filter((n) => n.type === activeTab);
      }
    }
    
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(lower) || 
        n.description.toLowerCase().includes(lower) ||
        n.type.toLowerCase().includes(lower) ||
        n.actor.name.toLowerCase().includes(lower)
      );
    }
    
    return filtered;
  }, [notifications, activeTab, searchQuery]);

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: []
    };
    
    const today = new Date();
    
    filteredNotifications.forEach(n => {
      const date = new Date(n.timestamp);
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) groups.Today.push(n);
      else if (diffDays === 2) groups.Yesterday.push(n);
      else if (diffDays <= 7) groups['This Week'].push(n);
      else groups.Earlier.push(n);
    });
    
    return groups;
  }, [filteredNotifications]);

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    await markAllRead();
    toast.success("All notifications marked as read");
    setIsMarkingAll(false);
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="space-y-6 w-full p-6 lg:p-8">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full"
    >
      <PageHeader title="Notifications" subtitle="Stay on top of asset activity across your organization.">
        <div className="flex items-center gap-3">
          <SearchBar 
            placeholder="Search notifications..." 
            value={localSearch} 
            onChange={setLocalSearch} 
            className="w-48 sm:w-64"
          />
          {unreadCount > 0 && (
            <motion.div variants={fadeIn} className="hidden sm:block">
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
            disabled={unreadCount === 0 || isMarkingAll}
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{isMarkingAll ? 'Processing...' : 'Mark all read'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-lg"
            aria-label="Notification settings"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </PageHeader>

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

      <ScrollArea className="h-[calc(100vh-280px)]">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-6 pr-4 pb-12">
              {Object.entries(groupedNotifications).map(([group, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={group} className="space-y-3">
                    <h3 className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {group}
                    </h3>
                    {items.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onClickDetails={setSelectedNotification}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title={searchQuery ? "No search results" : "No notifications"}
              description={searchQuery ? "Try adjusting your search terms." : "You're all caught up. New notifications will appear here."}
            />
          )}
        </AnimatePresence>
      </ScrollArea>

      <NotificationSettingsDialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      <NotificationDetailsSheet 
        notification={selectedNotification} 
        onClose={() => setSelectedNotification(null)} 
      />
    </motion.div>
  );
}
