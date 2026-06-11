import nodemailer from 'nodemailer';
import { IEmailService } from '../interfaces';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error(
        '[EmailService] ❌ Missing credentials! Set EMAIL_USER and EMAIL_PASS in .env.local'
      );
    }
    if (user && !user.includes('@')) {
      console.error(
        `[EmailService] ❌ EMAIL_USER "${user}" is missing @domain.com — must be a full email address`
      );
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass || !user.includes('@')) {
      console.error(
        '[EmailService] ❌ Cannot send — invalid or missing credentials.',
        { user: user ?? 'NOT SET', passSet: !!pass }
      );
      return false;
    }

    try {
      console.log(`[EmailService] Sending email to: ${to}`);
      const info = await this.transporter.sendMail({
        from: `"Abhishek Bisht Portfolio" <${user}>`,
        to,
        subject,
        html,
      });
      console.log(`[EmailService] ✅ Email sent! MessageID: ${info.messageId}`);
      return true;
    } catch (error: any) {
      console.error('[EmailService] ❌ Failed to send email:', error.message);
      if (error.message?.includes('Invalid login') || error.message?.includes('Username and Password not accepted')) {
        console.error(
          '[EmailService] 💡 Gmail rejected your credentials. You MUST use a Google App Password, not your regular Gmail password.',
          '\n   Go to: myaccount.google.com → Security → 2-Step Verification → App Passwords'
        );
      }
      return false;
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();
