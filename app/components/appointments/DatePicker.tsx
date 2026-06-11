'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Date</h3>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-800 border-2 border-gray-200 dark:border-stone-700 rounded-xl focus:ring-0 focus:border-orange-500 dark:focus:border-orange-500 text-gray-900 dark:text-white appearance-none cursor-pointer transition-colors"
        />
      </div>
    </div>
  );
}
