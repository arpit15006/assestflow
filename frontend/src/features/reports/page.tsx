"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/shared/lib/animations";
import { PageHeader, StatCard, ExportDropdown, FilterDropdown } from "@/shared/components";
import { Button } from "@/components/ui/Button";
import { Package, Gauge, DollarSign, CalendarDays } from "lucide-react";

import { DeptUtilizationChart } from "./charts/dept-utilization-chart";
import { MaintenanceChart } from "./charts/maintenance-chart";
import { TopAssetsList } from "./components/top-assets-list";
import { IdleAssetsTable } from "./components/idle-assets-table";
import { MaintenanceDueList, RetirementAssetsList } from "./components/maintenance-retirement";
import {
  departmentUtilization,
  maintenanceFrequency,
  topUsedAssets,
  idleAssets,
  maintenanceDue,
  retirementAssets,
} from "./data/mock-data";

const departmentOptions = [
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Finance", value: "finance" },
];

export default function ReportsPage() {
  const [deptFilter, setDeptFilter] = useState("all");
  const [dateRange, setDateRange] = useState("last-30");

  const dateOptions = [
    { label: "Last 7 days", value: "last-7" },
    { label: "Last 30 days", value: "last-30" },
    { label: "Last 90 days", value: "last-90" },
    { label: "Year to date", value: "ytd" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8 p-6 lg:p-8 max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <PageHeader
        title="Reports & Analytics"
        subtitle="Monitor asset performance, utilization, and maintenance insights."
      >
        <FilterDropdown label="Date Range" options={dateOptions} value={dateRange} onChange={setDateRange} />
        <FilterDropdown label="Department" options={departmentOptions} value={deptFilter} onChange={setDeptFilter} />
        <ExportDropdown />
      </PageHeader>

      {/* KPI Cards */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assets" value="1,300" change={4.2} changeLabel="vs last month" icon={Package} trend="up" />
        <StatCard title="Utilization" value="78.4%" change={2.1} changeLabel="vs last month" icon={Gauge} trend="up" />
        <StatCard title="Maintenance Cost" value="$24,500" change={-8.3} changeLabel="vs last month" icon={DollarSign} trend="down" />
        <StatCard title="Bookings" value="1,847" change={12.5} changeLabel="vs last month" icon={CalendarDays} trend="up" />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeptUtilizationChart data={departmentUtilization} />
        <MaintenanceChart data={maintenanceFrequency} />
      </div>

      {/* Top / Idle Assets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAssetsList data={topUsedAssets} />
        <IdleAssetsTable data={idleAssets} />
      </div>

      {/* Maintenance / Retirement Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceDueList data={maintenanceDue} />
        <RetirementAssetsList data={retirementAssets} />
      </div>
    </motion.div>
  );
}
