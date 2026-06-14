import { ISmsService } from '../interfaces';

export class SmsService implements ISmsService {
  private isConfigured(): boolean {
    return !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM
    );
  }

  async send(to: string, message: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn(
        '[SmsService] ⚠️ Twilio not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM to .env.local'
      );
      return false;
    }

    try {
      // Dynamic import to avoid module-level errors when Twilio isn't installed
      const twilio = (await import('twilio')).default;
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );

      const result = await client.messages.create({
        from: process.env.TWILIO_FROM!,
        to,
        body: message,
      });

      console.log(`[SmsService] ✅ Sent! SID: ${result.sid}`);
      return true;
    } catch (error: any) {
      console.error('[SmsService] ❌ Failed:', error.message);
      return false;
    }
  }
}

export const smsService = new SmsService();