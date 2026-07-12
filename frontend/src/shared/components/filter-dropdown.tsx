"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { FilterOption } from "@/shared/types";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  className,
}: FilterDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "all")}>
      <SelectTrigger
        className={cn(
          "h-9 bg-zinc-50 border-zinc-200 rounded-lg text-sm gap-1 min-w-[140px] focus:ring-1 focus:ring-primary/50",
          className
        )}
        aria-label={label}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-white border-zinc-200 rounded-xl">
        <SelectItem value="all" className="text-sm rounded-lg">
          All {label}
        </SelectItem>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-sm rounded-lg"
          >
            <span className="flex items-center gap-2">
              {option.label}
              {option.count !== undefined && (
                <span className="text-xs text-zinc-500">
                  ({option.count})
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
