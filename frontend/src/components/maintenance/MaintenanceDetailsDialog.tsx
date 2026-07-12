import React, { useState, useEffect } from 'react';
import { MaintenanceRequest, MaintenanceStatus } from '@/lib/mock/maintenance';
import { X, User, Clock, AlertTriangle, Paperclip, MessageSquare, Briefcase, Calendar, CheckSquare, Hammer } from 'lucide-react';

interface MaintenanceDetailsDialogProps {
  request: MaintenanceRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: MaintenanceStatus) => void;
  onAddComment: (id: string, text: string) => void;
  onAssignTechnician: (id: string, technician: string) => void;
}

export function MaintenanceDetailsDialog({ request, onClose, onStatusChange, onAddComment, onAssignTechnician }: MaintenanceDetailsDialogProps) {
  const [commentText, setCommentText] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [showResolutionInput, setShowResolutionInput] = useState(false);

  useEffect(() => {
    setCommentText('');
    setResolutionText('');
    setShowResolutionInput(false);
  }, [request]);

  if (!request) return null;

  // Next logically available statuses based on current status
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(request.id, commentText.trim());
    setCommentText('');
  };

  const handleStatusClick = (status: MaintenanceStatus) => {
    if (status === 'Resolved' && !request.technician) {
      setShowResolutionInput(true);
    } else {
      onStatusChange(request.id, status);
    }
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionText.trim()) return;

    // Add a resolution note as a comment
    onAddComment(request.id, `Resolution Notes: ${resolutionText.trim()}`);
    onStatusChange(request.id, 'Resolved');
    setShowResolutionInput(false);
    setResolutionText('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-zinc-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
              {request.id}
            </span>
            <h2 className="text-base font-bold text-zinc-950 tracking-tight font-heading">{request.issue}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
          
          {/* Main Content Scrollable (Left) */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-zinc-200">
            <div className="space-y-6">
              
              {/* Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-zinc-700 tracking-wide uppercase">Issue Details</h3>
                <p className="text-zinc-700 text-xs leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 font-sans font-medium">
                  {request.description}
                </p>
              </div>

              {/* Attachments */}
              <div className="space-y-1.5 select-none">
                <h3 className="text-xs font-bold text-zinc-700 tracking-wide uppercase">Attachments</h3>
                <div className="flex gap-3">
                  <div className="w-24 h-20 bg-zinc-100/50 rounded-lg border border-zinc-200 border-dashed flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer select-none">
                    <Paperclip className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-bold">Upload</span>
                  </div>
                  <div className="w-24 h-20 bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80" alt="Incident Capture" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center select-none">
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">Inspect</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow resolution popup */}
              {showResolutionInput && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <CheckSquare className="w-4 h-4" />
                    Complete Resolution Report
                  </div>
                  <form onSubmit={handleResolveSubmit} className="space-y-2">
                    <textarea
                      required
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Specify how this problem was fixed..."
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 resize-none font-sans font-medium"
                    />
                    <div className="flex justify-end gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setShowResolutionInput(false)}
                        className="px-2.5 py-1 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-lg font-bold text-zinc-600 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                      >
                        Submit & Resolve
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Comments Section */}
              <div className="pt-5 border-t border-zinc-200 space-y-4">
                <h3 className="text-xs font-bold text-zinc-700 tracking-wide uppercase flex items-center gap-1.5 select-none">
                  <MessageSquare className="w-4 h-4 text-zinc-400" />
                  Comments ({request.comments.length})
                </h3>
                
                <div className="space-y-3">
                  {request.comments.length === 0 ? (
                    <p className="text-xs text-zinc-400 font-medium italic select-none">No comments posted yet.</p>
                  ) : (
                    request.comments.map(c => (
                      <div key={c.id} className="bg-zinc-50/50 border border-zinc-200/60 rounded-xl p-3.5 space-y-1 font-sans">
                        <div className="flex justify-between items-center select-none">
                          <span className="font-bold text-xs text-zinc-900">{c.author}</span>
                          <span className="text-[10px] text-zinc-400 font-semibold">{c.date}</span>
                        </div>
                        <p className="text-xs text-zinc-700 font-medium leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex gap-3 pt-2 font-sans select-none">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="text-primary text-[10px] font-extrabold uppercase">You</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Post notes, technician reports, or progress updates..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none font-medium text-zinc-900"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        disabled={!commentText.trim()}
                        className="px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      >
                        Send Comment
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Activity Log */}
              <div className="pt-5 border-t border-zinc-200">
                <h3 className="text-xs font-bold text-zinc-700 tracking-wide uppercase mb-4 select-none">Audit & Activity Log</h3>
                <div className="space-y-4">
                  {request.activityLog.map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center select-none">
                        <div className="w-2 h-2 rounded-full bg-zinc-300 ring-2 ring-white mt-1 shrink-0" />
                        {i !== request.activityLog.length - 1 && <div className="w-px h-full bg-zinc-200 my-1" />}
                      </div>
                      <div className="pb-1 font-sans">
                        <p className="text-xs text-zinc-800 font-semibold leading-none">{log.action}</p>
                        <p className="text-[9px] text-zinc-400 font-semibold mt-1">{log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          
          {/* Sidebar Status/Info Panel (Right) */}
          <div className="w-full md:w-72 bg-zinc-50/60 p-6 overflow-y-auto shrink-0 select-none">
            
            {/* Workflow Actions */}
            <div className="mb-6 space-y-3">
              <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2">Workflow Actions</h3>
              <div className="flex flex-col gap-2">
                {availableStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusClick(status)}
                    className="w-full py-2 bg-white border border-zinc-200 rounded-lg shadow-xs text-xs font-bold hover:border-primary hover:text-primary hover:bg-primary/[0.01] transition-all text-left px-3 flex items-center gap-1.5"
                  >
                    <Hammer className="w-3.5 h-3.5 text-zinc-400" />
                    Move to {status}
                  </button>
                ))}
                {availableStatuses.length === 0 && (
                  <p className="text-[10px] text-zinc-400 italic">No transition actions available.</p>
                )}
              </div>
            </div>

            {/* Core details */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2">Ticket Metadata</h3>
              
              <div className="flex items-start gap-2.5 font-sans">
                <AlertTriangle className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase leading-none">Priority</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1.5 ${
                    request.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                    request.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    request.priority === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-zinc-50 text-zinc-600 border-zinc-200'
                  }`}>
                    {request.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 font-sans">
                <Briefcase className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase leading-none">Target Asset</p>
                  <p className="text-xs font-bold text-primary hover:underline cursor-pointer mt-1.5 truncate">
                    {request.assetName}
                  </p>
                  <p className="text-[9px] font-mono text-zinc-400 font-bold mt-0.5">{request.assetId}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 font-sans">
                <User className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase leading-none">Requester</p>
                  <p className="text-xs font-bold text-zinc-900 mt-1.5">{request.requestedBy}</p>
                  <p className="text-[10px] text-zinc-400 font-semibold">{request.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 font-sans">
                <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase leading-none">Date Logged</p>
                  <p className="text-xs font-bold text-zinc-800 mt-1.5">
                    {new Date(request.dateRequested).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Technician dropdown selector */}
              <div className="pt-2 border-t border-zinc-200/60 space-y-1.5 font-sans">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Assign Engineer</label>
                <select
                  value={request.technician || ''}
                  onChange={(e) => onAssignTechnician(request.id, e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-sans"
                >
                  <option value="">Unassigned</option>
                  <option value="Mike Mechanics">Mike Mechanics (Fleet)</option>
                  <option value="IT Support">IT Support (Hardware)</option>
                  <option value="Facilities">Facilities (Office)</option>
                </select>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
