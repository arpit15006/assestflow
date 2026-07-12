import * as React from "react";
import { StatCard } from "./StatCard";
import { mockDashboardStats } from "@/lib/mock/dashboard";

export function KPIGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockDashboardStats.map((stat) => (
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
