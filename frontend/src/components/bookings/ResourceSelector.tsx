import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Users, CalendarDays, Car, Presentation, Landmark, Layers, Loader2, ChevronDown } from 'lucide-react';

interface ResourceSelectorProps {
  selectedResourceId: string;
  onSelect: (resourceId: string) => void;
  resources?: any[];
}

export function ResourceSelector({ selectedResourceId, onSelect, resources }: ResourceSelectorProps) {
  const resourceList = resources && resources.length > 0 ? resources : [];
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Conference Room': return <Landmark className="w-4 h-4 text-primary" />;
      case 'Vehicle': return <Car className="w-4 h-4 text-indigo-600" />;
      case 'Projector': return <Presentation className="w-4 h-4 text-amber-600" />;
      default: return <Layers className="w-4 h-4 text-zinc-600" />;
    }
  };

  const selectedIdx = resourceList.findIndex(r => r.id === selectedResourceId);
  
  // Calculate displayed cards (exactly 4 at a time)
  const displayedCards = React.useMemo(() => {
    if (resourceList.length <= 4) return resourceList;
    if (selectedIdx === -1 || selectedIdx < 4) {
      return resourceList.slice(0, 4);
    }
    // Swap the selected card into the 4th slot if it is outside the first 4
    const list = [...resourceList.slice(0, 3)];
    list.push(resourceList[selectedIdx]);
    return list;
  }, [resourceList, selectedResourceId, selectedIdx]);

  // Dropdown list contains items not currently visible in the grid
  const dropdownItems = React.useMemo(() => {
    if (resourceList.length <= 4) return [];
    return resourceList.filter(res => !displayedCards.some(card => card.id === res.id));
  }, [resourceList, displayedCards]);

  const filteredDropdownItems = dropdownItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    (item.category || item.type || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.assetTag || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-1.5 font-heading">
          <CalendarDays className="w-5 h-5 text-primary" />
          Select Shared Enterprise Resource
        </h3>
        <p className="text-zinc-500 text-xs mt-1">Select from available corporate assets below to view reservation timetables and create new bookings.</p>
      </div>

      {resourceList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-zinc-300" />
          <p className="text-sm font-semibold">Loading shared resources...</p>
          <p className="text-xs text-zinc-400 mt-1">Fetching bookable assets from the database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedCards.map(res => {
              const isSelected = res.id === selectedResourceId;
              return (
                <div
                  key={res.id}
                  onClick={() => onSelect(res.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group active:scale-[0.98] ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/10'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Icon + Type */}
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-xs' : 'bg-zinc-100 group-hover:bg-zinc-200/60'} transition-colors`}>
                        {getResourceIcon(res.category || res.type)}
                      </div>
                      <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                        {res.category || res.type}
                      </span>
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm font-sans group-hover:text-primary transition-colors leading-tight">
                        {res.name}
                      </h4>
                      <div className="flex items-center gap-1 text-zinc-500 text-xs mt-2 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{res.location || 'HQ'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Footer */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase truncate max-w-[80px]">{res.assetTag || res.id?.slice(0,8)}</span>
                    {res.capacity ? (
                      <div className="flex items-center gap-1 text-zinc-600 text-xs font-semibold">
                        <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>Cap: {res.capacity}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-400 font-semibold italic">Shared</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {resourceList.length > 4 && (
            <div className="flex justify-center pt-2 relative" ref={dropdownRef}>
              <div className="w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-900 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-zinc-400" />
                    Other Shared Resources ({dropdownItems.length})
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-full max-w-xs z-50 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1.5 space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="px-2 py-1.5 border-b border-zinc-100 flex items-center bg-zinc-50/50 rounded-lg">
                      <input
                        type="text"
                        placeholder="Search resources..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent border-none text-xs font-semibold text-zinc-950 placeholder-zinc-400 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="space-y-0.5">
                      {filteredDropdownItems.length === 0 ? (
                        <div className="px-3 py-4 text-center text-xs text-zinc-400 font-medium">
                          No matching resources found
                        </div>
                      ) : (
                        filteredDropdownItems.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onSelect(item.id);
                              setIsOpen(false);
                              setSearch('');
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-50 flex items-center justify-between group transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-1.5 bg-zinc-100 group-hover:bg-zinc-200/60 rounded-md shrink-0">
                                {getResourceIcon(item.category || item.type)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-zinc-950 text-xs truncate leading-tight">{item.name}</div>
                                <div className="text-[10px] text-zinc-400 truncate mt-0.5">{item.location || 'HQ'} • {item.category || item.type}</div>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase shrink-0 bg-zinc-100 px-1.5 py-0.5 rounded ml-2">{item.assetTag || item.id?.slice(0, 8)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
