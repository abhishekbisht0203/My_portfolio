import { ICalendarService, ICalendarEventPayload } from '../interfaces';

export class CalendarService implements ICalendarService {
  async createEvent(payload: ICalendarEventPayload): Promise<string | null> {
    // TODO: Implement Google Calendar API or Cal.com integration
    console.log('[CalendarService] Creating event:', payload.title);
    return Promise.resolve('mock-event-id');
  }

  async cancelEvent(eventId: string): Promise<boolean> {
    // TODO: Cancel event
    console.log(`[CalendarService] Cancelling event ${eventId}`);
    return Promise.resolve(true);
  }
}

export const calendarService = new CalendarService();
