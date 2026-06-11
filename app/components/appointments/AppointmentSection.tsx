'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Briefcase, Code, Rocket, MessagesSquare } from 'lucide-react';
import AppointmentForm from './AppointmentForm';

const meetingTypes = [
  { icon: Briefcase, label: 'Full-Time Roles' },
  { icon: Code, label: 'Freelance Projects' },
  { icon: Rocket, label: 'Startup Collaboration' },
  { icon: MessagesSquare, label: 'Technical Consulting' },
];

export default function AppointmentSection() {
  return (
    <section id="book-meeting" className="py-24 bg-amber-50 dark:bg-stone-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-300 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full font-semibold mb-6">
              <CalendarDays className="w-5 h-5" />
              <span>Available for Hire</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Book a Meeting
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              Let's discuss your project, opportunity, or collaboration. Pick a time that works for you, and we'll dive right in.
            </p>

            {/* Availability Badges */}
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {meetingTypes.map((type, index) => (
                <motion.div
                  key={type.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-2 bg-white dark:bg-stone-800 shadow-sm border border-gray-100 dark:border-stone-700 px-4 py-2 rounded-lg"
                >
                  <type.icon className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {type.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <AppointmentForm />
        </motion.div>
      </div>
    </section>
  );
}
