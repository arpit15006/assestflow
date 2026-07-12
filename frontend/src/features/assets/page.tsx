"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Asset } from "./types";
import { AssetTable } from "./components/AssetTable";
import { AssetFilters } from "./components/AssetFilters";
import { AssetToolbar } from "./components/AssetToolbar";
import { RegisterAssetDialog } from "./components/RegisterAssetDialog";
import { useToast } from "@/components/ui/Toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsApi } from "@/lib/api/assets";

export default function AssetsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showRegisterDialog, setShowRegisterDialog] = React.useState(false);

  const { data: serverAssets, isLoading, refetch } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetsApi.list(),
  });

  const assets = React.useMemo(() => {
    const list = serverAssets?.assets || (Array.isArray(serverAssets) ? serverAssets : []);
    return list.map((asset: any) => ({
      ...asset,
      assignedTo: asset.allocations?.find((a: any) => a.status === "ACTIVE")?.user?.name || "--",
      lastUpdated: asset.updatedAt ? new Date(asset.updatedAt).toISOString().split("T")[0] : "--",
      status: asset.status.charAt(0) + asset.status.slice(1).toLowerCase(),
      condition: asset.condition.charAt(0) + asset.condition.slice(1).toLowerCase(),
      category: asset.category?.name || "Hardware",
      department: asset.department?.name || "--",
    }));
  }, [serverAssets]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => assetsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({ type: "success", title: "Asset deleted", description: `Asset has been successfully removed.` });
    },
    onError: (err: any) => {
      toast({ type: "error", title: "Delete failed", description: err?.response?.data?.message || "Could not delete asset." });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => assetsApi.create(data),
    onSuccess: (newAsset) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast({ type: "success", title: "Asset registered", description: `${newAsset.name} added successfully.` });
      setShowRegisterDialog(false);
    },
    onError: (err: any) => {
      toast({ type: "error", title: "Registration failed", description: err?.response?.data?.message || "Could not register asset." });
    }
  });

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

  const handleRowAction = (action: string, item: any) => {
    if (action === "Delete") {
      deleteMutation.mutate(item.id);
      return;
    }
    if (action === "Archive") {
      assetsApi.update(item.id, { status: "RETIRED" })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["assets"] });
          toast({ type: "info", title: "Asset archived", description: `${item.name} marked as Retired.` });
        });
      return;
    }
    if (action === "Duplicate") {
      const generatedSerial = `SN-DUP-${Math.floor(100000 + Math.random() * 900000)}`;
      assetsApi.create({
        name: `${item.name} (Copy)`,
        serialNumber: generatedSerial,
        categoryId: item.categoryId || "c-1", // Use item's categoryId or standard fallback
        acquisitionDate: new Date().toISOString(),
        acquisitionCost: Number(item.acquisitionCost) || 0,
        condition: "NEW",
        location: item.location || "HQ Mumbai",
        isShared: item.isShared || false,
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["assets"] });
        toast({ type: "success", title: "Asset duplicated", description: "New duplicate asset created." });
      });
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
    newAsset: any
  ) => {
    // Generate placeholder serial number if empty for test convenience
    const serial = newAsset.serialNumber || `SN-REG-${Date.now()}`;
    registerMutation.mutate({
      name: newAsset.name,
      serialNumber: serial,
      categoryId: newAsset.categoryId || "c-1",
      acquisitionDate: newAsset.purchaseDate ? new Date(newAsset.purchaseDate).toISOString() : new Date().toISOString(),
      acquisitionCost: Number(newAsset.purchaseCost) || 0,
      condition: (newAsset.condition || "NEW").toUpperCase(),
      location: newAsset.location || "HQ Mumbai",
      isShared: newAsset.isShared || false,
    });
  };

  const handleRefresh = () => {
    refetch().then(() => {
      toast({ type: "success", title: "Data refreshed", description: "Asset directory is up to date." });
    });
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
        onImportAssets={() => {
          queryClient.invalidateQueries({ queryKey: ["assets"] });
          toast({ type: "success", title: "Mock Import", description: "Import CSV workflow simulation completed." });
        }}
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
