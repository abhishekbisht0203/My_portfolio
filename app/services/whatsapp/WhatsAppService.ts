import { IWhatsAppService } from '../interfaces';

export class WhatsAppService implements IWhatsAppService {
  private isConfigured(): boolean {
    return !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM
    );
  }

  async send(to: string, message: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn(
        '[WhatsAppService] ⚠️ Twilio not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM to .env.local'
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
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${to}`,
        body: message,
      });

      console.log(`[WhatsAppService] ✅ Sent! SID: ${result.sid}`);
      return true;
    } catch (error: any) {
      console.error('[WhatsAppService] ❌ Failed:', error.message);
      return false;
    }
  }
}

export const whatsAppService = new WhatsAppService();
