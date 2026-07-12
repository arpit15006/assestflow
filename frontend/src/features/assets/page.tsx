"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { initialAssets } from "./data";
import { Asset, AssetStatus } from "./types";
import { AssetTable } from "./components/AssetTable";
import { AssetFilters } from "./components/AssetFilters";
import { AssetToolbar } from "./components/AssetToolbar";
import { RegisterAssetDialog } from "./components/RegisterAssetDialog";

export default function AssetsPage() {
  const [assets, setAssets] = React.useState<Asset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showRegisterDialog, setShowRegisterDialog] = React.useState(false);

  // Filters State
  const [filters, setFilters] = React.useState({
    category: "all",
    status: "all",
    department: "all",
    location: "all",
    condition: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: "all",
      status: "all",
      department: "all",
      location: "all",
      condition: "all",
    });
  };

  // Row actions dispatcher
  const handleRowAction = (action: string, item: Asset) => {
    if (action === "Delete") {
      setAssets((prev) => prev.filter((a) => a.id !== item.id));
      alert(`Deleted asset ${item.name} (${item.assetTag}) successfully.`);
      return;
    }

    if (action === "Archive") {
      setAssets((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, status: "Retired" } : a))
      );
      alert(`Archived asset ${item.name} (marked status as Retired).`);
      return;
    }

    if (action === "Duplicate") {
      const copyNum = Math.floor(Math.random() * 1000);
      const duplicate: Asset = {
        ...item,
        id: `asset-${Date.now()}`,
        assetTag: `AF-${copyNum}`,
        name: `${item.name} (Copy)`,
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setAssets((prev) => [duplicate, ...prev]);
      alert(`Duplicated asset into new tag ${duplicate.assetTag}.`);
      return;
    }

    alert(`${action} triggered on: "${item.name}" (${item.assetTag}). (Mock Flow)`);
  };

  // Onboard asset trigger
  const handleRegisterAsset = (
    newAsset: Omit<Asset, "id" | "assetTag" | "lastUpdated" | "assignedTo" | "status">
  ) => {
    const generatedTag = `AF-${Math.floor(1000 + Math.random() * 9000)}`;
    const asset: Asset = {
      ...newAsset,
      id: `asset-${Date.now()}`,
      assetTag: generatedTag,
      status: "Available",
      assignedTo: "--",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setAssets((prev) => [asset, ...prev]);
    alert(`Asset registered successfully with generated tag: ${generatedTag}`);
  };

  const handleRefresh = () => {
    alert("Refreshing asset directory data...");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-6 w-full"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Asset Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track organization assets.
          </p>
        </div>
      </div>

      {/* Search Toolbar */}
      <AssetToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRegisterClick={() => setShowRegisterDialog(true)}
        onRefresh={handleRefresh}
      />

      {/* Filter Row */}
      <AssetFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Assets Table */}
      <AssetTable
        data={assets}
        searchQuery={searchQuery}
        filters={filters}
        onAction={handleRowAction}
      />

      {/* Register Dialog */}
      <RegisterAssetDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onRegister={handleRegisterAsset}
      />
    </motion.div>
  );
}
