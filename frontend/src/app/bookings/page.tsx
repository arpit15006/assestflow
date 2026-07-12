"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResourceSelector } from "@/components/bookings/ResourceSelector";
import { BookingTimeline } from "@/components/bookings/BookingTimeline";
import { BookingForm } from "@/components/bookings/BookingForm";
import { UpcomingBookingsTable } from "@/components/bookings/UpcomingBookingsTable";
import { MOCK_BOOKINGS, MOCK_RESOURCES, Booking } from "@/lib/mock/bookings";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { X, Loader2, AlertCircle, Info, CalendarDays, RefreshCw } from 'lucide-react';

export default function BookingsPage() {
  const [selectedResourceId, setSelectedResourceId] = useState<string>('res-001');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSelection, setTimeSelection] = useState<{start: Date, end: Date} | null>(null);

  // Rescheduling states
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStart, setRescheduleStart] = useState('');
  const [rescheduleEnd, setRescheduleEnd] = useState('');
  const [rescheduleConflict, setRescheduleConflict] = useState<Booking | null>(null);
  const [isReschedulingLoading, setIsReschedulingLoading] = useState(false);

  // Active Resource
  const activeResource = useMemo(() => {
    return MOCK_RESOURCES.find(r => r.id === selectedResourceId);
  }, [selectedResourceId]);

  // Selected date formatted as string (YYYY-MM-DD)
  const selectedDateStr = useMemo(() => {
    return selectedDate.toISOString().split('T')[0];
  }, [selectedDate]);

  // Bookings for the active resource on the selected date
  const resourceDateBookings = useMemo(() => {
    return bookings.filter(b => b.resourceId === selectedResourceId && b.date === selectedDateStr);
  }, [bookings, selectedResourceId, selectedDateStr]);

  // Overall bookings for the active resource (for upcoming list)
  const resourceAllBookings = useMemo(() => {
    return bookings.filter(b => b.resourceId === selectedResourceId && b.status !== 'Cancelled');
  }, [bookings, selectedResourceId]);

  const handleTimeSelect = (start: Date, end: Date) => {
    setTimeSelection({ start, end });
  };

  const handleBookingSubmit = (data: any) => {
    // 1. Capacity check
    if (activeResource?.capacity && data.attendees > activeResource.capacity) {
      toast.error(`Exceeded maximum capacity of ${activeResource.capacity} occupants.`);
      return;
    }

    // 2. Conflict check
    const isConflict = bookings.some(b => {
      return b.resourceId === selectedResourceId &&
             b.date === selectedDateStr &&
             b.status !== 'Cancelled' &&
             data.startTime < b.endTime && 
             data.endTime > b.startTime;
    });

    if (isConflict) {
      toast.error("Time slot unavailable. Overlaps with an existing reservation.");
      return;
    }

    const newBooking: Booking = {
      id: `bk-${Math.floor(Math.random() * 10000)}`,
      resourceId: selectedResourceId,
      title: data.title,
      date: selectedDateStr,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      attendees: data.attendees,
      status: 'Confirmed',
      bookedBy: 'Arpit Patel (You)',
      department: 'Engineering',
    };
    
    setBookings(prev => [...prev, newBooking]);
    setTimeSelection(null);
    toast.success(`Booking "${data.title}" successfully confirmed.`);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    }));
    toast.success("Reservation successfully cancelled.");
  };

  // Reschedule Operations
  const handleOpenReschedule = (booking: Booking) => {
    setReschedulingBooking(booking);
    setRescheduleDate(booking.date);
    setRescheduleStart(booking.startTime);
    setRescheduleEnd(booking.endTime);
    setRescheduleConflict(null);
  };

  // Run conflict validation for rescheduling
  const runRescheduleConflictCheck = (date: string, start: string, end: string) => {
    if (!start || !end || !date || !reschedulingBooking) {
      setRescheduleConflict(null);
      return;
    }

    const conflictRecord = bookings.find(b => {
      return b.id !== reschedulingBooking.id &&
             b.resourceId === selectedResourceId &&
             b.date === date &&
             b.status !== 'Cancelled' &&
             start < b.endTime &&
             end > b.startTime;
    });

    setRescheduleConflict(conflictRecord || null);
  };

  // Check conflicts dynamically on input changes
  useEffect(() => {
    runRescheduleConflictCheck(rescheduleDate, rescheduleStart, rescheduleEnd);
  }, [rescheduleDate, rescheduleStart, rescheduleEnd, reschedulingBooking]);

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rescheduleConflict || !rescheduleStart || !rescheduleEnd || !rescheduleDate || !reschedulingBooking) {
      return;
    }

    if (rescheduleStart >= rescheduleEnd) {
      toast.error("Invalid range: start time must be before end time.");
      return;
    }

    setIsReschedulingLoading(true);

    setTimeout(() => {
      setIsReschedulingLoading(false);
      setBookings(prev => prev.map(b => {
        if (b.id === reschedulingBooking.id) {
          return {
            ...b,
            date: rescheduleDate,
            startTime: rescheduleStart,
            endTime: rescheduleEnd
          };
        }
        return b;
      }));

      // If rescheduled to another date, let's focus that date in view
      const targetDate = new Date(rescheduleDate);
      setSelectedDate(targetDate);

      toast.success(`"${reschedulingBooking.title}" rescheduled successfully.`);
      setReschedulingBooking(null); // Close modal
    }, 800);
  };

  // Trap focus & Escape close handler for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReschedulingBooking(null);
      }
    };
    if (reschedulingBooking) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reschedulingBooking]);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl w-full mx-auto pb-6 font-sans">
        <Toaster position="top-right" richColors />
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 font-heading">Resource Scheduling Hub</h1>
            <p className="text-zinc-500 mt-2 max-w-xl text-xs">Schedule meeting rooms, check vehicle availability, allocate projectors, and review calendar conflicts.</p>
          </div>
        </div>

        {/* Resource Cards Grid */}
        <div className="shrink-0">
          <ResourceSelector 
            selectedResourceId={selectedResourceId} 
            onSelect={(id) => {
              setSelectedResourceId(id);
              setTimeSelection(null);
            }} 
          />
        </div>

        {/* Main Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4">
          
          {/* Left Column: Timeline Schedule */}
          <div className="lg:col-span-8 flex flex-col">
            <BookingTimeline 
              bookings={resourceDateBookings}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onTimeSelect={handleTimeSelect}
            />
          </div>

          {/* Right Column: Form and Upcoming table */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <BookingForm 
              resourceId={selectedResourceId}
              selectedStart={timeSelection?.start}
              selectedEnd={timeSelection?.end}
              existingBookings={resourceAllBookings}
              onSubmit={handleBookingSubmit}
            />
            
            <div>
              <UpcomingBookingsTable 
                bookings={resourceAllBookings} 
                onCancel={handleCancelBooking}
                onReschedule={handleOpenReschedule}
              />
            </div>
          </div>
        </div>

        {/* Accessible Modal Backdrop for Rescheduling */}
        {reschedulingBooking && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) setReschedulingBooking(null); }}
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-zinc-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
                <h3 className="font-bold text-zinc-950 text-sm flex items-center gap-1.5 font-heading">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  Reschedule Reservation
                </h3>
                <button 
                  onClick={() => setReschedulingBooking(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4 font-sans text-xs">
                
                {/* Meeting Meta Header */}
                <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Meeting Details</span>
                  <h4 className="font-bold text-zinc-900 text-sm">{reschedulingBooking.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">{reschedulingBooking.bookedBy} • {reschedulingBooking.department}</p>
                </div>

                {/* Overlap Error Display */}
                {rescheduleConflict && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 animate-in shake-in duration-300">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-red-950 font-bold text-[10px]">Overlapping Time Slot Conflict</h5>
                      <p className="text-red-700 mt-0.5 leading-relaxed text-[9px]">
                        Overlaps with <strong>{rescheduleConflict.title}</strong> scheduled on {rescheduleConflict.date} ({rescheduleConflict.startTime} - {rescheduleConflict.endTime}).
                      </p>
                    </div>
                  </div>
                )}

                {/* Date Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700">Reservation Date</label>
                  <input 
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans"
                  />
                </div>

                {/* Hours Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">Start Time</label>
                    <input 
                      type="time"
                      required
                      value={rescheduleStart}
                      onChange={(e) => setRescheduleStart(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700">End Time</label>
                    <input 
                      type="time"
                      required
                      value={rescheduleEnd}
                      onChange={(e) => setRescheduleEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Reschedule Confirmation */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReschedulingBooking(null)}
                    disabled={isReschedulingLoading}
                    className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-bold text-zinc-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!rescheduleConflict || !rescheduleStart || !rescheduleEnd || !rescheduleDate || isReschedulingLoading}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isReschedulingLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving Slot...
                      </>
                    ) : (
                      'Update Schedule'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
