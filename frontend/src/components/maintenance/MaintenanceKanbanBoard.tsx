"use client";

import React, { useState } from 'react';
import { MaintenanceRequest, MaintenanceStatus } from '@/lib/mock/maintenance';
import { MaintenanceCard } from './MaintenanceCard';

interface MaintenanceKanbanBoardProps {
  requests: MaintenanceRequest[];
  onCardClick: (request: MaintenanceRequest) => void;
  onCardDrop: (id: string, newStatus: MaintenanceStatus) => void;
}

const COLUMNS: { id: MaintenanceStatus; title: string }[] = [
  { id: 'Pending', title: 'Pending' },
  { id: 'Approved', title: 'Approved' },
  { id: 'Technician Assigned', title: 'Technician Assigned' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Resolved', title: 'Resolved' },
];

export function MaintenanceKanbanBoard({ requests, onCardClick, onCardDrop }: MaintenanceKanbanBoardProps) {
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  
  // Group requests by status
  const groupedRequests = COLUMNS.reduce((acc, col) => {
    acc[col.id] = requests.filter(r => r.status === col.id);
    return acc;
  }, {} as Record<MaintenanceStatus, MaintenanceRequest[]>);

  const getColumnColor = (status: string, isOver: boolean) => {
    if (isOver) return 'border-primary ring-2 ring-primary/10 bg-primary/[0.01]';
    
    switch (status) {
      case 'Pending': return 'border-zinc-200 bg-zinc-50/50';
      case 'Approved': return 'border-blue-200 bg-blue-50/20';
      case 'Technician Assigned': return 'border-purple-200 bg-purple-50/20';
      case 'In Progress': return 'border-orange-200 bg-orange-50/20';
      case 'Resolved': return 'border-emerald-200 bg-emerald-50/20';
      default: return 'border-zinc-200 bg-zinc-50';
    }
  };

  const getColumnHeaderColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-zinc-700';
      case 'Approved': return 'text-blue-700';
      case 'Technician Assigned': return 'text-purple-700';
      case 'In Progress': return 'text-orange-700';
      case 'Resolved': return 'text-emerald-700';
      default: return 'text-zinc-600';
    }
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverCol(colId);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, status: MaintenanceStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      onCardDrop(cardId, status);
    }
  };

  return (
    <div className="w-full flex gap-4 overflow-x-auto pb-4 pt-2 snap-x h-full min-h-0 items-stretch">
      {COLUMNS.map(column => {
        const columnRequests = groupedRequests[column.id] || [];
        const isOver = dragOverCol === column.id;
        
        return (
          <div 
            key={column.id} 
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex-shrink-0 w-72 flex flex-col rounded-2xl border transition-all duration-200 snap-center h-full min-h-0 select-none ${getColumnColor(column.id, isOver)}`}
          >
            {/* Column Header */}
            <div className="px-4 py-3.5 border-b border-black/5 flex items-center justify-between shrink-0 bg-white/40">
              <h3 className={`font-bold tracking-tight text-xs uppercase font-heading ${getColumnHeaderColor(column.id)}`}>
                {column.title}
              </h3>
              <span className="px-2 py-0.5 bg-white rounded-full text-[10px] font-bold text-zinc-500 shadow-xs border border-zinc-200">
                {columnRequests.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto min-h-0 bg-transparent">
              {columnRequests.map(request => (
                <MaintenanceCard 
                  key={request.id} 
                  request={request} 
                  onClick={onCardClick} 
                />
              ))}
              
              {columnRequests.length === 0 && (
                <div className="flex-1 border border-dashed border-zinc-200 rounded-xl flex items-center justify-center p-6 text-center text-zinc-400 text-xs font-sans font-medium">
                  Drop requests here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
