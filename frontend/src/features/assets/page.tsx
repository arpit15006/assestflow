"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { initialAssets } from "./data";
import { Asset } from "./types";
import { AssetTable } from "./components/AssetTable";
import { AssetFilters } from "./components/AssetFilters";
import { AssetToolbar } from "./components/AssetToolbar";
import { RegisterAssetDialog } from "./components/RegisterAssetDialog";
import { useToast } from "@/components/ui/Toast";

export default function AssetsPage() {
  const { toast } = useToast();
  const [assets, setAssets] = React.useState<Asset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showRegisterDialog, setShowRegisterDialog] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [filters, setFilters] = React.useState({
    category: "all",
    status: "all",
    department: "all",
    location: "all",
    condition: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: "all", status: "all", department: "all", location: "all", condition: "all" });
  };

  const handleRowAction = (action: string, item: Asset) => {
    if (action === "Delete") {
      setAssets((prev) => prev.filter((a) => a.id !== item.id));
      toast({ type: "success", title: "Asset deleted", description: `${item.name} (${item.assetTag}) has been removed.` });
      return;
    }
    if (action === "Archive") {
      setAssets((prev) => prev.map((a) => (a.id === item.id ? { ...a, status: "Retired" } : a)));
      toast({ type: "info", title: "Asset archived", description: `${item.name} marked as Retired.` });
      return;
    }
    if (action === "Duplicate") {
      const generatedTag = `AF-${Math.floor(1000 + Math.random() * 9000)}`;
      const duplicate: Asset = {
        ...item,
        id: `asset-${Date.now()}`,
        assetTag: generatedTag,
        name: `${item.name} (Copy)`,
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setAssets((prev) => [duplicate, ...prev]);
      toast({ type: "success", title: "Asset duplicated", description: `New asset created with tag ${generatedTag}.` });
      return;
    }
    if (action === "View") {
      toast({ type: "info", title: "View asset", description: `Viewing details for ${item.name} (${item.assetTag}).` });
      return;
    }
    if (action === "Edit") {
      toast({ type: "info", title: "Edit asset", description: `Editing ${item.name} — full edit form coming soon.` });
      return;
    }
  };

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
    toast({ type: "success", title: "Asset registered", description: `${asset.name} added with tag ${generatedTag}.` });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ type: "success", title: "Data refreshed", description: "Asset directory is up to date." });
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-6 w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Asset Directory</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all organization assets — {assets.length} total.
          </p>
        </div>
      </div>

      <AssetToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRegisterClick={() => setShowRegisterDialog(true)}
        onRefresh={handleRefresh}
        assets={assets}
        onImportAssets={(imported) => setAssets((prev) => [...imported, ...prev])}
      />

      <AssetFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <AssetTable
        data={assets}
        searchQuery={searchQuery}
        filters={filters}
        onAction={handleRowAction}
      />

      <RegisterAssetDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        onRegister={handleRegisterAsset}
      />
    </motion.div>
  );
}
