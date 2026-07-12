import React from 'react';
import { AllocationHistoryRecord } from '@/lib/mock/allocations';

interface AllocationHistoryTableProps {
  history: AllocationHistoryRecord[];
}

export function AllocationHistoryTable({ history }: AllocationHistoryTableProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Allocation History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 bg-zinc-50/50 border-b border-zinc-200 uppercase font-semibold">
            <tr>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4">Allocated To</th>
              <th scope="col" className="px-6 py-4">Returned By</th>
              <th scope="col" className="px-6 py-4">Condition</th>
              <th scope="col" className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No history available for this asset.
                </td>
              </tr>
            ) : (
              history.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-zinc-700">
                    <div>
                      <p className="font-medium">{record.allocatedTo}</p>
                      <p className="text-xs text-zinc-500">{record.department}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-700">
                    {record.returnedBy || <span className="text-zinc-400">-</span>}
                  </td>
                  <td className="px-6 py-4 text-zinc-700">
                    {record.returnCondition ? (
                      <span className="px-2 py-1 rounded bg-zinc-100 text-zinc-600 text-xs font-semibold border border-zinc-200">
                        {record.returnCondition}
                      </span>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
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
