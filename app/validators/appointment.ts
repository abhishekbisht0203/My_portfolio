import { z } from 'zod';

export const appointmentSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().optional(),
  meetingType: z.enum([
    'Job Opportunity',
    'Freelance Project',
    'Startup Collaboration',
    'Technical Discussion',
    'Consultation Call',
    'Other'
  ], {
    message: 'Please select a meeting type'
  }),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  timezone: z.string().min(1, 'Timezone is required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
