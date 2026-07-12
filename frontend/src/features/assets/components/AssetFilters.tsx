"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface AssetFiltersProps {
  filters: {
    category: string;
    status: string;
    department: string;
    location: string;
    condition: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function AssetFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: AssetFiltersProps) {
  // Determine if any filters are active (not set to "all")
  const isAnyFilterActive = Object.values(filters).some((val) => val !== "all");

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4 border border-border rounded-xl bg-card shadow-2xs">
      {/* Category Filter */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Category
        </label>
        <Select
          value={filters.category}
          onValueChange={(val) => onFilterChange("category", val || "all")}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Office Furniture">Office Furniture</SelectItem>
            <SelectItem value="Vehicles">Vehicles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Status
        </label>
        <Select
          value={filters.status}
          onValueChange={(val) => onFilterChange("status", val || "all")}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Allocated">Allocated</SelectItem>
            <SelectItem value="Reserved">Reserved</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
            <SelectItem value="Retired">Retired</SelectItem>
            <SelectItem value="Disposed">Disposed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Department Filter */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Department
        </label>
        <Select
          value={filters.department}
          onValueChange={(val) => onFilterChange("department", val || "all")}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Facilities">Facilities</SelectItem>
            <SelectItem value="Field Ops">Field Ops</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Location
        </label>
        <Select
          value={filters.location}
          onValueChange={(val) => onFilterChange("location", val || "all")}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Bengaluru HQ">Bengaluru HQ</SelectItem>
            <SelectItem value="HQ Floor 2">HQ Floor 2</SelectItem>
            <SelectItem value="HQ Room 402">HQ Room 402</SelectItem>
            <SelectItem value="Warehouse A">Warehouse A</SelectItem>
            <SelectItem value="Logistics Yard 2">Logistics Yard 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Condition Filter */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Condition
        </label>
        <Select
          value={filters.condition}
          onValueChange={(val) => onFilterChange("condition", val || "all")}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Action Button */}
      <div className="flex items-end">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs font-semibold border border-border text-foreground hover:bg-muted bg-background transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          disabled={!isAnyFilterActive}
          onClick={onClearFilters}
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
