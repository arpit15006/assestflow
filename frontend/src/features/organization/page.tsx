"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { initialDepartments, initialCategories, initialEmployees } from "./data";
import { Department, Category, Employee } from "./types";
import { DepartmentTable } from "./components/DepartmentTable";
import { CategoryTable } from "./components/CategoryTable";
import { EmployeeTable } from "./components/EmployeeTable";
import { DepartmentToolbar } from "./components/DepartmentToolbar";
import { AddDepartmentDialog } from "./components/AddDepartmentDialog";
import { AddCategoryDialog } from "./components/AddCategoryDialog";
import { AddEmployeeDialog } from "./components/AddEmployeeDialog";
import { useToast } from "@/components/ui/Toast";

export default function OrganizationPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = React.useState<Department[]>(initialDepartments);
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [employees, setEmployees] = React.useState<Employee[]>(initialEmployees);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"departments" | "categories" | "employees">("departments");
  const [activeDialog, setActiveDialog] = React.useState<"departments" | "categories" | "employees" | null>(null);

  const handleRowAction = (action: string, item: Department | Category | Employee) => {
    if (action === "Delete") {
      if (activeTab === "departments") {
        setDepartments((prev) => prev.filter((d) => d.id !== item.id));
      } else if (activeTab === "categories") {
        setCategories((prev) => prev.filter((c) => c.id !== item.id));
      } else {
        setEmployees((prev) => prev.filter((e) => e.id !== item.id));
      }
      toast({ type: "success", title: "Deleted", description: `${item.name} has been removed.` });
      return;
    }

    if (action === "Archive" || action === "Deactivate") {
      if (activeTab === "departments") {
        setDepartments((prev) => prev.map((d) => (d.id === item.id ? { ...d, status: "Inactive" } : d)));
      } else if (activeTab === "categories") {
        setCategories((prev) => prev.map((c) => (c.id === item.id ? { ...c, status: "Inactive" } : c)));
      } else {
        setEmployees((prev) => prev.map((e) => (e.id === item.id ? { ...e, status: "Inactive" } : e)));
      }
      toast({ type: "info", title: "Deactivated", description: `${item.name} has been set to Inactive.` });
      return;
    }

    if (action === "Promote" && activeTab === "employees") {
      setEmployees((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, role: `Lead ${e.role}` } : e))
      );
      toast({ type: "success", title: "Employee promoted", description: `${item.name} has been promoted.` });
      return;
    }

    if (action === "View" || action === "Edit" || action === "Duplicate") {
      toast({ type: "info", title: `${action} — ${item.name}`, description: "Full editing UI coming soon." });
      return;
    }
  };

  const handleAddDepartment = (newDept: Omit<Department, "id" | "employeesCount" | "status">) => {
    const dept: Department = {
      ...newDept,
      id: `dept-${Date.now()}`,
      status: "Active",
      employeesCount: 0,
    };
    setDepartments((prev) => [dept, ...prev]);
    toast({ type: "success", title: "Department created", description: `"${dept.name}" has been added.` });
  };

  const handleAddCategory = (newCat: Omit<Category, "id" | "assetsCount" | "status">) => {
    const cat: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
      status: "Active",
      assetsCount: 0,
    };
    setCategories((prev) => [cat, ...prev]);
    toast({ type: "success", title: "Category created", description: `"${cat.name}" has been added.` });
  };

  const handleAddEmployee = (newEmp: Omit<Employee, "id" | "status">) => {
    const emp: Employee = {
      ...newEmp,
      id: `emp-${Date.now()}`,
      status: "Active",
    };
    setEmployees((prev) => [emp, ...prev]);
    toast({ type: "success", title: "Employee added", description: `${emp.name} has been registered.` });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ type: "success", title: "Data refreshed", description: "Organization data is up to date." });
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-6 w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Organization Setup</h1>
          <p className="text-sm text-muted-foreground">
            Manage departments, asset categories, and employee records.
          </p>
        </div>
      </div>

      <DepartmentToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onAddClick={() => setActiveDialog(activeTab)}
        onRefresh={handleRefresh}
      />

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as any);
          setSearchQuery("");
        }}
        className="w-full space-y-4"
      >
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="departments" className="text-xs font-semibold px-4 py-1.5 rounded-md">
            Departments ({departments.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs font-semibold px-4 py-1.5 rounded-md">
            Categories ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="employees" className="text-xs font-semibold px-4 py-1.5 rounded-md">
            Employees ({employees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="focus-visible:outline-none">
          <DepartmentTable data={departments} searchQuery={searchQuery} onAction={handleRowAction} />
        </TabsContent>

        <TabsContent value="categories" className="focus-visible:outline-none">
          <CategoryTable data={categories} searchQuery={searchQuery} onAction={handleRowAction} />
        </TabsContent>

        <TabsContent value="employees" className="focus-visible:outline-none">
          <EmployeeTable data={employees} searchQuery={searchQuery} onAction={handleRowAction} />
        </TabsContent>
      </Tabs>

      <AddDepartmentDialog
        open={activeDialog === "departments"}
        onOpenChange={(open) => setActiveDialog(open ? "departments" : null)}
        onAdd={handleAddDepartment}
        departments={departments}
      />
      <AddCategoryDialog
        open={activeDialog === "categories"}
        onOpenChange={(open) => setActiveDialog(open ? "categories" : null)}
        onAdd={handleAddCategory}
      />
      <AddEmployeeDialog
        open={activeDialog === "employees"}
        onOpenChange={(open) => setActiveDialog(open ? "employees" : null)}
        onAdd={handleAddEmployee}
        departments={departments}
      />
    </motion.div>
  );
}
