import { INotificationService, INotificationPayload } from '../interfaces';
import { emailService } from '../email/EmailService';
import { smsService } from '../sms/SmsService';
import { whatsAppService } from '../whatsapp/WhatsAppService';

export class NotificationService implements INotificationService {
  async sendEmail(payload: INotificationPayload): Promise<boolean> {
    return emailService.send(payload.to, payload.subject || 'Notification', payload.message);
  }

  async sendSms(payload: INotificationPayload): Promise<boolean> {
    return smsService.send(payload.to, payload.message);
  }

  async sendWhatsApp(payload: INotificationPayload): Promise<boolean> {
    return whatsAppService.send(payload.to, payload.message);
  }

  // Future method: Send to all preferred channels
  async notifyAll(payload: INotificationPayload, channels: ('email' | 'sms' | 'whatsapp')[]): Promise<void> {
    const promises = channels.map(channel => {
      if (channel === 'email') return this.sendEmail(payload);
      if (channel === 'sms') return this.sendSms(payload);
      if (channel === 'whatsapp') return this.sendWhatsApp(payload);
      return Promise.resolve(false);
    });
    
    await Promise.all(promises);
  }
}

export const notificationService = new NotificationService();
