import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";

export const metadata: Metadata = {
  title: "Dashboard - AssetFlow AI",
  description: "Enterprise asset tracking, allocation, and resource bookings overview.",
};

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout>
      {/* 1. Header Section */}
      <div className="flex flex-col space-y-1.5 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            Today&apos;s Overview
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Welcome back, Arpit! Here is what requires your attention today.
          </p>
        </div>
        <div className="text-xs font-semibold text-zinc-500 bg-white border border-zinc-200/80 rounded-lg px-3.5 py-1.5 shadow-2xs shrink-0 self-start md:self-auto">
          {currentDate}
        </div>
      </div>

      {/* 2. Overdue Return Banner */}
      <AlertBanner />

      {/* 3. KPI Grid Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          Key Performance Indicators
        </h3>
        <KPIGrid />
      </div>

      {/* 4. Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
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
    </DashboardLayout>
  );
}
