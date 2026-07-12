export type DepartmentStatus = "Active" | "Inactive";
export type CategoryStatus = "Active" | "Inactive";
export type EmployeeStatus = "Active" | "Inactive";

export interface Department {
  id: string;
  name: string;
  head: string;
  parentDept: string;
  status: DepartmentStatus;
  employeesCount: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  assetsCount: number;
  warrantyPeriod: number; // in months
  status: CategoryStatus;
}

export interface Employee {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: EmployeeStatus;
}
