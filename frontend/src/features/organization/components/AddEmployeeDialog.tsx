"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Employee, Department } from "../types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Please select a department"),
  role: z.string().min(2, "Role must be at least 2 characters"),
});

type FormData = z.infer<typeof schema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: Omit<Employee, "id" | "status">) => void;
  departments: Department[];
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
  onAdd,
  departments,
}: AddEmployeeDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      role: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: FormData) => {
    onAdd(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Register a new employee profile to allocate assets and schedule resource bookings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="emp-name">Full Name</Label>
            <Input
              id="emp-name"
              placeholder="e.g. Priya Sharma"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="emp-email">Email Address</Label>
            <Input
              id="emp-email"
              type="email"
              placeholder="e.g. priya.sharma@company.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Department</Label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department && (
              <p className="text-xs text-destructive font-medium">{errors.department.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="emp-role">Role / Designation</Label>
            <Input
              id="emp-role"
              placeholder="e.g. Senior Software Engineer"
              {...register("role")}
            />
            {errors.role && (
              <p className="text-xs text-destructive font-medium">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
