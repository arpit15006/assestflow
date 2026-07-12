"use client";

import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResourceSelector } from "@/components/bookings/ResourceSelector";
import { BookingTimeline } from "@/components/bookings/BookingTimeline";
import { BookingForm } from "@/components/bookings/BookingForm";
import { UpcomingBookingsTable } from "@/components/bookings/UpcomingBookingsTable";
import { MOCK_BOOKINGS, Booking } from "@/lib/mock/bookings";

export default function BookingsPage() {
  const [selectedResourceId, setSelectedResourceId] = useState<string>('res-001'); // Default select first
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // States passed from timeline to form
  const [timeSelection, setTimeSelection] = useState<{start: Date, end: Date} | null>(null);

  // Filter bookings for the selected resource
  const resourceBookings = bookings.filter(b => b.resourceId === selectedResourceId);

  const handleTimeSelect = (start: Date, end: Date) => {
    setTimeSelection({ start, end });
  };

  const handleBookingSubmit = (data: any) => {
    const newBooking: Booking = {
      id: `bk-${Math.floor(Math.random() * 10000)}`,
      resourceId: selectedResourceId,
      title: data.title,
      date: selectedDate.toISOString().split('T')[0], // For mock just use current date
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      attendees: data.attendees,
      status: 'Confirmed',
      bookedBy: 'Arpit (You)',
      department: 'Engineering',
    };
    
    setBookings(prev => [...prev, newBooking]);
    setTimeSelection(null); // Clear selection
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-10 h-full flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Resource Booking</h1>
            <p className="text-zinc-500 mt-2 max-w-xl">Schedule and manage conference rooms, vehicles, and shared equipment.</p>
          </div>
        </div>

        {/* Resource Selector */}
        <div className="shrink-0">
          <ResourceSelector 
            selectedResourceId={selectedResourceId} 
            onSelect={(id) => {
              setSelectedResourceId(id);
              setTimeSelection(null);
            }} 
          />
        </div>

        {/* Main Grid: Timeline + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Left: Timeline Calendar */}
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BookingTimeline 
              bookings={resourceBookings}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onTimeSelect={handleTimeSelect}
            />
          </div>

          {/* Right: Booking Form & Upcoming list */}
          <div className="lg:col-span-4 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 h-full">
            <BookingForm 
              resourceId={selectedResourceId}
              selectedStart={timeSelection?.start}
              selectedEnd={timeSelection?.end}
              existingBookings={resourceBookings}
              onSubmit={handleBookingSubmit}
            />
            
            <div className="flex-1 min-h-[300px]">
              <UpcomingBookingsTable 
                bookings={resourceBookings} 
                onCancel={handleCancelBooking}
              />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
