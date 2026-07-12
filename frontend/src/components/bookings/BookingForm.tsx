import React, { useState, useEffect } from 'react';
import { Booking } from '@/lib/mock/bookings';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [conflict, setConflict] = useState<Booking | null>(null);

  // Sync state with selected timeframe from calendar
  useEffect(() => {
    if (selectedStart && selectedEnd) {
      setStartTime(formatTime(selectedStart));
      setEndTime(formatTime(selectedEnd));
      checkConflicts(formatTime(selectedStart), formatTime(selectedEnd));
    }
  }, [selectedStart, selectedEnd, resourceId]); // Run when these change

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const checkConflicts = (start: string, end: string) => {
    // Basic mock conflict detection
    if (!start || !end) return;
    
    const overlapping = existingBookings.find(b => {
      // Simplistic time overlap logic for mock purposes (assumes same day)
      return (start < b.endTime && end > b.startTime);
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
    if (conflict) return;

    onSubmit({ title, purpose, startTime, endTime, attendees });
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setPurpose('');
      setStartTime('');
      setEndTime('');
      setAttendees(1);
    }, 3000);
  };

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
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-zinc-200">
        <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Book Resource</h3>
      </div>

      {conflict && (
        <div className="bg-red-50 border-b border-red-100 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-900 font-semibold tracking-tight">Time Slot Unavailable</h4>
            <p className="text-red-700 text-sm mt-1">
              Conflicts with <strong>{conflict.title}</strong> booked by {conflict.bookedBy} from {conflict.startTime} to {conflict.endTime}.
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
            <h4 className="text-emerald-900 font-bold text-lg">Booking Confirmed!</h4>
            <p className="text-emerald-700 text-sm mt-1">Your reservation has been saved to the calendar.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Start Time</label>
                <input 
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all
                    ${conflict ? 'border-red-300 focus:border-red-500 focus:ring-red-500/40' : 'border-zinc-200 focus:border-primary'}
                  `}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">End Time</label>
                <input 
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all
                    ${conflict ? 'border-red-300 focus:border-red-500 focus:ring-red-500/40' : 'border-zinc-200 focus:border-primary'}
                  `}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Event Title</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q3 Planning Sync"
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Attendees Count</label>
              <input 
                type="number"
                min="1"
                required
                value={attendees}
                onChange={(e) => setAttendees(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Purpose</label>
              <textarea 
                rows={3}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Brief description of the meeting..."
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!!conflict || !startTime || !endTime}
                className="w-full px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Slot
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
