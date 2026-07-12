import React, { useState } from 'react';
import { Asset, Employee, MOCK_EMPLOYEES } from '@/lib/mock/allocations';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AllocationFormProps {
  asset: Asset | null;
  onAllocate: (assetId: string, employeeId: string, reason: string) => void;
  onTransfer: (assetId: string, toEmployeeId: string, reason: string) => void;
}

export function AllocationForm({ asset, onAllocate, onTransfer }: AllocationFormProps) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!asset) return null;

  const isAllocated = asset.status === 'Allocated' && asset.allocatedTo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    if (isAllocated) {
      onTransfer(asset.id, selectedEmployee, reason);
    } else {
      onAllocate(asset.id, selectedEmployee, reason);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedEmployee('');
      setReason('');
    }, 3000);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
      {/* Conflict Alert Header */}
      {isAllocated && (
        <div className="bg-red-50 border-b border-red-100 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-900 font-semibold tracking-tight">Already Allocated to {asset.allocatedTo?.name} ({asset.allocatedTo?.department})</h4>
            <p className="text-red-700 text-sm mt-1">Direct reallocation is blocked. You must submit a transfer request below.</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-6 tracking-tight">
          {isAllocated ? 'Transfer Request' : 'New Allocation'}
        </h3>
        
        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center text-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
            <h4 className="text-emerald-900 font-bold text-lg">{isAllocated ? 'Transfer Requested' : 'Asset Allocated'} successfully!</h4>
            <p className="text-emerald-700 text-sm mt-1">The workflow has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {isAllocated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">From</label>
                  <div className="flex items-center gap-3 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <img src={asset.allocatedTo?.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium text-zinc-500">{asset.allocatedTo?.name}</span>
                  </div>
                </div>
                
                <div className="hidden md:flex justify-center pb-2">
                  <ArrowRight className="text-zinc-300 w-5 h-5" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700">To</label>
                  <select 
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  >
                    <option value="" disabled>Select Employee...</option>
                    {MOCK_EMPLOYEES.filter(emp => emp.id !== asset.allocatedTo?.id).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Allocate To</label>
                <select 
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  required
                  className="w-full max-w-md px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="" disabled>Select Employee...</option>
                  {MOCK_EMPLOYEES.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Reason / Notes</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                placeholder="Briefly explain the reason for this allocation or transfer..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!selectedEmployee}
                className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAllocated ? 'Submit Transfer Request' : 'Confirm Allocation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
