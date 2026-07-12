// ============================================
// AssetFlow AI — Shared Type System
// ============================================

export type VerificationStatus = "verified" | "missing" | "damaged" | "pending";
export type AuditStatus = "in-progress" | "completed" | "paused" | "draft";
export type NotificationType = "booking" | "maintenance" | "audit" | "approval" | "transfer" | "allocation";
export type NotificationPriority = "low" | "medium" | "high" | "critical";

export interface StatCardData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface AuditAsset {
  id: string;
  name: string;
  assetTag: string;
  department: string;
  expectedLocation: string;
  actualLocation: string;
  assignedEmployee: string;
  verificationStatus: VerificationStatus;
  lastVerified?: string;
  notes?: string;
}

export interface AuditOverview {
  name: string;
  status: AuditStatus;
  progress: number;
  startDate: string;
  endDate: string;
  auditors: AuditorInfo[];
  department: string;
  stats: {
    verified: number;
    missing: number;
    damaged: number;
    pending: number;
  };
}

export interface AuditorInfo {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  priority: NotificationPriority;
  actor: {
    name: string;
    avatar: string;
  };
  actionUrl?: string;
  metadata?: Record<string, string>;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: string;
  actor?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface TopAsset {
  id: string;
  name: string;
  department: string;
  utilization: number;
  bookings: number;
}

export interface IdleAsset {
  id: string;
  name: string;
  department: string;
  lastUsed: string;
  daysIdle: number;
}

export interface MaintenanceItem {
  id: string;
  asset: string;
  type: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: string;
}

export interface RetirementAsset {
  id: string;
  name: string;
  purchaseDate: string;
  retirementDate: string;
  currentValue: string;
  department: string;
}
