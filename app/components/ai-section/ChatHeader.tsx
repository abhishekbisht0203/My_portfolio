'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { OnlineIndicator } from './OnlineIndicator';

interface ChatHeaderProps {
  selectedConversationId: string | null;
  onNewChat: () => Promise<void>;
  onClose?: () => void;
}

export function ChatHeader({ selectedConversationId, onNewChat, onClose }: ChatHeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const pref = localStorage.getItem('site-theme');
      const initialDark = pref ? pref === 'dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(Boolean(initialDark));
      if (initialDark) document.documentElement.classList.add('theme-dark');
      else document.documentElement.classList.remove('theme-dark');
    } catch (e) {
      // ignore
    }
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    try {
      if (next) {
        document.documentElement.classList.add('theme-dark');
        localStorage.setItem('site-theme', 'dark');
      } else {
        document.documentElement.classList.remove('theme-dark');
        localStorage.setItem('site-theme', 'light');
      }
    } catch (e) {
      // ignore
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      className="flex items-center justify-between px-5 py-4
                 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur
                 border-b border-white/20 dark:border-slate-800/20"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-10 h-10 rounded-full avatar-gradient flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-2.21 0-4 1.79-4 4 0 .52.06 1.04.18 1.53A5.988 5.988 0 0013.5 21h3a5.988 5.988 0 002.32-.47A8.017 8.017 0 0020 16c0-2.21-1.79-4-4-4V8zm0 14a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </motion.div>
        <div>
          <div className="font-semibold text-foreground">Abhishek AI Assistant</div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <OnlineIndicator />
            <span>{selectedConversationId ? 'Chat opened' : 'New chat'}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="p-2 rounded hover:bg-white/10 dark:hover:bg-slate-900/20 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={onNewChat}
          title="New chat"
          className="p-2 rounded hover:bg-white/10 dark:hover:bg-slate-900/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            title="Close chat"
            aria-label="Close chat"
            className="p-2 rounded hover:bg-white/10 dark:hover:bg-slate-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}