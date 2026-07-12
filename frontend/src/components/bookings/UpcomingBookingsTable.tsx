import React, { useState, useMemo } from 'react';
import { Booking } from '@/lib/mock/bookings';
import { Clock, Calendar, Users, X, RefreshCw, Search, Filter, Landmark } from 'lucide-react';

interface UpcomingBookingsTableProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
  onReschedule: (booking: Booking) => void;
}

export function UpcomingBookingsTable({ bookings, onCancel, onReschedule }: UpcomingBookingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Derive unique departments from bookings list
  const departments = useMemo(() => {
    const list = new Set(bookings.map(b => b.department));
    return ['All', ...Array.from(list)];
  }, [bookings]);

  // Filtered upcoming bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.bookedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === 'All' || b.department === selectedDept;

      return matchesSearch && matchesDept && b.status !== 'Cancelled';
    });
  }, [bookings, searchTerm, selectedDept]);

  // Sort by time
  const sorted = useMemo(() => {
    return [...filteredBookings].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filteredBookings]);

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full font-sans">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-200 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight font-heading">Upcoming Bookings</h3>
          <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-full border border-zinc-200">
            {sorted.length} Active
          </span>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <div className="relative">
            <Search className="absolute inset-y-0 left-2.5 my-auto h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-[11px] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans font-medium"
            />
          </div>

          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-[11px] text-zinc-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-50/20">
        {sorted.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <Calendar className="w-10 h-10 mb-2 text-zinc-300" />
            <p className="font-semibold text-xs text-zinc-500">No scheduled bookings found</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Change search criteria or book a time slot above.</p>
          </div>
        ) : (
          sorted.map(booking => (
            <div 
              key={booking.id} 
              className="p-3.5 rounded-xl border border-zinc-200/60 bg-white hover:border-zinc-300 hover:shadow-xs transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-zinc-900 text-xs leading-tight truncate font-sans group-hover:text-primary transition-colors">
                    {booking.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-medium truncate font-sans">
                    {booking.bookedBy} • <span className="font-semibold">{booking.department}</span>
                  </p>
                  
                  <div className="flex items-center gap-3 pt-2.5 text-[10px] font-semibold text-zinc-500 font-sans">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{booking.attendees} pax</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full min-h-[50px] shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border bg-sky-50 text-sky-700 border-sky-200">
                    {booking.status}
                  </span>
                  
                  {/* Actions on Hover */}
                  <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onReschedule(booking)}
                      className="p-1 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all active:scale-95" 
                      title="Reschedule Booking"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onCancel(booking.id)}
                      className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all active:scale-95" 
                      title="Cancel Booking"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
