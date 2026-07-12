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
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { FileUp, Link as LinkIcon } from "lucide-react";
import { Asset } from "../types";

const schema = z.object({
  name: z.string().min(2, "Asset name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  serialNumber: z.string().min(2, "Serial number is required"),
  department: z.string().min(1, "Please select a department"),
  location: z.string().min(2, "Please specify a location"),
  condition: z.enum(["New", "Good", "Fair", "Poor"]),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  warrantyPeriod: z.number().min(0, "Warranty cannot be negative"),
  shared: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface RegisterAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (data: Omit<Asset, "id" | "assetTag" | "lastUpdated" | "assignedTo" | "status">) => void;
}

export function RegisterAssetDialog({
  open,
  onOpenChange,
  onRegister,
}: RegisterAssetDialogProps) {
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
      category: "",
      serialNumber: "",
      department: "",
      location: "",
      condition: "Good",
      purchaseDate: new Date().toISOString().split("T")[0],
      warrantyPeriod: 24,
      shared: false,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: FormData) => {
    onRegister(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register Asset</DialogTitle>
          <DialogDescription>
            Onboard new hardware, equipment, or vehicles into the organization registry directory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* SECTION 1: General Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-1">
              1. General Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="asset-name">Asset Name</Label>
                <Input
                  id="asset-name"
                  placeholder="e.g. MacBook Pro 16-inch"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-[10px] text-destructive font-medium">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                        <SelectItem value="IT Infrastructure">IT Infrastructure</SelectItem>
                        <SelectItem value="Vehicles">Vehicles</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="asset-sn">Serial Number</Label>
                <Input
                  id="asset-sn"
                  placeholder="e.g. S/N: MB-4492019"
                  {...register("serialNumber")}
                />
                {errors.serialNumber && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.serialNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="asset-tag">Asset Tag (Read-Only)</Label>
                <Input
                  id="asset-tag"
                  disabled
                  value="AF-XXXX (Auto Generated)"
                  className="bg-muted opacity-60 text-muted-foreground select-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Ownership */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-1">
              2. Ownership & Location
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Facilities">Facilities</SelectItem>
                        <SelectItem value="Field Ops">Field Ops</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.department && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="asset-loc">Location</Label>
                <Input
                  id="asset-loc"
                  placeholder="e.g. Warehouse A"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Condition</Label>
                <Controller
                  name="condition"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Purchase Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-1">
              3. Purchase Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="asset-pur">Purchase Date</Label>
                <Input
                  id="asset-pur"
                  type="date"
                  {...register("purchaseDate")}
                />
                {errors.purchaseDate && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.purchaseDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="asset-war">Warranty period (Months)</Label>
                <Input
                  id="asset-war"
                  type="number"
                  placeholder="e.g. 24"
                  {...register("warrantyPeriod", { valueAsNumber: true })}
                />
                {errors.warrantyPeriod && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.warrantyPeriod.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: Attachments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-1">
              4. Attachments & Media
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                <FileUp className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Upload Image</span>
                <span className="text-[10px] text-muted-foreground text-center">
                  Drag and drop files here (JPG, PNG max 5MB)
                </span>
              </div>
              <div className="border border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                <LinkIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Upload Documents</span>
                <span className="text-[10px] text-muted-foreground text-center">
                  Invoices, manuals, or PDF agreements
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Additional Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-1">
              5. Additional Settings
            </h4>
            <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg border border-border/50">
              <Controller
                name="shared"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="asset-shared"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="space-y-0.5">
                <Label htmlFor="asset-shared" className="cursor-pointer font-medium text-xs">
                  Mark as Shared Resource
                </Label>
                <p className="text-[10px] text-muted-foreground">
                  Allow multiple employees to check in/out and schedule bookings for this asset.
                </p>
              </div>
            </div>
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
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
