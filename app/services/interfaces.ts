// Interfaces for the service-based architecture

export interface INotificationPayload {
  to: string;
  subject?: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface INotificationService {
  sendEmail(payload: INotificationPayload): Promise<boolean>;
  sendSms(payload: INotificationPayload): Promise<boolean>;
  sendWhatsApp(payload: INotificationPayload): Promise<boolean>;
}

export interface IEmailService {
  send(to: string, subject: string, html: string): Promise<boolean>;
}

export interface ISmsService {
  send(to: string, message: string): Promise<boolean>;
}

export interface IWhatsAppService {
  send(to: string, message: string): Promise<boolean>;
}

export interface ICalendarEventPayload {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  timezone: string;
}

export interface ICalendarService {
  createEvent(payload: ICalendarEventPayload): Promise<string | null>;
  cancelEvent(eventId: string): Promise<boolean>;
}

export interface IMeetingProvider {
  createMeeting(topic: string, startTime: Date, durationMinutes: number): Promise<string | null>;
}
