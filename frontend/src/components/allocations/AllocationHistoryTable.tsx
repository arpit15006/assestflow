import React, { useState, useMemo } from 'react';
import { AllocationHistoryRecord } from '@/lib/mock/allocations';
import { Search, ArrowUpDown, ChevronDown, ChevronUp, History, Info } from 'lucide-react';

interface AllocationHistoryTableProps {
  history: AllocationHistoryRecord[];
}

type SortField = 'date' | 'allocatedTo' | 'status';
type SortOrder = 'asc' | 'desc';

export function AllocationHistoryTable({ history }: AllocationHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Handle Sort Click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filtered & Sorted records
  const processedRecords = useMemo(() => {
    // 1. Filter
    const filtered = history.filter(record => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        record.allocatedTo.toLowerCase().includes(lowerSearch) ||
        record.department.toLowerCase().includes(lowerSearch) ||
        (record.returnedBy && record.returnedBy.toLowerCase().includes(lowerSearch))
      );
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      let aField = a[sortField] || '';
      let bField = b[sortField] || '';

      if (sortField === 'date') {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
      }

      const comparison = String(aField).localeCompare(String(bField));
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [history, searchTerm, sortField, sortOrder]);

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Toolbar */}
      <div className="px-6 py-5 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-50/50">
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-1.5 font-heading">
          <History className="w-5 h-5 text-zinc-400" />
          Audit & Allocation History
        </h3>
        
        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute inset-y-0 left-2.5 my-auto h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            className="block w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] text-zinc-500 bg-zinc-50 border-b border-zinc-200 uppercase font-bold tracking-wider select-none">
            <tr>
              <th scope="col" className="px-6 py-3.5 cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">
                  Transaction Date
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3.5 cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('allocatedTo')}>
                <div className="flex items-center gap-1">
                  Custodian Details
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3.5">Returned By</th>
              <th scope="col" className="px-6 py-3.5">Return Condition</th>
              <th scope="col" className="px-6 py-3.5 cursor-pointer hover:bg-zinc-100 transition-colors" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-sans">
            {processedRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center">
                    <Info className="w-6 h-6 text-zinc-300 mb-1" />
                    <p className="font-semibold text-zinc-400">No matching history records</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Try altering your search text.</p>
                  </div>
                </td>
              </tr>
            ) : (
              processedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-950 whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-zinc-900">{record.allocatedTo}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">{record.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium">
                    {record.returnedBy || <span className="text-zinc-300">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    {record.returnCondition ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        record.returnCondition === 'New' || record.returnCondition === 'Good'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : record.returnCondition === 'Fair'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {record.returnCondition}
                      </span>
                    ) : (
                      <span className="text-zinc-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 inline-flex text-[10px] font-bold rounded-full border ${
                      record.status === 'Allocated' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
