import React, { useState, useEffect } from 'react';
import { MaintenancePriority } from '@/lib/mock/maintenance';
import { X, AlertCircle, Loader2, Plus, Info, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { assetsApi } from '@/lib/api/assets';

interface NewRequestDialogProps {
  onClose: () => void;
  onSubmit: (newRequest: any) => void;
}

export function NewRequestDialog({ onClose, onSubmit }: NewRequestDialogProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MaintenancePriority>('Medium');

  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ asset: false, issue: false, description: false });
  const [errors, setErrors] = useState({ asset: '', issue: '', description: '' });

  // Load all assets from real API
  const { data: assetData, isLoading: assetsLoading } = useQuery({
    queryKey: ['assets-for-maintenance'],
    queryFn: () => assetsApi.list({ limit: 200 }),
  });

  const assets: any[] = assetData?.assets || (Array.isArray(assetData) ? assetData : []);
  const selectedAsset = assets.find((a: any) => a.id === selectedAssetId);

  // Form validation
  const validate = () => {
    const newErrors = { asset: '', issue: '', description: '' };
    if (touched.asset && !selectedAssetId) {
      newErrors.asset = 'Please select an asset.';
    }
    if (touched.issue) {
      if (!issue.trim()) newErrors.issue = 'Issue summary is required.';
      else if (issue.trim().length < 5) newErrors.issue = 'At least 5 characters required.';
    }
    if (touched.description) {
      if (!description.trim()) newErrors.description = 'Detailed description is required.';
      else if (description.trim().length < 10) newErrors.description = 'At least 10 characters required.';
    }
    setErrors(newErrors);
  };

  useEffect(() => { validate(); }, [selectedAssetId, issue, description, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ asset: true, issue: true, description: true });

    const isValid = selectedAssetId && issue.trim().length >= 5 && description.trim().length >= 10;
    if (!isValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmit({
        assetId: selectedAssetId,
        assetName: selectedAsset?.name || 'Unknown',
        description: `${issue.trim()} — ${description.trim()}`,
        priority,
      });
      onClose();
    }, 850);
  };

  const isFormValid = selectedAssetId && issue.trim().length >= 5 && description.trim().length >= 10 && !isLoading;

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
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            {/* Asset Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block">Asset</label>
              {assetsLoading ? (
                <div className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-2 text-zinc-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="text-xs">Loading assets...</span>
                </div>
              ) : (
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  onBlur={() => handleBlur('asset')}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all
                    ${errors.asset ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
                  `}
                >
                  <option value="" disabled>Select asset...</option>
                  {assets.map((asset: any) => (
                    <option key={asset.id} value={asset.id}>{asset.assetTag} — {asset.name}</option>
                  ))}
                </select>
              )}
              {errors.asset && <p className="text-[10px] text-red-500 font-medium">{errors.asset}</p>}
            </div>

            {/* Asset Name (Autofilled) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 block">Asset Name (Auto)</label>
              <input
                type="text"
                disabled
                value={selectedAsset?.name || ''}
                placeholder="Select an asset..."
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

            {/* Department (static from auth, shown for context) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block">Category</label>
              <input
                type="text"
                disabled
                value={selectedAsset?.category?.name || 'Auto-detected'}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-500 font-medium"
              />
            </div>
          </div>

          {/* Issue Summary */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block">Issue Summary</label>
            <input
              type="text"
              placeholder="e.g. Screen flickering, battery not charging, fan noise"
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
              <p className="text-[9px] text-zinc-400">Brief one-line summary (min. 5 characters).</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block">Detailed Fault Description</label>
            <textarea
              rows={3}
              placeholder="Describe symptoms, steps to reproduce, incident context, or impact on operations..."
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
              <p className="text-[9px] text-zinc-400">Provide troubleshooting notes or observations (min. 10 characters).</p>
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
