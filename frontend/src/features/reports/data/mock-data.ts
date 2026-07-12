import type { TopAsset, IdleAsset, MaintenanceItem, RetirementAsset } from "@/shared/types";

export const departmentUtilization = [
  { name: "Engineering", utilization: 92, total: 340 },
  { name: "Design", utilization: 87, total: 128 },
  { name: "Marketing", utilization: 74, total: 95 },
  { name: "Sales", utilization: 81, total: 156 },
  { name: "Finance", utilization: 68, total: 127 },
  { name: "Operations", utilization: 78, total: 89 },
  { name: "HR", utilization: 61, total: 54 },
  { name: "Legal", utilization: 55, total: 32 },
];

export const maintenanceFrequency = [
  { name: "Jan", preventive: 12, corrective: 8, emergency: 2 },
  { name: "Feb", preventive: 15, corrective: 6, emergency: 1 },
  { name: "Mar", preventive: 11, corrective: 9, emergency: 3 },
  { name: "Apr", preventive: 18, corrective: 5, emergency: 1 },
  { name: "May", preventive: 14, corrective: 7, emergency: 2 },
  { name: "Jun", preventive: 16, corrective: 4, emergency: 0 },
  { name: "Jul", preventive: 20, corrective: 6, emergency: 1 },
];

export const topUsedAssets: TopAsset[] = [
  { id: "1", name: "Conference Room A — AV System", department: "Facilities", utilization: 94, bookings: 312 },
  { id: "2", name: "3D Printer — MakerBot S5", department: "Engineering", utilization: 89, bookings: 187 },
  { id: "3", name: "Company Van — Ford Transit", department: "Operations", utilization: 86, bookings: 156 },
  { id: "4", name: "Photography Studio Kit", department: "Marketing", utilization: 82, bookings: 143 },
  { id: "5", name: "Shared MacBook Pro Pool", department: "IT", utilization: 78, bookings: 234 },
];

export const idleAssets: IdleAsset[] = [
  { id: "1", name: "Projector — Epson EB-L530U", department: "Facilities", lastUsed: "2025-04-12", daysIdle: 89 },
  { id: "2", name: "Label Printer — Brother QL-820", department: "Warehouse", lastUsed: "2025-05-01", daysIdle: 70 },
  { id: "3", name: "Standing Desk Converter", department: "HR", lastUsed: "2025-05-20", daysIdle: 51 },
  { id: "4", name: "VR Headset — Meta Quest Pro", department: "R&D", lastUsed: "2025-06-01", daysIdle: 39 },
  { id: "5", name: "Portable Speaker — JBL Flip 6", department: "Marketing", lastUsed: "2025-06-15", daysIdle: 25 },
];

export const maintenanceDue: MaintenanceItem[] = [
  { id: "1", asset: "HVAC System — Floor 3", type: "Preventive", dueDate: "2025-07-15", priority: "high", status: "Overdue" },
  { id: "2", asset: "Elevator A", type: "Inspection", dueDate: "2025-07-18", priority: "high", status: "Due soon" },
  { id: "3", asset: "Fire Suppression System", type: "Annual Check", dueDate: "2025-07-22", priority: "medium", status: "Scheduled" },
  { id: "4", asset: "Generator — Backup Power", type: "Load Test", dueDate: "2025-07-25", priority: "medium", status: "Scheduled" },
  { id: "5", asset: "Server Rack UPS", type: "Battery Replace", dueDate: "2025-08-01", priority: "low", status: "Upcoming" },
];

export const retirementAssets: RetirementAsset[] = [
  { id: "1", name: "Dell OptiPlex 7080 (Batch)", purchaseDate: "2020-03-15", retirementDate: "2025-09-15", currentValue: "$2,400", department: "Finance" },
  { id: "2", name: "Cisco Catalyst 3850 Switch", purchaseDate: "2019-11-20", retirementDate: "2025-08-20", currentValue: "$1,800", department: "IT" },
  { id: "3", name: "HP LaserJet Pro M428fdn", purchaseDate: "2020-06-10", retirementDate: "2025-10-10", currentValue: "$350", department: "Admin" },
  { id: "4", name: "iPad Air 4th Gen (Pool)", purchaseDate: "2020-10-01", retirementDate: "2025-12-01", currentValue: "$1,200", department: "Sales" },
];
