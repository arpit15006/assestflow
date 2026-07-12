"use client";

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AssetSearch } from "@/components/allocations/AssetSearch";
import { AssetDetailsCard } from "@/components/allocations/AssetDetailsCard";
import { AllocationForm } from "@/components/allocations/AllocationForm";
import { AllocationHistoryTable } from "@/components/allocations/AllocationHistoryTable";
import { MOCK_ASSETS, MOCK_ALLOCATION_HISTORY, MOCK_EMPLOYEES, Asset, AllocationHistoryRecord } from "@/lib/mock/allocations";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Search, Filter, Layers, CheckCircle2, AlertCircle, Info, RefreshCw } from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsApi } from "@/lib/api/assets";
import { allocationsApi } from "@/lib/api/allocations";
import { api } from "@/lib/api/client";

export default function AllocationsPage() {
  const queryClient = useQueryClient();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Load live assets
  const { data: serverAssets } = useQuery({
    queryKey: ["assets"],
    queryFn: () => assetsApi.list(),
  });

  const assets = useMemo(() => {
    const list = serverAssets?.assets || (Array.isArray(serverAssets) ? serverAssets : []);
    return list.map((asset: any) => ({
      id: asset.id,
      tag: asset.assetTag,
      name: asset.name,
      serialNumber: asset.serialNumber,
      category: asset.category?.name || 'Hardware',
      status: asset.status === 'AVAILABLE' ? 'Available' : asset.status === 'ALLOCATED' ? 'Allocated' : 'In Maintenance',
      location: asset.location || 'HQ Mumbai',
      condition: asset.condition || 'GOOD',
      imageUrl: asset.images?.[0]?.url || null,
      allocatedTo: asset.allocations?.find((a: any) => a.status === 'ACTIVE')?.user
        ? {
            id: asset.allocations.find((a: any) => a.status === 'ACTIVE').user.id,
            name: asset.allocations.find((a: any) => a.status === 'ACTIVE').user.name,
            department: asset.department?.name || 'Operations',
            avatarUrl: `https://avatar.vercel.sh/${asset.allocations.find((a: any) => a.status === 'ACTIVE').user.name}`
          }
        : null
    }));
  }, [serverAssets]);

  // Load live users/employees
  const { data: serverUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data?.data;
    },
  });

  const employees = useMemo(() => {
    if (!serverUsers) return [];
    return serverUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      department: u.department?.name || 'Operations',
      avatarUrl: `https://avatar.vercel.sh/${u.name}`,
    }));
  }, [serverUsers]);

  // Load live allocation history
  const { data: serverAllocations } = useQuery({
    queryKey: ["allocations"],
    queryFn: () => allocationsApi.list(),
  });

  const history = useMemo(() => {
    if (!serverAllocations) return [];
    return serverAllocations.map((a: any) => ({
      id: a.id,
      date: new Date(a.allocatedAt).toISOString().split('T')[0],
      allocatedTo: a.user?.name || '--',
      department: a.department?.name || 'Operations',
      status: a.status === 'ACTIVE' ? 'Allocated' : 'Returned',
      returnedBy: a.status === 'RETURNED' ? a.user?.name : undefined,
      returnCondition: a.returnCondition,
    }));
  }, [serverAllocations]);

  // Selected Asset (reactive)
  const selectedAsset = useMemo(() => {
    return assets.find((a: any) => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  // Derived filter categories
  const categories = useMemo<string[]>(() => {
    const list = new Set(assets.map((a: any) => a.category as string));
    return ['All', ...Array.from(list)] as string[];
  }, [assets]);

  // Filtered assets list
  const filteredAssets = useMemo(() => {
    return assets.filter((a: any) => {
      const matchesSearch = 
        a.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchTerm, selectedCategory, selectedStatus]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const allocateMutation = useMutation({
    mutationFn: (data: { assetId: string; userId: string; expectedReturnDate?: string; notes?: string }) =>
      allocationsApi.allocate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["allocations"] });
      toast.success("Asset successfully allocated.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to allocate asset.");
    }
  });

  const handleAllocate = (assetId: string, employeeId: string, reason: string) => {
    // Standard Return Date placeholder: 1 year from now
    const expected = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    allocateMutation.mutate({
      assetId,
      userId: employeeId,
      expectedReturnDate: expected,
      notes: reason,
    });
  };

  const handleTransfer = (assetId: string, toEmployeeId: string, reason: string) => {
    // 1. Process active return, then allocate
    // Direct allocate to the new user on the backend automatically returns active assignment
    handleAllocate(assetId, toEmployeeId, reason);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Allocated': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Maintenance': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-6 h-[calc(100vh-6rem)] flex flex-col">
        <Toaster position="top-right" richColors />
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Asset Allocation & Transfer</h1>
            <p className="text-zinc-500 mt-2 max-w-xl">Search and browse assets to manage employee assignments, process transfers, and track audit history.</p>
          </div>
        </div>

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
          
          {/* Left Column: Asset Directory */}
          <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 flex items-center gap-1.5 font-heading">
                  <Layers className="w-4 h-4 text-primary" />
                  Asset Directory
                </h3>
                <span className="text-xs font-bold text-zinc-500 bg-zinc-200/60 px-2 py-0.5 rounded-full">
                  {filteredAssets.length} items
                </span>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  className="block w-full pl-9 pr-4 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans"
                  placeholder="Search by tag, name, or serial number..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md text-[11px] text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md text-[11px] text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Allocated">Allocated</option>
                    <option value="In Maintenance">In Maintenance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Asset Directory Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 p-2 space-y-1 bg-zinc-50/20">
              {filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-400 h-full">
                  <Info className="w-8 h-8 text-zinc-300 mb-2" />
                  <p className="text-sm font-semibold">No assets found</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Try widening your search terms or filters.</p>
                </div>
              ) : (
                filteredAssets.map((asset: any) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedAssetId === asset.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-transparent bg-white hover:border-zinc-200 hover:shadow-xs'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {asset.imageUrl ? (
                        <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-semibold">ASSET</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                          {asset.tag}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(asset.status)}`}>
                          {asset.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-zinc-900 text-sm truncate mt-1 font-sans">{asset.name}</h4>
                      <p className="text-xs text-zinc-500 truncate font-sans">{asset.category} • {asset.location}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Selected Asset Details & Action Workspace */}
          <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto h-full pr-2 pb-2">
            {selectedAsset ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <AssetDetailsCard asset={selectedAsset} />
                
                <AllocationForm 
                  asset={selectedAsset} 
                  employees={employees}
                  onAllocate={handleAllocate}
                  onTransfer={handleTransfer}
                />
                
                <AllocationHistoryTable history={history} />
              </div>
            ) : (
              <div className="h-full bg-white rounded-2xl border border-zinc-200 border-dashed p-12 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                  <Layers className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 font-heading">Workspace Pending</h3>
                <p className="text-zinc-500 mt-1 max-w-sm font-sans">Select an asset from the directory on the left to allocate it, request a transfer, or view its operational history.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
