export interface DashboardStat {
  title: string;
  value: number;
  trend?: string;
  description?: string;
  iconName: "Package" | "UserCheck" | "Wrench" | "Calendar" | "Repeat" | "Clock";
}

export const mockDashboardStats: DashboardStat[] = [
  {
    title: "Available Assets",
    value: 142,
    trend: "+8%",
    description: "vs last month",
    iconName: "Package",
  },
  {
    title: "Allocated Assets",
    value: 384,
    trend: "+12%",
    description: "vs last month",
    iconName: "UserCheck",
  },
  {
    title: "Under Maintenance",
    value: 12,
    trend: "-4%",
    description: "vs last week",
    iconName: "Wrench",
  },
  {
    title: "Active Bookings",
    value: 28,
    trend: "+15%",
    description: "vs last week",
    iconName: "Calendar",
  },
  {
    title: "Pending Transfers",
    value: 7,
    description: "Requires approval",
    iconName: "Repeat",
  },
  {
    title: "Upcoming Returns",
    value: 19,
    description: "Within next 3 days",
    iconName: "Clock",
  },
];

export interface UpcomingTask {
  id: string;
  title: string;
  assignee?: string;
  time: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
}

export const mockUpcomingTasks: UpcomingTask[] = [
  {
    id: "task-1",
    title: "Conduct audit for 'IT Labs Equipment'",
    time: "Today, 14:00",
    status: "Pending",
    priority: "High",
  },
  {
    id: "task-2",
    title: "Approve pending asset transfer requests",
    time: "Today, 16:30",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "task-3",
    title: "Register new incoming office laptops batch",
    time: "Tomorrow, 10:00",
    status: "Pending",
    priority: "High",
  },
  {
    id: "task-4",
    title: "Run maintenance check on Meeting Room B2 AC",
    time: "Tomorrow, 12:00",
    status: "Pending",
    priority: "Low",
  },
];
