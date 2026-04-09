import raw from './eventsData.json';

export interface EventDay {
  date: string;
  ticketsAvailable: number;
  bookedTickets: number;
  vehiclesPerTrip: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  eventStatus: string;
  costPerVehicle: number;
  eventStartDate: string;
  eventDays: EventDay[];
  location: string;
  bookingLink: string;
}

export interface EventsPayload {
  events: Event[];
}

const payload: EventsPayload = raw;

/**
 * Returns every event from the static events dataset.
 */
export function getAllEvents(): Event[] {
  return payload.events;
}

/**
 * Returns the event with the given id, or undefined if none match.
 */
export function getEventById(id: number): Event | undefined {
  return payload.events.find((event) => event.id === id);
}
