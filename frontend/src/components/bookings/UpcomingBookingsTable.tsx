import React from 'react';
import { Booking } from '@/lib/mock/bookings';
import { Clock, Calendar, Users, X, RefreshCw } from 'lucide-react';

interface UpcomingBookingsTableProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
}

export function UpcomingBookingsTable({ bookings, onCancel }: UpcomingBookingsTableProps) {
  // Simple sort by time
  const sorted = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Upcoming Bookings</h3>
        <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-full">
          {bookings.length} Events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sorted.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500">
            <Calendar className="w-10 h-10 mb-3 text-zinc-300" />
            <p>No upcoming bookings found for this resource.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map(booking => (
              <div key={booking.id} className="p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-zinc-900 leading-tight">{booking.title}</h4>
                    <p className="text-sm text-zinc-500">{booking.bookedBy} • {booking.department}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs font-medium text-zinc-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {booking.attendees} pax
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      booking.status === 'Confirmed' 
                        ? 'bg-sky-50 text-sky-700 border-sky-200' 
                        : booking.status === 'Pending' 
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {booking.status}
                    </span>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Reschedule">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onCancel(booking.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="Cancel Booking"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
