"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";

interface ExportDropdownProps {
  onExport?: (format: "pdf" | "excel" | "csv") => void;
}

export function ExportDropdown({ onExport }: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 rounded-lg gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="w-44 bg-white border-zinc-200 rounded-xl p-1"
      >
        <DropdownMenuItem
          onClick={() => onExport?.("pdf")}
          className="gap-2 rounded-lg text-sm cursor-pointer"
        >
          <FileText className="h-4 w-4 text-red-600" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onExport?.("excel")}
          className="gap-2 rounded-lg text-sm cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onExport?.("csv")}
          className="gap-2 rounded-lg text-sm cursor-pointer"
        >
          <File className="h-4 w-4 text-zinc-500" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
