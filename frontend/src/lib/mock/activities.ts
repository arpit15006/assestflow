export interface Activity {
  id: string;
  type: "ALLOCATION" | "BOOKING" | "MAINTENANCE" | "AUDIT" | "TRANSFER";
  message: string;
  user: string;
  time: string;
  status?: string;
}

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    type: "ALLOCATION",
    message: "Laptop MacBook Pro (AF-0012) allocated to Priya Sharma",
    user: "Arpit Patel",
    time: "2 hours ago",
  },
  {
    id: "act-2",
    type: "BOOKING",
    message: "Meeting Room B2 booked for today 14:00 - 15:30",
    user: "Raj Malhotra",
    time: "4 hours ago",
    status: "Upcoming",
  },
  {
    id: "act-3",
    type: "MAINTENANCE",
    message: "Printer HP LaserJet (AF-0104) reported for repair",
    user: "Priya Sharma",
    time: "Yesterday",
    status: "Pending Approval",
  },
  {
    id: "act-4",
    type: "AUDIT",
    message: "Audit Cycle 'Q2 Hardware Inventory' completed successfully",
    user: "Amit Verma",
    time: "2 days ago",
  },
  {
    id: "act-5",
    type: "TRANSFER",
    message: "Asset Transfer Request: Server Rack to IT Support approved",
    user: "Arpit Patel",
    time: "3 days ago",
  },
];
