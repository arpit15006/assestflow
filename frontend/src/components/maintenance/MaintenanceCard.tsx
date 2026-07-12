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
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Low': return 'bg-zinc-100 text-zinc-700 border-zinc-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getPriorityIconColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Medium': return 'text-blue-500';
      case 'Low': return 'text-zinc-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div 
      onClick={() => onClick(request)}
      className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-mono font-medium text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
          {request.id}
        </span>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getPriorityColor(request.priority)}`}>
          {request.priority}
        </span>
      </div>

      <h4 className="font-semibold text-zinc-900 leading-tight mb-1 group-hover:text-primary transition-colors">
        {request.issue}
      </h4>
      <p className="text-sm text-zinc-500 truncate mb-4">
        {request.assetName} • {request.assetId}
      </p>

      <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
        <div className="flex items-center gap-3">
          {request.comments.length > 0 && (
            <span className="flex items-center gap-1" title={`${request.comments.length} comments`}>
              <MessageSquare className="w-3.5 h-3.5" />
              {request.comments.length}
            </span>
          )}
          <span className="flex items-center gap-1" title="Requester">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[80px]">{request.requestedBy.split(' ')[0]}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(request.dateRequested).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
