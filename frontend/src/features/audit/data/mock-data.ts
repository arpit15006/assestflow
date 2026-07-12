import type { AuditAsset, AuditOverview, TimelineEvent } from "@/shared/types";

export const auditOverview: AuditOverview = {
  name: "Q3 2025 — Full Asset Audit",
  status: "in-progress",
  progress: 67,
  startDate: "2025-07-01T09:00:00Z",
  endDate: "2025-09-30T17:00:00Z",
  department: "All Departments",
  auditors: [
    { id: "1", name: "Sarah Chen", avatar: "", role: "Lead Auditor" },
    { id: "2", name: "Marcus Lee", avatar: "", role: "Auditor" },
    { id: "3", name: "Priya Sharma", avatar: "", role: "Auditor" },
    { id: "4", name: "Alex Rivera", avatar: "", role: "Compliance" },
  ],
  stats: {
    verified: 847,
    missing: 23,
    damaged: 14,
    pending: 416,
  },
};

export const auditAssets: AuditAsset[] = [
  { id: "1", name: "MacBook Pro 16\"", assetTag: "AST-2024-0891", department: "Engineering", expectedLocation: "Floor 3, Desk 42", actualLocation: "Floor 3, Desk 42", assignedEmployee: "James Wilson", verificationStatus: "verified", lastVerified: "2025-07-10T14:30:00Z" },
  { id: "2", name: "Dell U2723QE Monitor", assetTag: "AST-2024-0456", department: "Design", expectedLocation: "Floor 2, Desk 18", actualLocation: "Floor 2, Desk 18", assignedEmployee: "Emily Zhang", verificationStatus: "verified", lastVerified: "2025-07-10T11:00:00Z" },
  { id: "3", name: "Cisco IP Phone 8845", assetTag: "AST-2023-1204", department: "Sales", expectedLocation: "Floor 1, Desk 7", actualLocation: "Not Found", assignedEmployee: "Robert Martinez", verificationStatus: "missing", lastVerified: "2025-07-09T16:45:00Z", notes: "Employee reports phone was moved to conference room" },
  { id: "4", name: "Herman Miller Aeron Chair", assetTag: "AST-2022-0734", department: "Operations", expectedLocation: "Floor 4, Desk 31", actualLocation: "Floor 4, Desk 31", assignedEmployee: "Lisa Park", verificationStatus: "damaged", lastVerified: "2025-07-10T09:15:00Z", notes: "Armrest mechanism broken, needs replacement" },
  { id: "5", name: "iPad Pro 12.9\"", assetTag: "AST-2024-1567", department: "Marketing", expectedLocation: "Floor 2, Cabinet A", actualLocation: "—", assignedEmployee: "David Kim", verificationStatus: "pending" },
  { id: "6", name: "Logitech MX Master 3S", assetTag: "AST-2024-2103", department: "Engineering", expectedLocation: "Floor 3, Desk 55", actualLocation: "Floor 3, Desk 55", assignedEmployee: "Natalie Brooks", verificationStatus: "verified", lastVerified: "2025-07-10T13:00:00Z" },
  { id: "7", name: "ThinkPad X1 Carbon Gen 11", assetTag: "AST-2023-0892", department: "Finance", expectedLocation: "Floor 5, Desk 12", actualLocation: "Not Found", assignedEmployee: "Thomas Wright", verificationStatus: "missing", notes: "Checked IT locker, not found" },
  { id: "8", name: "Samsung 49\" Ultrawide", assetTag: "AST-2024-0333", department: "Engineering", expectedLocation: "Floor 3, Desk 22", actualLocation: "Floor 3, Desk 22", assignedEmployee: "Sophia Garcia", verificationStatus: "verified", lastVerified: "2025-07-10T15:20:00Z" },
  { id: "9", name: "Jabra Evolve2 85 Headset", assetTag: "AST-2024-1789", department: "Customer Support", expectedLocation: "Floor 1, Desk 34", actualLocation: "Floor 1, Desk 34", assignedEmployee: "Michael Brown", verificationStatus: "damaged", notes: "Left ear cushion deteriorated" },
  { id: "10", name: "Ergotron LX Desk Mount", assetTag: "AST-2023-0567", department: "Design", expectedLocation: "Floor 2, Desk 9", actualLocation: "—", assignedEmployee: "Rachel Adams", verificationStatus: "pending" },
  { id: "11", name: "APC Smart-UPS 1500VA", assetTag: "AST-2022-0198", department: "IT Infrastructure", expectedLocation: "Server Room B", actualLocation: "Server Room B", assignedEmployee: "Kevin O'Brien", verificationStatus: "verified", lastVerified: "2025-07-10T08:30:00Z" },
  { id: "12", name: "Surface Pro 9", assetTag: "AST-2024-0444", department: "Sales", expectedLocation: "Floor 1, Desk 15", actualLocation: "—", assignedEmployee: "Hannah Lee", verificationStatus: "pending" },
];

export const auditTimeline: TimelineEvent[] = [
  { id: "1", title: "Audit initiated", description: "Q3 2025 Full Asset Audit cycle opened by Sarah Chen", timestamp: "2025-07-01T09:00:00Z", type: "audit", actor: "Sarah Chen" },
  { id: "2", title: "Engineering dept. scanning started", description: "Floor 3 asset verification in progress", timestamp: "2025-07-03T10:30:00Z", type: "scan", actor: "Marcus Lee" },
  { id: "3", title: "3 assets flagged as missing", description: "Cisco phone, ThinkPad X1, and wireless keyboard not at expected locations", timestamp: "2025-07-05T14:15:00Z", type: "flag", actor: "Priya Sharma" },
  { id: "4", title: "Damaged asset reported", description: "Herman Miller chair armrest mechanism flagged for replacement", timestamp: "2025-07-07T11:00:00Z", type: "damage", actor: "Alex Rivera" },
  { id: "5", title: "Finance dept. completed", description: "All 127 finance department assets verified", timestamp: "2025-07-09T16:00:00Z", type: "complete", actor: "Marcus Lee" },
  { id: "6", title: "847 assets verified", description: "Current verification progress at 67%", timestamp: "2025-07-10T17:00:00Z", type: "progress", actor: "System" },
];
