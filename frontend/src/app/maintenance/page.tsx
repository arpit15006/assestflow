"use client";

import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MaintenanceKanbanBoard } from "@/components/maintenance/MaintenanceKanbanBoard";
import { MaintenanceDetailsDialog } from "@/components/maintenance/MaintenanceDetailsDialog";
import { MOCK_MAINTENANCE_REQUESTS, MaintenanceRequest, MaintenanceStatus } from "@/lib/mock/maintenance";
import { Plus } from 'lucide-react';

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  const handleCardClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };

  const handleStatusChange = (id: string, newStatus: MaintenanceStatus) => {
    // Update local state
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        const now = new Date();
        const dateStr = `${now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
        
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

    // Update selected request so dialog updates immediately
    setSelectedRequest(prev => {
      if (prev && prev.id === id) {
        const now = new Date();
        const dateStr = `${now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
        return {
          ...prev,
          status: newStatus,
          activityLog: [
            ...prev.activityLog, 
            { date: dateStr, action: `Status changed to ${newStatus}` }
          ]
        };
      }
      return prev;
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10 h-[calc(100vh-6rem)] flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Maintenance Management</h1>
            <p className="text-zinc-500 mt-2 max-w-xl">Track, manage, and resolve asset repair requests through the automated Kanban workflow.</p>
          </div>
          
          <button className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MaintenanceKanbanBoard 
            requests={requests} 
            onCardClick={handleCardClick} 
          />
        </div>

        {/* Details Dialog Modal */}
        {selectedRequest && (
          <MaintenanceDetailsDialog 
            request={selectedRequest} 
            onClose={() => setSelectedRequest(null)} 
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
