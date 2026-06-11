import { IMeetingProvider } from '../interfaces';

export class MeetingProviderService implements IMeetingProvider {
  async createMeeting(topic: string, startTime: Date, durationMinutes: number): Promise<string | null> {
    // TODO: Depending on user preference or settings, route to Zoom, Google Meet, etc.
    console.log(`[MeetingProviderService] Creating meeting: ${topic} at ${startTime}`);
    return Promise.resolve('https://meet.google.com/mock-link');
  }
}

export const meetingProviderService = new MeetingProviderService();
