export interface AppNotification {
  id: string;
  type: "OVERDUE" | "TRANSFER" | "MAINTENANCE" | "BOOKING";
  title: string;
  description: string;
  time: string;
  severity: "info" | "warning" | "error";
  actionLabel?: string;
}

export const mockNotifications: AppNotification[] = [
  {
    id: "not-1",
    type: "OVERDUE",
    title: "Overdue Return Alert",
    description: "Laptop Dell XPS (AF-0114) held by Raj Malhotra is 3 days past due.",
    time: "30m ago",
    severity: "error",
    actionLabel: "Send Reminder",
  },
  {
    id: "not-2",
    type: "TRANSFER",
    title: "Pending Transfer Approval",
    description: "Request to transfer iPad Pro (AF-0056) from Engineering to Design.",
    time: "1h ago",
    severity: "warning",
    actionLabel: "Review Request",
  },
  {
    id: "not-3",
    type: "MAINTENANCE",
    title: "Maintenance Scheduled Today",
    description: "Office Projector (AF-0201) scheduled for hardware cleaning at 16:00.",
    time: "2h ago",
    severity: "info",
    actionLabel: "Assign Tech",
  },
  {
    id: "not-4",
    type: "BOOKING",
    title: "Upcoming Booking",
    description: "You have reserved Conference Room A today from 15:00 - 16:00.",
    time: "3h ago",
    severity: "info",
  },
];
