"use client";

import * as React from "react";
import { Search, Plus, RefreshCw, Upload, Download, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";

interface DepartmentToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: "departments" | "categories" | "employees";
  onAddClick: () => void;
  onRefresh: () => void;
}

export function DepartmentToolbar({
  searchQuery,
  onSearchChange,
  activeTab,
  onAddClick,
  onRefresh,
}: DepartmentToolbarProps) {
  const getAddLabel = () => {
    switch (activeTab) {
      case "departments":
        return "Add Department";
      case "categories":
        return "Add Category";
      default:
        return "Add Employee";
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-xl bg-card shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-muted/40 hover:bg-muted focus:bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all font-medium text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Action Filters, Sorting, and Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium border border-border text-foreground hover:bg-muted bg-background shadow-sm active:scale-95 transition-all duration-200"
          onClick={() => alert("Local client sorting toggled (Mock Flow).")}
        >
          <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          Sort
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 text-xs font-medium border border-border text-foreground hover:bg-muted bg-background shadow-sm active:scale-95 transition-all duration-200"
          onClick={() => alert("Local filters modal opened (Mock Flow).")}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          Filters
        </Button>

        {/* Dropdown Menu for Import/Export */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-medium border border-border text-foreground hover:bg-muted bg-background shadow-sm active:scale-95 transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                Actions
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40 bg-popover border-border shadow-md">
            <DropdownMenuItem
              onClick={() => alert("Import data sheet dialog is a mock flow.")}
              className="cursor-pointer text-xs"
            >
              <Upload className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <span>Import CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert("Export active sheet initiated.")}
              className="cursor-pointer text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <span>Export CSV</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 border border-border hover:bg-muted"
          onClick={onRefresh}
          aria-label="Refresh list"
        >
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>

        <Button
          size="sm"
          className="h-9 px-3.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95 transition-all duration-200"
          onClick={onAddClick}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          {getAddLabel()}
        </Button>
      </div>
    </div>
  );
}
