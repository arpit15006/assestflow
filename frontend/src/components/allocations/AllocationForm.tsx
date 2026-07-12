import React, { useState, useEffect } from 'react';
import { Asset, Employee } from '@/lib/mock/allocations';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Users } from 'lucide-react';

interface AllocationFormProps {
  asset: Asset | null;
  employees?: Employee[];
  onAllocate: (assetId: string, employeeId: string, reason: string) => void;
  onTransfer: (assetId: string, toEmployeeId: string, reason: string) => void;
}

export function AllocationForm({ asset, employees, onAllocate, onTransfer }: AllocationFormProps) {
  const employeeList = employees && employees.length > 0 ? employees : [];
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation states
  const [touched, setTouched] = useState({ employee: false, reason: false });
  const [errors, setErrors] = useState({ employee: '', reason: '' });

  useEffect(() => {
    // Reset form state on asset change
    setSelectedEmployee('');
    setReason('');
    setIsSuccess(false);
    setIsLoading(false);
    setTouched({ employee: false, reason: false });
    setErrors({ employee: '', reason: '' });
  }, [asset]);

  if (!asset) return null;

  const isAllocated = asset.status === 'Allocated' && asset.allocatedTo;

  // Run validation
  const validate = () => {
    const newErrors = { employee: '', reason: '' };
    if (touched.employee && !selectedEmployee) {
      newErrors.employee = 'Please select an employee.';
    }
    if (touched.reason) {
      if (!reason) {
        newErrors.reason = 'Reason is required.';
      } else if (reason.length < 5) {
        newErrors.reason = 'Reason must be at least 5 characters.';
      }
    }
    setErrors(newErrors);
  };

  // Run validation when fields are touched or value changes
  useEffect(() => {
    validate();
  }, [selectedEmployee, reason, touched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched to trigger validation
    setTouched({ employee: true, reason: true });
    
    if (!selectedEmployee || !reason || reason.length < 5) {
      return;
    }

    setIsLoading(true);

    // Simulate API delay for a polished SaaS feel
    setTimeout(() => {
      setIsLoading(false);
      if (isAllocated) {
        onTransfer(asset.id, selectedEmployee, reason);
      } else {
        onAllocate(asset.id, selectedEmployee, reason);
      }
      setIsSuccess(true);
      
      // Auto-clear success message after delay
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedEmployee('');
        setReason('');
        setTouched({ employee: false, reason: false });
      }, 2000);
    }, 850);
  };

  const isFormValid = selectedEmployee && reason && reason.length >= 5 && !isLoading;

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* Warning/Conflict Alert Header */}
      {isAllocated && (
        <div className="bg-amber-50 border-b border-amber-100 p-5 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="text-amber-900 font-bold tracking-tight text-sm">Allocation Conflict Detected</h4>
            <p className="text-amber-700 text-xs mt-1 leading-relaxed">
              This asset is currently assigned to <strong>{asset.allocatedTo?.name}</strong> ({asset.allocatedTo?.department}). 
              Direct allocation is blocked. Initiating this form will submit a formal <strong>Transfer Request</strong> to reassign custody.
            </p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-zinc-900 mb-5 tracking-tight font-heading">
          {isAllocated ? 'Custody Transfer Request' : 'New Asset Assignment'}
        </h3>
        
        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
            <h4 className="text-emerald-950 font-bold text-lg">{isAllocated ? 'Transfer Processed' : 'Assignment Confirmed'}!</h4>
            <p className="text-emerald-700 text-xs mt-1">The asset registry status and audit history logs have been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Transfer Visual Pipeline */}
            {isAllocated ? (
              <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-4 grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                <div className="md:col-span-3 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Current Custodian</span>
                  <div className="flex items-center gap-2">
                    <img src={asset.allocatedTo?.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-full border border-zinc-200" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{asset.allocatedTo?.name}</p>
                      <p className="text-[10px] text-zinc-500 leading-none">{asset.allocatedTo?.department}</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-1 flex justify-center py-1 md:py-0">
                  <ArrowRight className="text-zinc-400 w-5 h-5 rotate-90 md:rotate-0" />
                </div>
                
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Target Custodian</label>
                  <select 
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, employee: true }))}
                    disabled={isLoading}
                    className={`w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all
                      ${errors.employee ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
                    `}
                  >
                    <option value="" disabled>Select recipient...</option>
                    {employeeList.filter(emp => emp.id !== asset.allocatedTo?.id).map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                    ))}
                  </select>
                  {errors.employee && <p className="text-[10px] text-red-500 font-medium">{errors.employee}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 block">Assign Custody To</label>
                <select 
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, employee: true }))}
                  disabled={isLoading}
                  className={`w-full max-w-md px-3 py-2 bg-white border rounded-lg text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all
                    ${errors.employee ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
                  `}
                >
                  <option value="" disabled>Choose an employee...</option>
                  {employeeList.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
                {errors.employee && <p className="text-[10px] text-red-500 font-medium">{errors.employee}</p>}
              </div>
            )}

            {/* Reason Text Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Allocation Notes / Business Case</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, reason: true }))}
                disabled={isLoading}
                rows={3}
                className={`w-full px-3 py-2.5 bg-white border rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none
                  ${errors.reason ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200'}
                `}
                placeholder="Describe the operational purpose (e.g. Remote work setup, Software testing node, Project migration)..."
              />
              <div className="flex justify-between items-center text-[10px]">
                {errors.reason ? (
                  <p className="text-red-500 font-medium">{errors.reason}</p>
                ) : (
                  <p className="text-zinc-400">At least 5 characters required.</p>
                )}
                <span className={`font-semibold ${reason.length >= 5 ? 'text-emerald-600' : 'text-zinc-400'}`}>
                  {reason.length} chars
                </span>
              </div>
            </div>

            {/* Submission buttons */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  isAllocated ? 'Submit Custody Transfer' : 'Confirm Assignment'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
