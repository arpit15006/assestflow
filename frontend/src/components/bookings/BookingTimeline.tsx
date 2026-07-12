"use client";

import React, { useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Booking } from '@/lib/mock/bookings';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface BookingTimelineProps {
  bookings: Booking[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSelect: (start: Date, end: Date) => void;
}

export function BookingTimeline({ bookings, selectedDate, onDateChange, onTimeSelect }: BookingTimelineProps) {
  const calendarRef = useRef<FullCalendar>(null);
  
  // Dynamic navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  // Format bookings for FullCalendar
  const events = bookings.map(b => {
    // Add date string for proper rendering
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

  const formattedDateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const dateKey = selectedDate.toISOString().split('T')[0];

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col">
      
      {/* Calendar Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0">
        <div>
          <h3 className="text-lg font-bold text-zinc-950 tracking-tight font-heading">Today's Schedule</h3>
          <p className="text-[11px] text-zinc-500 font-medium font-sans flex items-center gap-1 mt-0.5">
            <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
            {formattedDateString}
          </p>
        </div>

        {/* Date Navigation Buttons */}
        <div className="flex items-center gap-1 shrink-0 font-sans">
          <button
            onClick={handlePrevDay}
            className="p-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-zinc-600 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-bold text-zinc-700 transition-colors"
          >
            Today
          </button>

          <button
            onClick={handleNextDay}
            className="p-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-zinc-600 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* FullCalendar wrapper */}
      <div className="fc-theme-standard">
        <FullCalendar
          key={dateKey} // Remount when date changes to automatically show the day
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          initialDate={selectedDate}
          headerToolbar={false}
          allDaySlot={false}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          events={events}
          height="auto"
          selectable={true}
          selectMirror={true}
          select={(info) => {
            onTimeSelect(info.start, info.end);
          }}
          eventContent={(arg) => {
            return (
              <div className="p-1.5 overflow-hidden h-full flex flex-col justify-between font-sans">
                <div className="font-bold text-[10px] leading-tight text-sky-900 line-clamp-2">{arg.event.title}</div>
                <div className="text-[9px] font-semibold opacity-75 mt-0.5 text-sky-800">{arg.timeText}</div>
              </div>
            );
          }}
        />
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-sans shrink-0">
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
