'use client';

import { useEffect, useState } from 'react';
import { getEventById, type EventDay } from '@/helpers/eventsDataService';

export interface EventRegistrationProps {
  id: number;
}

const EVENT_LOAD_DELAY_MS = 5000;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Formats as weekday, zero-padded day, short month, year (e.g. Monday 19 May 2026). */
function formatEventDayDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) {
    return isoDate;
  }
  const weekday = new Intl.DateTimeFormat('en-AU', { weekday: 'long' }).format(d);
  const day = pad2(d.getDate());
  const month = new Intl.DateTimeFormat('en-AU', { month: 'short' }).format(d);
  const year = d.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

function EventDayColumnSkeleton() {
  return (
    <div className="flex min-w-[12rem] flex-1 flex-col items-center text-center">
      <div className="h-[38px] w-full animate-pulse rounded-sm bg-neutral-600" aria-hidden />
      <div className="bg-background-muted h-[52px] w-full animate-pulse" aria-hidden />
    </div>
  );
}

function EventDayColumn({ day }: { day: EventDay }) {
  const remainingTickets = day.ticketsAvailable - day.bookedTickets;

  return (
    <div className="flex min-w-[12rem] flex-1 flex-col items-center text-center">
      <div className="w-full bg-neutral-800 py-[10px] text-sm text-white">
        {formatEventDayDate(day.date)}
      </div>
      <div className="bg-background-muted text-foreground w-full py-3 text-xl font-bold">
        {remainingTickets}
      </div>
    </div>
  );
}

export function EventRegistration({ id }: EventRegistrationProps) {
  const event = getEventById(id);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    setIsDataReady(false);
    const timer = window.setTimeout(() => {
      setIsDataReady(true);
    }, EVENT_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [id]);

  if (!event) {
    return null;
  }

  return (
    <div className="mt-8">
      <div>
        <h2 className="text-center text-[30px] text-red-600">TICKETS REMAINING</h2>
      </div>
      <div
        className="mt-4 flex flex-row flex-wrap gap-4"
        aria-busy={!isDataReady}
        aria-live="polite"
      >
        {isDataReady
          ? event.eventDays.map((day) => <EventDayColumn key={day.date} day={day} />)
          : event.eventDays.map((day) => <EventDayColumnSkeleton key={`skeleton-${day.date}`} />)}
      </div>
    </div>
  );
}
