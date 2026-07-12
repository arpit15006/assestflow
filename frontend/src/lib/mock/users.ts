export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ASSET_MANAGER" | "DEPARTMENT_HEAD" | "EMPLOYEE" | "AUDITOR" | "TECHNICIAN";
  avatarUrl?: string;
  department?: string;
}

export const currentUser: User = {
  id: "u-1",
  name: "Arpit Patel",
  email: "arpit@assetflow.ai",
  role: "ADMIN",
  avatarUrl: "",
  department: "Engineering",
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: "u-2",
    name: "Priya Sharma",
    email: "priya@assetflow.ai",
    role: "ASSET_MANAGER",
    department: "Operations",
  },
  {
    id: "u-3",
    name: "Raj Malhotra",
    email: "raj@assetflow.ai",
    role: "DEPARTMENT_HEAD",
    department: "Sales",
  },
  {
    id: "u-4",
    name: "Amit Verma",
    email: "amit@assetflow.ai",
    role: "TECHNICIAN",
    department: "IT Support",
  },
];
