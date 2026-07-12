import React from 'react';
import { Resource, MOCK_RESOURCES } from '@/lib/mock/bookings';
import { MapPin, Users, CalendarDays, Car, Presentation, Landmark, Layers } from 'lucide-react';

interface ResourceSelectorProps {
  selectedResourceId: string;
  onSelect: (resourceId: string) => void;
}

export function ResourceSelector({ selectedResourceId, onSelect }: ResourceSelectorProps) {
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Conference Room': return <Landmark className="w-5 h-5 text-primary" />;
      case 'Vehicle': return <Car className="w-5 h-5 text-indigo-600" />;
      case 'Projector': return <Presentation className="w-5 h-5 text-amber-600" />;
      default: return <Layers className="w-5 h-5 text-zinc-600" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-1.5 font-heading">
          <CalendarDays className="w-5 h-5 text-primary" />
          Select Shared Enterprise Resource
        </h3>
        <p className="text-zinc-500 text-xs mt-1">Select from available corporate assets below to view reservation timetables and create new bookings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_RESOURCES.map(res => {
          const isSelected = res.id === selectedResourceId;
          return (
            <div
              key={res.id}
              onClick={() => onSelect(res.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group active:scale-[0.98] ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Header Icon + Type */}
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-xs' : 'bg-zinc-100 group-hover:bg-zinc-200/60'} transition-colors`}>
                    {getResourceIcon(res.type)}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                    {res.type}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm font-sans group-hover:text-primary transition-colors leading-tight">
                    {res.name}
                  </h4>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs mt-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{res.location}</span>
                  </div>
                </div>
              </div>

              {/* Capacity Footer (if present) */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">{res.id}</span>
                {res.capacity ? (
                  <div className="flex items-center gap-1 text-zinc-600 text-xs font-semibold">
                    <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Cap: {res.capacity}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-400 font-semibold italic">Device</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
