import React, { useState, useEffect } from 'react';
import { Booking, MOCK_RESOURCES } from '@/lib/mock/bookings';
import { AlertCircle, CheckCircle2, Loader2, Users2, Calendar } from 'lucide-react';

interface BookingFormProps {
  resourceId: string;
  selectedStart?: Date | null;
  selectedEnd?: Date | null;
  existingBookings: Booking[];
  onSubmit: (bookingData: any) => void;
}

export function BookingForm({ resourceId, selectedStart, selectedEnd, existingBookings, onSubmit }: BookingFormProps) {
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conflict, setConflict] = useState<Booking | null>(null);

  const activeResource = MOCK_RESOURCES.find(r => r.id === resourceId);

  // Sync state with selected timeframe from calendar
  useEffect(() => {
    if (selectedStart && selectedEnd) {
      const startT = formatTime(selectedStart);
      const endT = formatTime(selectedEnd);
      setStartTime(startT);
      setEndTime(endT);
      checkConflicts(startT, endT);
    }
  }, [selectedStart, selectedEnd, resourceId]);

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const checkConflicts = (start: string, end: string) => {
    if (!start || !end) {
      setConflict(null);
      return;
    }
    
    const overlapping = existingBookings.find(b => {
      // Direct overlap checking: starts before end, ends after start (assumes same day)
      return (start < b.endTime && end > b.startTime && b.status !== 'Cancelled');
    });
    
    setConflict(overlapping || null);
  };

  const handleTimeChange = (type: 'start' | 'end', val: string) => {
    if (type === 'start') {
      setStartTime(val);
      checkConflicts(val, endTime);
    } else {
      setEndTime(val);
      checkConflicts(startTime, val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict || !isTimeOrderValid || !isWithinWorkingHours || isOverCapacity) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmit({ title, purpose, startTime, endTime, attendees });
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setPurpose('');
        setStartTime('');
        setEndTime('');
        setAttendees(1);
      }, 2000);
    }, 800);
  };

  // Form validations
  const isTimeOrderValid = startTime && endTime ? startTime < endTime : true;
  
  const isWithinWorkingHours = startTime && endTime 
    ? (startTime >= '08:00' && startTime <= '20:00' && endTime >= '08:00' && endTime <= '20:00')
    : true;

  const isOverCapacity = activeResource?.capacity 
    ? attendees > activeResource.capacity 
    : false;

  const isFormValid = 
    title.trim().length > 0 &&
    purpose.trim().length > 0 &&
    startTime &&
    endTime &&
    isTimeOrderValid &&
    isWithinWorkingHours &&
    !isOverCapacity &&
    !conflict &&
    !isLoading;

  if (!resourceId) {
    return (
      <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex items-center justify-center text-center h-[500px]">
        <div className="text-zinc-400">
          <p className="font-semibold text-lg mb-1">No Resource Selected</p>
          <p className="text-sm">Select a resource to book a slot.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900 tracking-tight font-heading">Book Resource</h3>
        {activeResource && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-zinc-50 border-zinc-200 font-mono text-zinc-600">
            {activeResource.name}
          </span>
        )}
      </div>

      {/* Validation Alert Panels */}
      {conflict && (
        <div className="bg-red-50 border-b border-red-100 p-4 flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="text-red-950 font-bold">Schedule Overlap Conflict</h4>
            <p className="text-red-700 mt-0.5 leading-relaxed">
              This slot overlaps with <strong>{conflict.title}</strong> ({conflict.bookedBy}) scheduled for {conflict.startTime} - {conflict.endTime}.
            </p>
          </div>
        </div>
      )}

      {startTime && endTime && !isTimeOrderValid && (
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="text-rose-950 font-bold">Invalid Sequence</h4>
            <p className="text-rose-700 mt-0.5">Start time must be strictly before end time.</p>
          </div>
        </div>
      )}

      {startTime && endTime && !isWithinWorkingHours && (
        <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="text-amber-950 font-bold">Hours Restrictive Policy</h4>
            <p className="text-amber-700 mt-0.5">Bookings must occur within corporate working hours: 08:00 - 20:00.</p>
          </div>
        </div>
      )}

      {isOverCapacity && (
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <Users2 className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="text-rose-950 font-bold">Resource Load Capacity Exceeded</h4>
            <p className="text-rose-700 mt-0.5">
              Maximum capacity for this room is <strong>{activeResource?.capacity}</strong> occupants. Please adjust passenger/attendee counts.
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
            <h4 className="text-emerald-950 font-bold text-base">Booking Confirmed!</h4>
            <p className="text-emerald-700 text-xs mt-1 leading-relaxed">Your reservation is approved and synced to the timeline calendar.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Start Time</label>
                <input 
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                  className={`w-full px-2.5 py-2 bg-white border rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all
                    ${conflict || !isTimeOrderValid || !isWithinWorkingHours ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200 focus:border-primary'}
                  `}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">End Time</label>
                <input 
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                  className={`w-full px-2.5 py-2 bg-white border rounded-lg text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all
                    ${conflict || !isTimeOrderValid || !isWithinWorkingHours ? 'border-red-300 ring-2 ring-red-50' : 'border-zinc-200 focus:border-primary'}
                  `}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Meeting / Event Title</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Sprint Planning Sync"
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Expected Attendance count</label>
              <input 
                type="number"
                min="1"
                required
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-xs font-sans font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all
                  ${isOverCapacity ? 'border-rose-300 ring-2 ring-rose-50' : 'border-zinc-200'}
                `}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 block">Operational Purpose</label>
              <textarea 
                rows={3}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Brief summary of meeting deliverables..."
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none font-sans font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-xs hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Checking Conflict & Saving...
                  </>
                ) : (
                  'Confirm Reservation'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
