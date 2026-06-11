import { ISmsService } from '../interfaces';

export class SmsService implements ISmsService {
  async send(to: string, message: string): Promise<boolean> {
    // TODO: Implement Twilio or SNS integration
    console.log(`[SmsService] Sending to ${to}: ${message}`);
    return Promise.resolve(true);
  }
}

export const smsService = new SmsService();
