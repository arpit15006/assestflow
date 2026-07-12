"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { Category } from "../types";

const schema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  warrantyPeriod: z.number().min(0, "Warranty period cannot be negative"),
});

type FormData = z.infer<typeof schema>;

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: Omit<Category, "id" | "assetsCount" | "status">) => void;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onAdd,
}: AddCategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      warrantyPeriod: 12,
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
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Onboard a new asset category defining default descriptions and warranty durations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Category Name</Label>
            <Input
              id="cat-name"
              placeholder="e.g. IT Equipment"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Input
              id="cat-desc"
              placeholder="e.g. Monitors, laptops and computing peripherals"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive font-medium">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-warranty">Default Warranty Period (Months)</Label>
            <Input
              id="cat-warranty"
              type="number"
              placeholder="e.g. 24"
              {...register("warrantyPeriod", { valueAsNumber: true })}
            />
            {errors.warrantyPeriod && (
              <p className="text-xs text-destructive font-medium">{errors.warrantyPeriod.message}</p>
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
