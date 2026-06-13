"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@/lib/ai/conversationHook';
import { ChatInput } from './ai-chat/ChatInput';
import { X, Maximize2, Sun, Moon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenFull?: () => void;
}

export default function HeroChatDropdown({ isOpen, onClose, onOpenFull }: Props) {
  const { conversations, selectedConversationId, messages, createNewConversation, selectConversation, sendMessage, isLoading } = useConversation();
  const listRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    (async () => {
      try {
        // Create/select a lightweight conversation when opening the dropdown
        const id = await createNewConversation();
        if (mounted) selectConversation(id);
      } catch (err) {
        // ignore for now
        console.error('Failed to create conversation for hero dropdown', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, createNewConversation, selectConversation]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [isOpen, onClose]);

  // Theme handling
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          suppressHydrationWarning
          className="absolute left-1/2 top-full mt-4 -translate-x-1/2 w-[min(95vw,720px)] max-h-[60vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden z-[9999]"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
              </motion.div>
              <div>
                <div className="font-semibold">AI Assistant</div>
                <div className="text-xs opacity-80">Get help about projects, code, and more</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleTheme} title="Toggle theme" className="p-2 rounded-md hover:bg-white/10">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => {
                  if (onOpenFull) onOpenFull();
                }}
                title="Open full chat"
                className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm"
              >
                <div className="flex items-center gap-2"><Maximize2 size={14}/> Full</div>
              </button>
              <button onClick={onClose} aria-label="Close dropdown" title="Close" className="p-2 rounded-md hover:bg-white/10">
                <X size={16} />
              </button>
            </div>
          </div>

          <div ref={listRef} className="p-3 overflow-y-auto space-y-3 max-h-[42vh] bg-gradient-to-b from-white/50 to-transparent dark:from-slate-900/50">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-6">Start the conversation — ask me something about my work.</div>
            )}
            <div className="space-y-2">
              {messages.map((m, idx) => {
                const time = (() => {
                  try {
                    const d = new Date(m.createdAt as any);
                    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  } catch {
                    return '';
                  }
                })();

                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.18 }}
                    className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex items-end ${m.role === 'assistant' ? '' : 'flex-row-reverse'} gap-3`}> 
                      {m.role === 'assistant' ? (
                        <div className="w-8 h-8 rounded-full avatar-gradient text-white flex items-center justify-center text-[11px] font-semibold">AI</div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-semibold">You</div>
                      )}

                      <div className="flex flex-col">
                        <div className={`${m.role === 'assistant' ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : 'bg-indigo-600 text-white'} rounded-lg px-3 py-2 max-w-[80%] break-words`}>{m.content}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="w-8 h-8 rounded-full avatar-gradient text-white flex items-center justify-center text-[11px] font-semibold mr-3">AI</div>
                  <div className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-3 py-2">
                    <div className="typing-indicator">
                      <span className="dot bg-white dark:bg-white/90" />
                      <span className="dot bg-white/80 dark:bg-white/70" />
                      <span className="dot bg-white/60 dark:bg-white/50" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <ChatInput
            onSendMessage={(content) => sendMessage(content, 'GENERAL', false)}
            isLoading={isLoading}
            placeholder="Ask about my projects, experience, or get help..."
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
