'use client';

import { motion, useCycle } from 'framer-motion';

export function OnlineIndicator() {
  const [isPulsing, setIsPulsing] = useCycle(false, true);

  // Start pulsing animation on mount
  // Using useEffect to set up interval
  // Actually, let's use CSS animation for simplicity

  return (
    <motion.span
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-2 h-2"
    >
      {/* Pulsing dot */}
      <motion.circle
        cx="1"
        cy="1"
        r="1"
        className="bg-green-400"
        animate={isPulsing ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 2,
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