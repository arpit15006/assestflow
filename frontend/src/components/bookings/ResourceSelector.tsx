import React from 'react';
import { Resource, MOCK_RESOURCES } from '@/lib/mock/bookings';
import { MapPin, Users } from 'lucide-react';

interface ResourceSelectorProps {
  selectedResourceId: string;
  onSelect: (resourceId: string) => void;
}

export function ResourceSelector({ selectedResourceId, onSelect }: ResourceSelectorProps) {
  const selectedResource = MOCK_RESOURCES.find(r => r.id === selectedResourceId);

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-6">
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-semibold text-zinc-700 mb-2">Select Resource</label>
        <select 
          value={selectedResourceId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
        >
          <option value="" disabled>Choose a resource...</option>
          {MOCK_RESOURCES.map(res => (
            <option key={res.id} value={res.id}>{res.name} ({res.type})</option>
          ))}
        </select>
      </div>

      {selectedResource && (
        <div className="flex-1 flex items-center gap-6 border-l-0 md:border-l border-zinc-200 pt-4 md:pt-0 pl-0 md:pl-6">
          <div className="flex items-center gap-2 text-zinc-600">
            <span className="p-2 bg-zinc-100 rounded-lg shrink-0">
              <MapPin className="w-5 h-5 text-zinc-500" />
            </span>
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Location</p>
              <p className="text-sm font-medium text-zinc-900">{selectedResource.location}</p>
            </div>
          </div>
          
          {selectedResource.capacity && (
            <div className="flex items-center gap-2 text-zinc-600">
              <span className="p-2 bg-zinc-100 rounded-lg shrink-0">
                <Users className="w-5 h-5 text-zinc-500" />
              </span>
              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Capacity</p>
                <p className="text-sm font-medium text-zinc-900">Up to {selectedResource.capacity} people</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
