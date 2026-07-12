"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/shared/lib/animations";
import { PageHeader, StatCard, ExportDropdown, FilterDropdown, SearchBar } from "@/shared/components";
import { Button } from "@/components/ui/Button";
import { Package, Gauge, DollarSign, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { DeptUtilizationChart } from "./charts/dept-utilization-chart";
import { MaintenanceChart } from "./charts/maintenance-chart";
import { TopAssetsList } from "./components/top-assets-list";
import { IdleAssetsTable } from "./components/idle-assets-table";
import { MaintenanceDueList, RetirementAssetsList } from "./components/maintenance-retirement";
import { useReportsStore } from "./store/reports-store";

const departmentOptions = [
  { label: "All Departments", value: "all" },
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Finance", value: "finance" },
];

const dateOptions = [
  { label: "Last 7 days", value: "last-7" },
  { label: "Last 30 days", value: "last-30" },
  { label: "Last 90 days", value: "last-90" },
  { label: "Year to date", value: "ytd" },
];

export default function ReportsPage() {
  const {
    isLoading,
    departmentFilter,
    dateRange,
    kpiFilter,
    searchQuery,
    kpis,
    departmentUtilization,
    maintenanceFrequency,
    topUsedAssets,
    idleAssets,
    maintenanceDue,
    retirementAssets,
    setDepartmentFilter,
    setDateRange,
    setKpiFilter,
    setSearchQuery,
    fetchData,
  } = useReportsStore();

  const [localSearch, setLocalSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce global search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, setSearchQuery]);

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    setIsExporting(true);
    toast.loading(`Exporting as ${format.toUpperCase()}...`, { id: "export" });
    try {
      const { exportReportsCsv, exportReportsExcel, exportReportsPdf } = await import("./utils/export");
      if (format === "csv") await exportReportsCsv(topUsedAssets, idleAssets);
      else if (format === "excel") await exportReportsExcel(topUsedAssets, idleAssets, maintenanceDue, retirementAssets);
      else if (format === "pdf") await exportReportsPdf(kpis, topUsedAssets, idleAssets);
      
      toast.success(`Exported ${format.toUpperCase()} successfully`, { id: "export" });
    } catch (e) {
      toast.error(`Failed to export ${format.toUpperCase()}`, { id: "export" });
    } finally {
      setIsExporting(false);
    }
  };

  // Basic client-side filtering for global search
  const filteredTopAssets = useMemo(() => {
    if (!searchQuery) return topUsedAssets;
    const lower = searchQuery.toLowerCase();
    return topUsedAssets.filter(a => a.name.toLowerCase().includes(lower) || a.department.toLowerCase().includes(lower));
  }, [topUsedAssets, searchQuery]);

  const filteredIdleAssets = useMemo(() => {
    if (!searchQuery) return idleAssets;
    const lower = searchQuery.toLowerCase();
    return idleAssets.filter(a => a.name.toLowerCase().includes(lower) || a.department.toLowerCase().includes(lower));
  }, [idleAssets, searchQuery]);

  if (isLoading && kpis.totalAssets === 0) {
    return (
      <div className="space-y-6 w-full p-6 lg:p-8">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
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
      {/* Header */}
      <PageHeader
        title="Reports & Analytics"
        subtitle="Monitor asset performance, utilization, and maintenance insights."
      >
        <SearchBar
          placeholder="Search reports..."
          value={localSearch}
          onChange={setLocalSearch}
          className="w-48 sm:w-64"
        />
        <FilterDropdown label="Date Range" options={dateOptions} value={dateRange} onChange={setDateRange} />
        <FilterDropdown label="Department" options={departmentOptions} value={departmentFilter} onChange={setDepartmentFilter} />
        <ExportDropdown onExport={handleExport} disabled={isExporting} />
      </PageHeader>

      {/* KPI Cards */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Assets" 
          value={kpis.totalAssets.toString()} 
          change={4.2} 
          changeLabel="vs last month" 
          icon={Package} 
          trend="up"
          isActive={kpiFilter === "assets"}
          onClick={() => setKpiFilter(kpiFilter === "assets" ? null : "assets")}
        />
        <StatCard 
          title="Utilization" 
          value={`${kpis.utilization}%`} 
          change={2.1} 
          changeLabel="vs last month" 
          icon={Gauge} 
          trend="up" 
          isActive={kpiFilter === "utilization"}
          onClick={() => setKpiFilter(kpiFilter === "utilization" ? null : "utilization")}
        />
        <StatCard 
          title="Maintenance Cost" 
          value={`₹${kpis.maintenanceCost.toLocaleString()}`} 
          change={-8.3} 
          changeLabel="vs last month" 
          icon={DollarSign} 
          trend="down" 
          isActive={kpiFilter === "maintenance"}
          onClick={() => setKpiFilter(kpiFilter === "maintenance" ? null : "maintenance")}
        />
        <StatCard 
          title="Bookings" 
          value={kpis.bookings.toLocaleString()} 
          change={12.5} 
          changeLabel="vs last month" 
          icon={CalendarDays} 
          trend="up" 
          isActive={kpiFilter === "bookings"}
          onClick={() => setKpiFilter(kpiFilter === "bookings" ? null : "bookings")}
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeptUtilizationChart data={departmentUtilization} />
        <MaintenanceChart data={maintenanceFrequency} />
      </div>

      {/* Top / Idle Assets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopAssetsList data={filteredTopAssets} />
        <IdleAssetsTable data={filteredIdleAssets} />
      </div>

      {/* Maintenance / Retirement Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceDueList data={maintenanceDue} />
        <RetirementAssetsList data={retirementAssets} />
      </div>
    </motion.div>
  );
}
