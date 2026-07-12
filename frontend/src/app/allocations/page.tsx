"use client";

import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AssetSearch } from "@/components/allocations/AssetSearch";
import { AssetDetailsCard } from "@/components/allocations/AssetDetailsCard";
import { AllocationForm } from "@/components/allocations/AllocationForm";
import { AllocationHistoryTable } from "@/components/allocations/AllocationHistoryTable";
import { MOCK_ASSETS, MOCK_ALLOCATION_HISTORY, Asset } from "@/lib/mock/allocations";

export default function AllocationsPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleSearch = (term: string) => {
    // Basic mock search implementation
    const lowerTerm = term.toLowerCase();
    const found = MOCK_ASSETS.find(a => 
      a.tag.toLowerCase().includes(lowerTerm) || 
      a.name.toLowerCase().includes(lowerTerm) ||
      a.serialNumber.toLowerCase().includes(lowerTerm)
    );
    setSelectedAsset(found || null);
  };

  const handleAllocate = (assetId: string, employeeId: string, reason: string) => {
    console.log(`Allocating ${assetId} to ${employeeId} for reason: ${reason}`);
    // In a real app, this would be an API call that updates the asset status
  };

  const handleTransfer = (assetId: string, toEmployeeId: string, reason: string) => {
    console.log(`Transferring ${assetId} to ${toEmployeeId} for reason: ${reason}`);
    // In a real app, this would be an API call
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Asset Allocation & Transfer</h1>
            <p className="text-zinc-500 mt-2 max-w-xl">Search for assets to view their current status, allocate them to new employees, or initiate transfer workflows.</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="py-2">
          <AssetSearch onSearch={handleSearch} />
        </div>

        {/* Content Section (Visible if asset selected) */}
        {selectedAsset ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AssetDetailsCard asset={selectedAsset} />
            
            <AllocationForm 
              asset={selectedAsset} 
              onAllocate={handleAllocate}
              onTransfer={handleTransfer}
            />
            
            <AllocationHistoryTable history={MOCK_ALLOCATION_HISTORY} />
          </div>
        ) : (
          <div className="pt-8">
            <AssetDetailsCard asset={null} />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
