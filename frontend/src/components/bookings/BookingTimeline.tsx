"use client";

import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Booking } from '@/lib/mock/bookings';

interface BookingTimelineProps {
  bookings: Booking[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSelect: (start: Date, end: Date) => void;
}

export function BookingTimeline({ bookings, selectedDate, onDateChange, onTimeSelect }: BookingTimelineProps) {
  const calendarRef = useRef<FullCalendar>(null);
  
  // Format bookings for FullCalendar
  const events = bookings.map(b => {
    // Add dummy day for proper rendering since mock data just has times
    // We assume all mock bookings are on today's date for demonstration
    const startStr = `${b.date}T${b.startTime}:00`;
    const endStr = `${b.date}T${b.endTime}:00`;
    
    return {
      id: b.id,
      title: `${b.title} - ${b.bookedBy}`,
      start: startStr,
      end: endStr,
      backgroundColor: b.status === 'Confirmed' ? '#e0f2fe' : '#fef9c3', // sky-100 or yellow-100
      borderColor: b.status === 'Confirmed' ? '#38bdf8' : '#fde047', // sky-400 or yellow-400
      textColor: b.status === 'Confirmed' ? '#0369a1' : '#a16207', // sky-800 or yellow-800
    };
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-zinc-900 mb-6 tracking-tight">Today's Schedule</h3>
      
      {/* FullCalendar wrapper with custom CSS overrides for Tailwind */}
      <div className="fc-theme-standard" style={{ height: '500px' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          initialDate={selectedDate}
          headerToolbar={false} // Hide header, we control it externally if needed
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          events={events}
          height="100%"
          selectable={true}
          selectMirror={true}
          select={(info) => {
            onTimeSelect(info.start, info.end);
            // Don't unselect immediately, let form handle it
          }}
          eventContent={(arg) => {
            return (
              <div className="p-1 overflow-hidden h-full">
                <div className="font-semibold text-xs leading-tight truncate">{arg.event.title}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{arg.timeText}</div>
              </div>
            );
          }}
        />
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-zinc-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-sky-100 border border-sky-400"></div>
          Confirmed
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-400"></div>
          Pending
        </div>
      </div>
    </div>
  );
}
