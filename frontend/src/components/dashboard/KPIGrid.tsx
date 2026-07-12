"use client";

import * as React from "react";
import { StatCard } from "./StatCard";
import { useAuth } from "@/lib/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { DashboardStat } from "@/lib/mock/dashboard";

export function KPIGrid() {
  const { user } = useAuth();
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard", user?.role],
    queryFn: () => dashboardApi.get(user!.role),
    enabled: !!user,
  });

  const stats = React.useMemo<DashboardStat[]>(() => {
    if (!user || !metrics) return [];

    const role = user.role;
    if (role === "ADMIN") {
      return [
        {
          title: "Total Assets",
          value: metrics.totalAssets || 0,
          description: "All assets in database",
          iconName: "Package",
        },
        {
          title: "Allocated Assets",
          value: metrics.allocated || 0,
          description: "Currently in use",
          iconName: "UserCheck",
        },
        {
          title: "Active Bookings",
          value: metrics.activeBookings || 0,
          description: "Upcoming meeting rooms/vehicles",
          iconName: "Calendar",
        },
      ];
    }

    if (role === "ASSET_MANAGER") {
      return [
        {
          title: "Available Assets",
          value: metrics.assetsByStatus?.AVAILABLE || 0,
          description: "Ready for allocation",
          iconName: "Package",
        },
        {
          title: "Overdue Allocations",
          value: metrics.overdueAllocations || 0,
          description: "Return date passed",
          iconName: "Clock",
        },
        {
          title: "Pending Maintenance",
          value: metrics.pendingMaintenance || 0,
          description: "Awaiting approval",
          iconName: "Wrench",
        },
      ];
    }

    if (role === "DEPARTMENT_HEAD") {
      return [
        {
          title: "Department Assets",
          value: metrics.deptAssets || 0,
          description: "In own department",
          iconName: "Package",
        },
        {
          title: "Active Allocations",
          value: metrics.deptAllocations || 0,
          description: "Allocated to dept employees",
          iconName: "UserCheck",
        },
        {
          title: "Pending Maintenance",
          value: metrics.pendingMaintenance || 0,
          description: "Awaiting supervisor signoff",
          iconName: "Wrench",
        },
      ];
    }

    if (role === "EMPLOYEE") {
      return [
        {
          title: "My Allocated Assets",
          value: metrics.myAllocations?.length || 0,
          description: "Currently assigned to me",
          iconName: "UserCheck",
        },
        {
          title: "My Bookings",
          value: metrics.myBookings?.length || 0,
          description: "Meeting rooms & resources",
          iconName: "Calendar",
        },
        {
          title: "My Maintenance Requests",
          value: metrics.myMaintenance?.length || 0,
          description: "Total issues raised",
          iconName: "Wrench",
        },
      ];
    }

    if (role === "AUDITOR") {
      return [
        {
          title: "Total Audits",
          value: metrics.totalAudits || 0,
          description: "Audit cycle history",
          iconName: "Package",
        },
        {
          title: "Active Audits",
          value: metrics.activeAudits || 0,
          description: "In-progress cycles",
          iconName: "Clock",
        },
        {
          title: "Missing Assets",
          value: metrics.pendingItems || 0,
          description: "Marked missing during verification",
          iconName: "Clock",
        },
      ];
    }

    if (role === "TECHNICIAN") {
      return [
        {
          title: "Assigned Repairs",
          value: metrics.assigned || 0,
          description: "Awaiting work",
          iconName: "Wrench",
        },
        {
          title: "Tasks In Progress",
          value: metrics.inProgress || 0,
          description: "Active work",
          iconName: "Clock",
        },
        {
          title: "Resolved Repairs",
          value: metrics.resolved || 0,
          description: "Resolved maintenance tasks",
          iconName: "UserCheck",
        },
      ];
    }

    return [];
  }, [user, metrics]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border bg-card animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          description={stat.description}
          iconName={stat.iconName}
        />
      ))}
    </div>
  );
}
