import { create } from "zustand";
import { TopAsset, IdleAsset, MaintenanceItem, RetirementAsset } from "@/shared/types";
import { ReportsAPI } from "../services/mock-api";

interface ReportsState {
  isLoading: boolean;
  departmentFilter: string;
  dateRange: string;
  kpiFilter: string | null;
  
  kpis: {
    totalAssets: number;
    utilization: number;
    maintenanceCost: number;
    bookings: number;
  };
  
  departmentUtilization: { name: string; utilization: number; total: number }[];
  maintenanceFrequency: { name: string; preventive: number; corrective: number; emergency: number }[];
  topUsedAssets: TopAsset[];
  idleAssets: IdleAsset[];
  maintenanceDue: MaintenanceItem[];
  retirementAssets: RetirementAsset[];

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setDepartmentFilter: (filter: string) => void;
  setDateRange: (range: string) => void;
  setKpiFilter: (filter: string | null) => void;
  fetchData: () => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  isLoading: true,
  departmentFilter: "all",
  dateRange: "last-30",
  kpiFilter: null,
  searchQuery: "",
  
  kpis: {
    totalAssets: 0,
    utilization: 0,
    maintenanceCost: 0,
    bookings: 0,
  },
  
  departmentUtilization: [],
  maintenanceFrequency: [],
  topUsedAssets: [],
  idleAssets: [],
  maintenanceDue: [],
  retirementAssets: [],

  setSearchQuery: (q) => {
    set({ searchQuery: q });
  },

  setDepartmentFilter: (filter) => {
    set({ departmentFilter: filter });
    get().fetchData();
  },
  
  setDateRange: (range) => {
    set({ dateRange: range });
    get().fetchData();
  },
  
  setKpiFilter: (filter) => {
    set({ kpiFilter: filter });
  },

  fetchData: async () => {
    set({ isLoading: true });
    
    // Pass current filters to mock API
    const { departmentFilter, dateRange } = get();
    
    const [kpis, deptUtil, maintFreq, top, idle, maintDue, retire] = await Promise.all([
      ReportsAPI.getDashboardKPIs(departmentFilter, dateRange),
      ReportsAPI.getUtilization(departmentFilter),
      ReportsAPI.getMaintenanceAnalytics(dateRange),
      ReportsAPI.getTopAssets(departmentFilter),
      ReportsAPI.getIdleAssets(departmentFilter),
      ReportsAPI.getMaintenanceDue(departmentFilter),
      ReportsAPI.getRetirementAssets(departmentFilter),
    ]);

    set({
      kpis,
      departmentUtilization: deptUtil,
      maintenanceFrequency: maintFreq,
      topUsedAssets: top,
      idleAssets: idle,
      maintenanceDue: maintDue,
      retirementAssets: retire,
      isLoading: false
    });
  }
}));
