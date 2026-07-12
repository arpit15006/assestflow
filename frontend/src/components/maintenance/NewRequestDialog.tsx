import React, { useState, useEffect } from 'react';
import { MaintenanceRequest, MaintenancePriority } from '@/lib/mock/maintenance';
import { MOCK_ASSETS } from '@/lib/mock/allocations';
import { X, AlertCircle, Loader2, Plus, Info } from 'lucide-react';

interface NewRequestDialogProps {
  onClose: () => void;
  onSubmit: (newRequest: Omit<MaintenanceRequest, 'id' | 'status' | 'dateRequested' | 'comments' | 'activityLog'>) => void;
}

export function NewRequestDialog({ onClose, onSubmit }: NewRequestDialogProps) {
  const [assetTag, setAssetTag] = useState('');
  const [assetName, setAssetName] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MaintenancePriority>('Medium');
  const [requestedBy, setRequestedBy] = useState('');
  const [department, setDepartment] = useState('Engineering');

  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ assetTag: false, issue: false, description: false, requestedBy: false });
  const [errors, setErrors] = useState({ assetTag: '', issue: '', description: '', requestedBy: '' });

  // Auto-populate asset name based on selected tag
  useEffect(() => {
    const selectedAsset = MOCK_ASSETS.find(a => a.tag === assetTag);
    if (selectedAsset) {
      setAssetName(selectedAsset.name);
    } else {
      setAssetName('');
    }
  }, [assetTag]);

  // Form validation
  const validate = () => {
    const newErrors = { assetTag: '', issue: '', description: '', requestedBy: '' };
    
    if (touched.assetTag && !assetTag) {
      newErrors.assetTag = 'Asset Tag selection is required.';
    }
    if (touched.issue) {
      if (!issue.trim()) {
        newErrors.issue = 'Issue summary is required.';
      } else if (issue.trim().length < 5) {
        newErrors.issue = 'Issue summary must be at least 5 characters.';
      }
    }
    if (touched.description) {
      if (!description.trim()) {
        newErrors.description = 'Detailed description is required.';
      } else if (description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters.';
      }
    }
    if (touched.requestedBy) {
      if (!requestedBy.trim()) {
        newErrors.requestedBy = 'Requester name is required.';
      } else if (requestedBy.trim().length < 3) {
        newErrors.requestedBy = 'Name must be at least 3 characters.';
      }
    }
    setErrors(newErrors);
  };

  useEffect(() => {
    validate();
  }, [assetTag, issue, description, requestedBy, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ assetTag: true, issue: true, description: true, requestedBy: true });
    
    const isValid = assetTag && issue.trim().length >= 5 && description.trim().length >= 10 && requestedBy.trim().length >= 3;
    if (!isValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSubmit({
        assetId: assetTag,
        assetName,
        issue: issue.trim(),
        description: description.trim(),
        priority,
        requestedBy: requestedBy.trim(),
        department
      });
      onClose();
    }, 850);
  };

  const isFormValid = assetTag && issue.trim().length >= 5 && description.trim().length >= 10 && requestedBy.trim().length >= 3 && !isLoading;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in zoom-in-95 duration-200 border border-zinc-200 overflow-hidden font-sans text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
          <h3 className="font-bold text-zinc-950 text-sm flex items-center gap-1.5 font-heading">
            <Plus className="w-4.5 h-4.5 text-primary" />
            Create Maintenance Request
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Asset Tag Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block">Asset Tag</label>
              <select
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                onBlur={() => handleBlur('assetTag')}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all
                  ${errors.assetTag ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
                `}
              >
                <option value="" disabled>Select Tag...</option>
                {MOCK_ASSETS.map(asset => (
                  <option key={asset.id} value={asset.tag}>{asset.tag} ({asset.name})</option>
                ))}
              </select>
              {errors.assetTag && <p className="text-[10px] text-red-500 font-medium">{errors.assetTag}</p>}
            </div>

            {/* Asset Name (Autofilled) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 block">Asset Name (Autofilled)</label>
              <input
                type="text"
                disabled
                value={assetName}
                placeholder="Asset Registry Lookup..."
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenancePriority)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                <option value="Low">Low (General Upkeep)</option>
                <option value="Medium">Medium (Regular Maintenance)</option>
                <option value="High">High (Disruptive Fault)</option>
                <option value="Critical">Critical (Equipment Failure)</option>
              </select>
            </div>

            {/* Requester Department */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Procurement">Procurement</option>
                <option value="HR">Human Resources</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>
          </div>

          {/* Requested By */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block">Requested By</label>
            <input
              type="text"
              placeholder="e.g. Arpit Patel"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              onBlur={() => handleBlur('requestedBy')}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all
                ${errors.requestedBy ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
              `}
            />
            {errors.requestedBy && <p className="text-[10px] text-red-500 font-medium">{errors.requestedBy}</p>}
          </div>

          {/* Issue Summary */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block">Issue Summary</label>
            <input
              type="text"
              placeholder="e.g. Broken monitor stand, AC compressor rattle"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              onBlur={() => handleBlur('issue')}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all
                ${errors.issue ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
              `}
            />
            {errors.issue ? (
              <p className="text-[10px] text-red-500 font-medium">{errors.issue}</p>
            ) : (
              <p className="text-[9px] text-zinc-400">Brief one-line summary (minimum 5 characters).</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block">Detailed Fault Description</label>
            <textarea
              rows={3}
              placeholder="Describe symptoms, steps to reproduce, or incident context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description')}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none
                ${errors.description ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
              `}
            />
            {errors.description ? (
              <p className="text-red-500 font-medium text-[10px]">{errors.description}</p>
            ) : (
              <p className="text-[9px] text-zinc-400">Provide troubleshooting notes or observations (minimum 10 characters).</p>
            )}
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-bold text-zinc-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating Ticket...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
