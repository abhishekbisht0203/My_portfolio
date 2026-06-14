'use client';

import { motion } from 'framer-motion';

export function OnlineIndicator() {
  return (
    <motion.span
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="relative inline-flex items-center"
    >
      {/* Pulsing dot implemented with a span so it renders in HTML */}
      <motion.span
        className="block w-2 h-2 rounded-full bg-green-400"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 1.6,
          ease: 'easeInOut'
        }}
      />

      {/* Tooltip */}
      <motion.span
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: -5 }}
        exit={{ opacity: 0, y: -5 }}
        className="absolute left-1/2 bottom-full mb-1 -translate-x-1/2
                   px-2 py-1 text-xs bg-gray-800 dark:bg-gray-200
                   rounded text-white dark:text-gray-900 whitespace-nowrap"
      >
        Online
      </motion.span>
    </motion.span>
  );
}