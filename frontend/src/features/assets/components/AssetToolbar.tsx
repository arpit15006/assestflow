"use client";

import * as React from "react";
import { Search, Plus, QrCode, Mic, Download, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { useToast } from "@/components/ui/Toast";
import { Asset } from "../types";

interface AssetToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRegisterClick: () => void;
  onRefresh: () => void;
  assets: Asset[];
  onImportAssets: (imported: Asset[]) => void;
}

export function AssetToolbar({
  searchQuery,
  onSearchChange,
  onRegisterClick,
  onRefresh,
  assets,
  onImportAssets,
}: AssetToolbarProps) {
  const { toast } = useToast();

  const handleQRScan = () => {
    toast({ type: "info", title: "QR Scanner", description: "Point camera at QR/barcode. Scanner UI coming soon." });
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "Asset Tag",
        "Name",
        "Category",
        "Status",
        "Department",
        "Assigned To",
        "Location",
        "Condition",
        "Serial Number",
        "Purchase Date",
        "Warranty Period (Months)",
        "Shared"
      ];

      const csvRows = [
        headers.join(","),
        ...assets.map(asset => [
          `"${(asset.assetTag || "").replace(/"/g, '""')}"`,
          `"${(asset.name || "").replace(/"/g, '""')}"`,
          `"${(asset.category || "").replace(/"/g, '""')}"`,
          `"${(asset.status || "").replace(/"/g, '""')}"`,
          `"${(asset.department || "").replace(/"/g, '""')}"`,
          `"${(asset.assignedTo || "").replace(/"/g, '""')}"`,
          `"${(asset.location || "").replace(/"/g, '""')}"`,
          `"${(asset.condition || "").replace(/"/g, '""')}"`,
          `"${(asset.serialNumber || "").replace(/"/g, '""')}"`,
          `"${(asset.purchaseDate || "").replace(/"/g, '""')}"`,
          asset.warrantyPeriod || 0,
          asset.shared ? "TRUE" : "FALSE"
        ].join(","))
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `assets_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({ type: "success", title: "Export CSV success", description: `Exported ${assets.length} assets successfully.` });
    } catch (err) {
      toast({ type: "error", title: "Export CSV failed", description: "An error occurred during export." });
    }
  };

  const handleImportCSV = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split(/\r?\n/);
          if (lines.length < 2) {
            toast({ type: "error", title: "Invalid CSV", description: "CSV must contain a header row and at least one data row." });
            return;
          }

          const parseCSVLine = (line: string) => {
            const result = [];
            let current = "";
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                  current += '"';
                  i++;
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = "";
              } else {
                current += char;
              }
            }
            result.push(current.trim());
            return result;
          };

          const parsedAssets: Asset[] = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const cells = parseCSVLine(line);
            if (cells.length < 12) continue;

            const [
              tag,
              name,
              category,
              status,
              department,
              assignedTo,
              location,
              condition,
              serialNumber,
              purchaseDate,
              warrantyPeriodStr,
              sharedStr
            ] = cells;

            parsedAssets.push({
              id: `asset-import-${Date.now()}-${i}`,
              assetTag: tag || `AF-${Math.floor(1000 + Math.random() * 9000)}`,
              name: name || "Unnamed Asset",
              category: category || "Hardware",
              status: (status as any) || "Available",
              department: department || "General",
              assignedTo: assignedTo || "--",
              location: location || "HQ Office",
              condition: (condition as any) || "Good",
              serialNumber: serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
              purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
              warrantyPeriod: parseInt(warrantyPeriodStr, 10) || 12,
              shared: sharedStr?.toUpperCase() === "TRUE",
              lastUpdated: new Date().toISOString().split("T")[0],
            });
          }

          if (parsedAssets.length === 0) {
            toast({ type: "error", title: "No valid rows found", description: "Could not parse any valid assets from the CSV." });
            return;
          }

          onImportAssets(parsedAssets);
          toast({ type: "success", title: "Import CSV success", description: `Imported ${parsedAssets.length} assets successfully.` });
        } catch (err) {
          toast({ type: "error", title: "Import failed", description: "An error occurred while parsing the CSV." });
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-xl bg-card shadow-2xs">
      {/* Left side: Search Input + QR scan + Voice search */}
      <div className="flex items-center gap-2 flex-1 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search by Asset Tag, Serial Number, QR Code..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-muted/40 hover:bg-muted focus:bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all font-medium text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* QR Scan Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleQRScan}
          className="h-9 w-9 p-0 border border-border text-foreground hover:bg-muted bg-background shadow-xs shrink-0"
          aria-label="Scan QR Code"
        >
          <QrCode className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Voice Search Button (Disabled) */}
        <Button
          variant="outline"
          size="sm"
          disabled
          className="h-9 w-9 p-0 border border-border text-muted-foreground opacity-40 shrink-0 cursor-not-allowed"
          aria-label="Voice Search"
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side: Actions & Register Asset */}
      <div className="flex items-center gap-2">
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
              onClick={handleImportCSV}
              className="cursor-pointer text-xs"
            >
              <Upload className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <span>Import CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleExportCSV}
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
          onClick={onRegisterClick}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Register Asset
        </Button>
      </div>
    </div>
  );
}
