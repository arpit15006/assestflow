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

interface AssetToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRegisterClick: () => void;
  onRefresh: () => void;
}

export function AssetToolbar({
  searchQuery,
  onSearchChange,
  onRegisterClick,
  onRefresh,
}: AssetToolbarProps) {
  const handleQRScan = () => {
    alert("Camera overlay initiated. Place QR Code or Barcode inside the scan frame. (Mock Scanner Flow)");
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
              onClick={() => alert("Bulk import asset spreadsheet mockup.")}
              className="cursor-pointer text-xs"
            >
              <Upload className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <span>Import CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert("Export active asset registry initiated.")}
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
