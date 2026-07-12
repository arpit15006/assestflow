import { TopAsset, IdleAsset, MaintenanceItem, RetirementAsset } from "@/shared/types";
import { 
  departmentUtilization, 
  maintenanceFrequency, 
  topUsedAssets, 
  idleAssets, 
  maintenanceDue, 
  retirementAssets 
} from "../data/mock-data";

// Helper to simulate delay
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const ReportsAPI = {
  getDashboardKPIs: async (dept: string, range: string) => {
    await delay();
    let multi = 1;
    if (dept !== "all") multi *= 0.3;
    if (range === "ytd") multi *= 4;
    
    return {
      totalAssets: Math.floor(1300 * multi),
      utilization: +(78.4 * (multi > 1 ? 1.05 : 0.95)).toFixed(1),
      maintenanceCost: Math.floor(24500 * multi),
      bookings: Math.floor(1847 * multi),
    };
  },

  getUtilization: async (dept: string) => {
    await delay(500);
    if (dept === "all") return departmentUtilization;
    return departmentUtilization.filter(d => d.name.toLowerCase() === dept.toLowerCase());
  },

  getMaintenanceAnalytics: async (range: string) => {
    await delay(500);
    // return a subset based on range (mocking)
    if (range === "last-7") return maintenanceFrequency.slice(-1);
    if (range === "last-30") return maintenanceFrequency.slice(-2);
    return maintenanceFrequency;
  },

  getTopAssets: async (dept: string) => {
    await delay(600);
    if (dept === "all") return topUsedAssets;
    return topUsedAssets.filter(a => a.department.toLowerCase() === dept.toLowerCase());
  },

  getIdleAssets: async (dept: string) => {
    await delay(600);
    if (dept === "all") return idleAssets;
    return idleAssets.filter(a => a.department.toLowerCase() === dept.toLowerCase());
  },

  getMaintenanceDue: async (dept: string) => {
    await delay(600);
    // Just returning mock data for now, ignoring dept to always have data for demo
    return maintenanceDue;
  },

  getRetirementAssets: async (dept: string) => {
    await delay(600);
    if (dept === "all") return retirementAssets;
    return retirementAssets.filter(a => a.department.toLowerCase() === dept.toLowerCase());
  }
};
