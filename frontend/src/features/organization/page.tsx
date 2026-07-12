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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "@/lib/api/departments";
import { api } from "@/lib/api/client";

export default function OrganizationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: serverDepts, isLoading: loadingDepts, refetch: refetchDepts } = useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentsApi.list(),
  });

  const { data: serverUsers, isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data?.data;
    },
  });

  const departments = React.useMemo<Department[]>(() => {
    if (!serverDepts) return [];
    return serverDepts.map((d: any) => ({
      id: d.id,
      name: d.name,
      manager: d.manager?.name || "--",
      parentDepartment: d.parentDepartment?.name || "--",
      employeesCount: d._count?.users || 0,
      status: d.status === "ACTIVE" ? "Active" : "Inactive",
    }));
  }, [serverDepts]);

  const [categories, setCategories] = React.useState<Category[]>(initialCategories);

  const employees = React.useMemo<Employee[]>(() => {
    if (!serverUsers) return [];
    return serverUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department?.name || "--",
      status: u.status === "ACTIVE" ? "Active" : "Inactive",
    }));
  }, [serverUsers]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"departments" | "categories" | "employees" | any>("departments");
  const [activeDialog, setActiveDialog] = React.useState<"departments" | "categories" | "employees" | null>(null);

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => departmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({ type: "success", title: "Deleted", description: "Department deleted successfully." });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ type: "success", title: "Deactivated", description: "Employee status updated to inactive." });
    },
  });

  const promoteUserMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => api.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ type: "success", title: "Employee role updated" });
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: (data: any) => departmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast({ type: "success", title: "Department created" });
      setActiveDialog(null);
    },
  });

  const handleRowAction = (action: string, item: Department | Category | Employee) => {
    if (action === "Delete") {
      if (activeTab === "departments") {
        deleteDepartmentMutation.mutate(item.id);
      } else if (activeTab === "categories") {
        setCategories((prev) => prev.filter((c) => c.id !== item.id));
        toast({ type: "success", title: "Deleted" });
      } else {
        deleteUserMutation.mutate(item.id);
      }
      return;
    }

    if (action === "Archive" || action === "Deactivate") {
      if (activeTab === "departments") {
        departmentsApi.update(item.id, { status: "INACTIVE" }).then(() => {
          queryClient.invalidateQueries({ queryKey: ["departments"] });
          toast({ type: "info", title: "Deactivated" });
        });
      } else if (activeTab === "categories") {
        setCategories((prev) => prev.map((c) => (c.id === item.id ? { ...c, status: "Inactive" } : c)));
        toast({ type: "info", title: "Deactivated" });
      } else {
        deleteUserMutation.mutate(item.id);
      }
      return;
    }

    if (action === "Promote" && activeTab === "employees") {
      // Switch next role level
      const currentRole = (item as Employee).role;
      const nextRole = currentRole === "EMPLOYEE" ? "DEPARTMENT_HEAD" : currentRole === "DEPARTMENT_HEAD" ? "ASSET_MANAGER" : "ADMIN";
      promoteUserMutation.mutate({ id: item.id, role: nextRole });
      return;
    }

    if (action === "View" || action === "Edit" || action === "Duplicate") {
      toast({ type: "info", title: `${action} — ${item.name}`, description: "Full editing UI coming soon." });
      return;
    }
  };

  const handleAddDepartment = (newDept: Omit<Department, "id" | "employeesCount" | "status">) => {
    createDepartmentMutation.mutate({
      name: newDept.name,
    });
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
    setActiveDialog(null);
  };

  const handleAddEmployee = (newEmp: Omit<Employee, "id" | "status">) => {
    api.post("/auth/register", {
      name: newEmp.name,
      email: newEmp.email,
      password: "Password123!", // Standard default password
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ type: "success", title: "Employee added", description: `${newEmp.name} has been registered.` });
      setActiveDialog(null);
    }).catch((err) => {
      toast({ type: "error", title: "Register failed", description: err?.response?.data?.message || "Error" });
    });
  };

  const handleRefresh = () => {
    Promise.all([refetchDepts(), refetchUsers()]).then(() => {
      toast({ type: "success", title: "Data refreshed", description: "Organization data is up to date." });
    });
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
