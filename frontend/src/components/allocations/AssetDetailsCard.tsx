import React from 'react';
import { Asset } from '@/lib/mock/allocations';
import { Badge } from 'lucide-react'; // We will use a custom badge if lucide-react doesn't have it, actually let's use a standard span for badge

interface AssetDetailsCardProps {
  asset: Asset | null;
}

export function AssetDetailsCard({ asset }: AssetDetailsCardProps) {
  if (!asset) {
    return (
      <div className="w-full bg-white rounded-2xl border border-zinc-200 border-dashed p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">No Asset Selected</h3>
        <p className="text-zinc-500 mt-1 max-w-sm">Search for an asset using the search bar above to view its details and allocation status.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Allocated': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'In Maintenance': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Good': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Fair': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Poor': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 transition-all">
      {/* Image Section */}
      <div className="w-full md:w-48 h-48 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 relative flex items-center justify-center">
        {asset.imageUrl ? (
          <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-zinc-400">No Image</span>
        )}
      </div>

      {/* Details Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">{asset.category}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">{asset.department}</span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{asset.name}</h2>
              <div className="text-sm font-medium text-zinc-500 mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-700 font-mono text-xs border border-zinc-200">{asset.tag}</span>
                <span>SN: {asset.serialNumber}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(asset.status)}`}>
                {asset.status}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getConditionColor(asset.condition)}`}>
                Condition: {asset.condition}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">Current Location</p>
            <p className="text-sm font-medium text-zinc-900">{asset.location}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">Acquisition Date</p>
            <p className="text-sm font-medium text-zinc-900">{new Date(asset.acquisitionDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
