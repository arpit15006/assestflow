"use client";

import React, { useState } from 'react';
import { MaintenanceRequest, MaintenanceStatus } from '@/lib/mock/maintenance';
import { MaintenanceCard } from './MaintenanceCard';

interface MaintenanceKanbanBoardProps {
  requests: MaintenanceRequest[];
  onCardClick: (request: MaintenanceRequest) => void;
}

const COLUMNS: { id: MaintenanceStatus; title: string }[] = [
  { id: 'Pending', title: 'Pending' },
  { id: 'Approved', title: 'Approved' },
  { id: 'Technician Assigned', title: 'Technician Assigned' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Resolved', title: 'Resolved' },
];

export function MaintenanceKanbanBoard({ requests, onCardClick }: MaintenanceKanbanBoardProps) {
  
  // Group requests by status
  const groupedRequests = COLUMNS.reduce((acc, col) => {
    acc[col.id] = requests.filter(r => r.status === col.id);
    return acc;
  }, {} as Record<MaintenanceStatus, MaintenanceRequest[]>);

  const getColumnColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'border-zinc-200 bg-zinc-100/50';
      case 'Approved': return 'border-blue-200 bg-blue-50/50';
      case 'Technician Assigned': return 'border-purple-200 bg-purple-50/50';
      case 'In Progress': return 'border-orange-200 bg-orange-50/50';
      case 'Resolved': return 'border-emerald-200 bg-emerald-50/50';
      default: return 'border-zinc-200 bg-zinc-50';
    }
  };

  const getColumnHeaderColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-zinc-600';
      case 'Approved': return 'text-blue-700';
      case 'Technician Assigned': return 'text-purple-700';
      case 'In Progress': return 'text-orange-700';
      case 'Resolved': return 'text-emerald-700';
      default: return 'text-zinc-600';
    }
  };

  return (
    <div className="w-full flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
      {COLUMNS.map(column => {
        const columnRequests = groupedRequests[column.id] || [];
        
        return (
          <div 
            key={column.id} 
            className={`flex-shrink-0 w-80 flex flex-col rounded-2xl border ${getColumnColor(column.id)} snap-center`}
          >
            {/* Column Header */}
            <div className="px-4 py-4 border-b border-black/5 flex items-center justify-between">
              <h3 className={`font-bold tracking-tight ${getColumnHeaderColor(column.id)}`}>
                {column.title}
              </h3>
              <span className="px-2 py-0.5 bg-white/60 rounded-full text-xs font-bold text-zinc-600 shadow-sm border border-black/5">
                {columnRequests.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 flex flex-col gap-3 min-h-[400px]">
              {columnRequests.map(request => (
                <MaintenanceCard 
                  key={request.id} 
                  request={request} 
                  onClick={onCardClick} 
                />
              ))}
              
              {columnRequests.length === 0 && (
                <div className="flex-1 border-2 border-dashed border-black/5 rounded-xl flex items-center justify-center p-6 text-center text-zinc-400 text-sm">
                  No requests
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
