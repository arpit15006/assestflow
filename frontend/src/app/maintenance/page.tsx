"use client";

import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MaintenanceKanbanBoard } from "@/components/maintenance/MaintenanceKanbanBoard";
import { MaintenanceDetailsDialog } from "@/components/maintenance/MaintenanceDetailsDialog";
import { NewRequestDialog } from "@/components/maintenance/NewRequestDialog";
import { MOCK_MAINTENANCE_REQUESTS, MaintenanceRequest, MaintenanceStatus } from "@/lib/mock/maintenance";
import { Plus } from 'lucide-react';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  // Synchronize details dialog if selected request changes in the list
  const activeSelectedRequest = selectedRequest 
    ? requests.find(r => r.id === selectedRequest.id) || null
    : null;

  const formatDateStr = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleCardClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };

  const handleCreateRequestSubmit = (data: Omit<MaintenanceRequest, 'id' | 'status' | 'dateRequested' | 'comments' | 'activityLog'>) => {
    const now = new Date();
    const dateStr = formatDateStr(now);
    const newId = `MR-0${Math.floor(100 + Math.random() * 900)}`;

    const newRequest: MaintenanceRequest = {
      ...data,
      id: newId,
      status: 'Pending',
      dateRequested: now.toISOString().split('T')[0],
      comments: [],
      activityLog: [{ date: dateStr, action: `Request created by ${data.requestedBy}` }]
    };

    setRequests(prev => [newRequest, ...prev]);
    toast.success(`Maintenance ticket ${newId} logged under Pending.`);
  };

  const handleStatusChange = (id: string, newStatus: MaintenanceStatus) => {
    const now = new Date();
    const dateStr = formatDateStr(now);

    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: newStatus,
          activityLog: [
            ...req.activityLog, 
            { date: dateStr, action: `Status changed to ${newStatus}` }
          ]
        };
      }
      return req;
    }));

    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleCardDrop = (id: string, newStatus: MaintenanceStatus) => {
    const now = new Date();
    const dateStr = formatDateStr(now);

    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: newStatus,
          activityLog: [
            ...req.activityLog, 
            { date: dateStr, action: `Moved to ${newStatus} via Kanban board` }
          ]
        };
      }
      return req;
    }));

    toast.info(`Ticket ${id} moved to ${newStatus}`);
  };

  const handleAddComment = (id: string, text: string) => {
    const now = new Date();
    const dateStr = formatDateStr(now);

    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const commentAuthor = text.startsWith('Resolution Notes:') ? 'System' : 'Admin (You)';
        const newComment = {
          id: `c-${Date.now()}`,
          author: commentAuthor,
          date: now.toISOString().split('T')[0],
          text
        };

        return {
          ...req,
          comments: [...req.comments, newComment],
          activityLog: [
            ...req.activityLog,
            { date: dateStr, action: `Comment added: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"` }
          ]
        };
      }
      return req;
    }));

    toast.success("Comment posted successfully.");
  };

  const handleAssignTechnician = (id: string, technician: string) => {
    const now = new Date();
    const dateStr = formatDateStr(now);

    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const shouldChangeStatus = req.status === 'Pending' || req.status === 'Approved';
        const updatedStatus: MaintenanceStatus = shouldChangeStatus ? 'Technician Assigned' : req.status;

        const activity = [
          ...req.activityLog,
          { date: dateStr, action: technician ? `Assigned to technician ${technician}` : 'Technician unassigned' }
        ];

        if (shouldChangeStatus && technician) {
          activity.push({ date: dateStr, action: `Status changed to Technician Assigned` });
        }

        return {
          ...req,
          technician: technician || undefined,
          status: updatedStatus,
          activityLog: activity
        };
      }
      return req;
    }));

    if (technician) {
      toast.success(`Assigned to ${technician}`);
    } else {
      toast.info("Technician assignment cleared.");
    }
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
