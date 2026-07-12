"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MaintenanceKanbanBoard } from "@/components/maintenance/MaintenanceKanbanBoard";
import { MaintenanceDetailsDialog } from "@/components/maintenance/MaintenanceDetailsDialog";
import { NewRequestDialog } from "@/components/maintenance/NewRequestDialog";
import { MOCK_MAINTENANCE_REQUESTS, MaintenanceRequest, MaintenanceStatus } from "@/lib/mock/maintenance";
import { Plus } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { maintenanceApi } from "@/lib/api/maintenance";
import { api } from "@/lib/api/client";

export default function MaintenancePage() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  // Load maintenance requests
  const { data: serverRequests, refetch } = useQuery({
    queryKey: ["maintenance"],
    queryFn: () => maintenanceApi.list(),
  });

  const requests = useMemo<MaintenanceRequest[]>(() => {
    if (!serverRequests) return [];
    return serverRequests.map((r: any) => ({
      id: r.id,
      assetName: r.asset?.name || 'Unknown Asset',
      assetTag: r.asset?.assetTag || 'AF-XXXX',
      description: r.description,
      priority: r.priority.charAt(0) + r.priority.slice(1).toLowerCase(),
      status: r.status === 'PENDING' ? 'Pending' 
            : r.status === 'APPROVED' ? 'Approved' 
            : r.status === 'TECHNICIAN_ASSIGNED' ? 'Technician Assigned' 
            : r.status === 'IN_PROGRESS' ? 'In Progress' 
            : r.status === 'RESOLVED' ? 'Resolved' 
            : 'Closed',
      requestedBy: r.reporter?.name || 'Unknown Reporter',
      technician: r.technician?.name || undefined,
      cost: r.cost ? Number(r.cost) : undefined,
      dateRequested: new Date(r.createdAt).toISOString().split('T')[0],
      comments: r.resolutionNotes ? [
        {
          id: 'res-1',
          author: 'System',
          date: new Date(r.updatedAt).toISOString().split('T')[0],
          text: `Resolution Notes: ${r.resolutionNotes}`
        }
      ] : [],
      activityLog: [
        { date: new Date(r.createdAt).toLocaleDateString(), action: 'Request created' }
      ]
    }));
  }, [serverRequests]);

  // Synchronize details dialog if selected request changes in the list
  const activeSelectedRequest = selectedRequest 
    ? requests.find((r: any) => r.id === selectedRequest.id) || null
    : null;

  const formatDateStr = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleCardClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };

  const createRequestMutation = useMutation({
    mutationFn: (data: any) => maintenanceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      setIsNewRequestOpen(false);
      toast.success("Maintenance request raised successfully.");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create request.");
    }
  });

  const handleCreateRequestSubmit = (data: Omit<MaintenanceRequest, 'id' | 'status' | 'dateRequested' | 'comments' | 'activityLog'>) => {
    // Find asset ID in database if tag or name matched
    // For convenience in prototyping, retrieve assets first or use hardcoded asset id
    api.get("/assets").then((res) => {
      const matched = res.data?.data?.assets?.find((a: any) => a.name.toLowerCase().includes(data.assetName.toLowerCase()) || a.assetTag === data.assetId);
      const assetId = matched?.id || "a-1"; // Fallback to first available asset
      createRequestMutation.mutate({
        assetId,
        description: data.description,
        priority: data.priority.toUpperCase(),
      });
    });
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      if (status === 'APPROVED') {
        return maintenanceApi.approve(id);
      } else if (status === 'RESOLVED') {
        return maintenanceApi.resolve(id, { resolutionNotes: 'Resolved successfully via board.' });
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast.success("Status updated successfully.");
    },
  });

  const handleStatusChange = (id: string, newStatus: MaintenanceStatus) => {
    const backendStatus = newStatus === 'Pending' ? 'PENDING' 
                        : newStatus === 'Approved' ? 'APPROVED' 
                        : newStatus === 'Technician Assigned' ? 'TECHNICIAN_ASSIGNED' 
                        : newStatus === 'In Progress' ? 'IN_PROGRESS' 
                        : newStatus === 'Resolved' ? 'RESOLVED' 
                        : 'CLOSED';
    updateStatusMutation.mutate({ id, status: backendStatus });
  };

  const handleCardDrop = (id: string, newStatus: MaintenanceStatus) => {
    handleStatusChange(id, newStatus);
  };

  const handleAddComment = (id: string, text: string) => {
    if (text.startsWith('Resolution Notes:')) {
      const cleanNotes = text.replace('Resolution Notes:', '').trim();
      maintenanceApi.resolve(id, { resolutionNotes: cleanNotes }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["maintenance"] });
        toast.success("Maintenance resolved with notes.");
      });
    } else {
      toast.info("General commenting coming soon in full Slack notification sync.");
    }
  };

  const handleAssignTechnician = (id: string, technicianName: string) => {
    // Find technician user ID
    api.get("/users").then((res) => {
      const techUser = res.data?.data?.find((u: any) => u.name.toLowerCase().includes(technicianName.toLowerCase()) && u.role === 'TECHNICIAN');
      if (techUser) {
        maintenanceApi.assign(id, techUser.id).then(() => {
          queryClient.invalidateQueries({ queryKey: ["maintenance"] });
          toast.success(`Assigned to ${technicianName}`);
        });
      } else {
        toast.error("Technician not found in system.");
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-6 h-[calc(100vh-6rem)] flex flex-col">
        <Toaster position="top-right" richColors />
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Maintenance Dispatcher</h1>
            <p className="text-zinc-500 mt-2 max-w-xl font-sans">Track and resolve machinery repairs, IT malfunctions, and facilities requests through the Kanban pipeline.</p>
          </div>
          
          <button 
            onClick={() => setIsNewRequestOpen(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 pb-2">
          <MaintenanceKanbanBoard 
            requests={requests} 
            onCardClick={handleCardClick} 
            onCardDrop={handleCardDrop}
          />
        </div>

        {/* Details Dialog Modal */}
        {activeSelectedRequest && (
          <MaintenanceDetailsDialog 
            request={activeSelectedRequest} 
            onClose={() => setSelectedRequest(null)} 
            onStatusChange={handleStatusChange}
            onAddComment={handleAddComment}
            onAssignTechnician={handleAssignTechnician}
          />
        )}

        {/* New Request Modal */}
        {isNewRequestOpen && (
          <NewRequestDialog 
            onClose={() => setIsNewRequestOpen(false)}
            onSubmit={handleCreateRequestSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
