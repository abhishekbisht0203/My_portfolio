'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { appointmentSchema, AppointmentFormData } from '../../validators/appointment';
import DatePicker from './DatePicker';
import TimeSlotPicker from './TimeSlotPicker';

export default function AppointmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setServerError('');
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      setIsSuccess(true);
    } catch (error) {
      setServerError('An error occurred while booking. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-stone-800 p-8 md:p-12 rounded-2xl shadow-xl text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Meeting Request Sent Successfully
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Thank you! I have received your request for a meeting on{' '}
          <strong className="text-orange-500 dark:text-amber-400">{selectedDate}</strong> at{' '}
          <strong className="text-orange-500 dark:text-amber-400">{selectedTime}</strong>. 
          I will send a calendar invite shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-stone-700 dark:hover:bg-stone-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors"
        >
          Book Another Meeting
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-xl p-6 md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {serverError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                <input
                  {...register('fullName')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-stone-900 border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-stone-900 border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-gray-900 dark:text-white transition-colors"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company (Optional)</label>
              <input
                {...register('companyName')}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-stone-900 border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-gray-900 dark:text-white transition-colors"
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meeting Type *</label>
              <select
                {...register('meetingType')}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-stone-900 border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-gray-900 dark:text-white transition-colors"
              >
                <option value="">Select an option</option>
                <option value="Job Opportunity">Job Opportunity</option>
                <option value="Freelance Project">Freelance Project</option>
                <option value="Startup Collaboration">Startup Collaboration</option>
                <option value="Technical Discussion">Technical Discussion</option>
                <option value="Consultation Call">Consultation Call</option>
                <option value="Other">Other</option>
              </select>
              {errors.meetingType && <p className="text-red-500 text-sm mt-1">{errors.meetingType.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-stone-900 border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-gray-900 dark:text-white transition-colors resize-none"
                placeholder="Briefly describe what you'd like to discuss..."
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <input type="hidden" {...register('timezone')} />
          </div>

          {/* Right Column: Date & Time */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Date & Time</h3>
            
            <DatePicker
              selectedDate={selectedDate || ''}
              onSelectDate={(date) => setValue('date', date, { shouldValidate: true })}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1 -mt-6">{errors.date.message}</p>}

            <TimeSlotPicker
              selectedTime={selectedTime || ''}
              onSelectTime={(time) => setValue('time', time, { shouldValidate: true })}
            />
            {errors.time && <p className="text-red-500 text-sm mt-1 -mt-6">{errors.time.message}</p>}

            <div className="pt-6 border-t border-gray-100 dark:border-stone-700 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-500 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
