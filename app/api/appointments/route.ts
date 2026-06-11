import { NextResponse } from 'next/server';
import { appointmentSchema } from '../../validators/appointment';
import { notificationService } from '../../services/notifications/NotificationService';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the incoming data
    const validatedData = appointmentSchema.parse(body);

    // Try to save to Database — but don't fail the whole request if DB is unavailable
    let appointmentId: string | null = null;
    try {
      // Dynamic import so a DB connection error doesn't crash the module at startup
      const { prisma } = await import('../../../lib/prisma');
      const appointment = await prisma.appointment.create({
        data: {
          name: validatedData.fullName,
          email: validatedData.email,
          phone: null,
          company: validatedData.companyName || null,
          purpose: validatedData.meetingType,
          message: validatedData.message,
          preferredDate: validatedData.date,
          preferredTime: validatedData.time,
          timezone: validatedData.timezone,
          status: 'PENDING',
          meetingProvider: 'MANUAL',
        },
      });
      appointmentId = appointment.id;
    } catch (dbError) {
      console.warn('[Appointments API] Database not available — proceeding without DB save:', (dbError as Error).message);
    }

    // Build HTML email
    const htmlMessage = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f97316, #fbbf24); padding: 30px 24px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">📅 New Meeting Request</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">From your portfolio booking system</p>
        </div>
        <div style="padding: 28px 24px; background: #fff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${validatedData.fullName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; color: #111827;">${validatedData.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Company</td><td style="padding: 8px 0; color: #111827;">${validatedData.companyName || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Meeting Type</td><td style="padding: 8px 0; color: #111827;"><span style="background:#fff7ed;color:#c2410c;padding:2px 10px;border-radius:999px;font-size:13px;">${validatedData.meetingType}</span></td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Date</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${validatedData.date}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Time</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${validatedData.time}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Timezone</td><td style="padding: 8px 0; color: #111827;">${validatedData.timezone}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #f97316;">
            <p style="margin: 0 0 6px; font-weight: 600; color: #374151;">Message:</p>
            <p style="margin: 0; color: #4b5563; line-height: 1.6;">${validatedData.message}</p>
          </div>
          ${appointmentId ? `<p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">Appointment ID: ${appointmentId}</p>` : ''}
        </div>
      </div>
    `;

    // Send email — primary notification
    const emailSent = await notificationService.sendEmail({
      to: 'abhishekbisht0203@gmail.com',
      subject: `📅 Meeting Request: ${validatedData.meetingType} — ${validatedData.fullName}`,
      message: htmlMessage,
    });

    if (!emailSent) {
      console.warn('[Appointments API] Email notification failed to send.');
    }

    // Send WhatsApp notification (requires Twilio setup in .env.local)
    const whatsappMessage =
      `📅 *New Meeting Request*\n\n` +
      `👤 *Name:* ${validatedData.fullName}\n` +
      `📧 *Email:* ${validatedData.email}\n` +
      `🏢 *Company:* ${validatedData.companyName || 'N/A'}\n` +
      `🎯 *Type:* ${validatedData.meetingType}\n` +
      `📆 *Date:* ${validatedData.date}\n` +
      `⏰ *Time:* ${validatedData.time} (${validatedData.timezone})\n\n` +
      `💬 *Message:* ${validatedData.message}`;

    await notificationService.sendWhatsApp({
      to: process.env.ADMIN_WHATSAPP_NUMBER || '',
      message: whatsappMessage,
    });

    return NextResponse.json(
      {
        message: 'Appointment request sent successfully!',
        appointmentId: appointmentId ?? undefined,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Appointment Booking Error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Validation Error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
