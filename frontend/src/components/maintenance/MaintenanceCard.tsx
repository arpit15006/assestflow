import React from 'react';
import { MaintenanceRequest } from '@/lib/mock/maintenance';
import { MessageSquare, Clock, AlertTriangle, User, Paperclip } from 'lucide-react';

interface MaintenanceCardProps {
  request: MaintenanceRequest;
  onClick: (request: MaintenanceRequest) => void;
}

export function MaintenanceCard({ request, onClick }: MaintenanceCardProps) {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low': return 'bg-zinc-50 text-zinc-700 border-zinc-200';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'group-hover:border-red-400/60';
      case 'High': return 'group-hover:border-orange-400/60';
      case 'Medium': return 'group-hover:border-blue-400/60';
      case 'Low': return 'group-hover:border-zinc-400/60';
      default: return 'group-hover:border-primary/40';
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', request.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(request)}
      className={`bg-white rounded-xl border border-zinc-200 p-4 shadow-xs transition-all cursor-pointer group active:scale-[0.98] select-none hover:shadow-sm hover:translate-y-[-1px] ${getPriorityBorderColor(request.priority)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
          {request.id}
        </span>
        <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(request.priority)}`}>
          {request.priority}
        </span>
      </div>

      <h4 className="font-bold text-zinc-900 text-xs leading-tight mb-1 group-hover:text-primary transition-colors font-sans line-clamp-2">
        {request.issue}
      </h4>
      <p className="text-[10px] text-zinc-500 truncate mb-4 font-sans font-medium">
        {request.assetName} • <span className="font-semibold text-zinc-400 font-mono">{request.assetId}</span>
      </p>

      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-3 border-t border-zinc-100 font-sans font-medium shrink-0">
        <div className="flex items-center gap-3">
          {request.comments.length > 0 && (
            <span className="flex items-center gap-1" title={`${request.comments.length} comments`}>
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              {request.comments.length}
            </span>
          )}
          <span className="flex items-center gap-1" title="Requester">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="truncate max-w-[80px] font-semibold">{request.requestedBy.split(' ')[0]}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-1 font-semibold">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{new Date(request.dateRequested).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
