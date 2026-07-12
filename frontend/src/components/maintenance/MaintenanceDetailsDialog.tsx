import React, { useState } from 'react';
import { MaintenanceRequest, MaintenanceStatus } from '@/lib/mock/maintenance';
import { X, User, Clock, AlertTriangle, Paperclip, MessageSquare, Briefcase, Calendar } from 'lucide-react';

interface MaintenanceDetailsDialogProps {
  request: MaintenanceRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: MaintenanceStatus) => void;
}

export function MaintenanceDetailsDialog({ request, onClose, onStatusChange }: MaintenanceDetailsDialogProps) {
  const [commentText, setCommentText] = useState('');

  if (!request) return null;

  // Next logically available statuses based on current status for our mock workflow
  const getAvailableStatuses = (): MaintenanceStatus[] => {
    switch (request.status) {
      case 'Pending': return ['Approved', 'Resolved'];
      case 'Approved': return ['Technician Assigned', 'Resolved'];
      case 'Technician Assigned': return ['In Progress', 'Resolved'];
      case 'In Progress': return ['Resolved'];
      case 'Resolved': return ['Pending']; // Re-open
      default: return [];
    }
  };

  const availableStatuses = getAvailableStatuses();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-zinc-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-zinc-500 bg-white px-2 py-1 rounded border border-zinc-200">
              {request.id}
            </span>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{request.issue}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main Content (Left) */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-zinc-200">
            <div className="space-y-6">
              
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">Description</h3>
                <p className="text-zinc-700 text-sm leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  {request.description}
                </p>
              </div>

              {/* Attachments Placeholder */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">Attachments</h3>
                <div className="flex gap-3">
                  <div className="w-32 h-24 bg-zinc-100 rounded-lg border border-zinc-200 border-dashed flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer">
                    <Paperclip className="w-5 h-5 mb-1" />
                    <span className="text-xs">Add file</span>
                  </div>
                  {/* Mock existing attachment */}
                  <div className="w-32 h-24 bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80" alt="Defect" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">View</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-4">Activity Log</h3>
                <div className="space-y-4">
                  {request.activityLog.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 ring-4 ring-white mt-1.5" />
                        {i !== request.activityLog.length - 1 && <div className="w-px h-full bg-zinc-200 my-1" />}
                      </div>
                      <div className="pb-1">
                        <p className="text-sm text-zinc-900">{log.action}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-4 border-t border-zinc-200">
                <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-zinc-400" />
                  Comments
                </h3>
                
                <div className="space-y-4 mb-4">
                  {request.comments.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">No comments yet.</p>
                  ) : (
                    request.comments.map(c => (
                      <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm text-zinc-900">{c.author}</span>
                          <span className="text-xs text-zinc-400">{c.date}</span>
                        </div>
                        <p className="text-sm text-zinc-700">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary text-xs font-bold">You</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        disabled={!commentText.trim()}
                        className="px-4 py-1.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Sidebar Info (Right) */}
          <div className="w-full md:w-72 bg-zinc-50/50 p-6 overflow-y-auto">
            
            {/* Actions */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Workflow Actions</h3>
              <div className="flex flex-col gap-2">
                {availableStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(request.id, status)}
                    className="w-full py-2 bg-white border border-zinc-200 rounded-lg shadow-sm text-sm font-medium hover:border-primary hover:text-primary transition-colors text-left px-4"
                  >
                    Move to {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 border-b border-zinc-200 pb-2">Details</h3>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Priority</p>
                  <p className="text-sm font-medium text-zinc-900 mt-0.5">{request.priority}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Asset</p>
                  <p className="text-sm font-medium text-primary hover:underline cursor-pointer mt-0.5">
                    {request.assetName} ({request.assetId})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Requested By</p>
                  <p className="text-sm font-medium text-zinc-900 mt-0.5">{request.requestedBy}</p>
                  <p className="text-xs text-zinc-500">{request.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Date Requested</p>
                  <p className="text-sm font-medium text-zinc-900 mt-0.5">
                    {new Date(request.dateRequested).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {request.technician && (
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-[8px] font-bold text-primary">T</span>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium">Technician</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5">{request.technician}</p>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
