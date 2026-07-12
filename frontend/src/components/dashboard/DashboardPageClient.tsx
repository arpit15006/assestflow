"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardPageClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-6 w-full"
    >
      {/* 1. Header Section */}
      <div className="flex flex-col space-y-1.5 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Asset Overview
          </h2>
          <p className="text-xs text-muted-foreground">
            Live operational status of your enterprise resource allocations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-lg h-10 px-4 text-sm font-medium border border-border text-foreground hover:bg-muted bg-background shadow-sm active:scale-95 transition-all duration-200"
            onClick={() => alert("New Asset Onboarding dialog is a mockup.")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Asset
          </Button>
          <Button
            className="rounded-lg h-10 px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95 transition-all duration-200"
            onClick={() => alert("New Transfer Request dialog is a mockup.")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* 2. Overdue Return Banner */}
      <AlertBanner />

      {/* 3. KPI Grid Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Key Performance Indicators
        </h3>
        <KPIGrid />
      </div>

      {/* 4. Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Quick Action Shortcuts
        </h3>
        <QuickActions />
      </div>

      {/* 5. Details Section (Activity, Alerts, Tasks) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Activity Feed */}
        <div className="lg:col-span-7">
          <RecentActivity />
        </div>

        {/* Right Column: Actionable Alerts & Tasks Stack */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <NotificationsPanel />
          <UpcomingTasks />
        </div>
      </div>
    </motion.div>
  );
}
