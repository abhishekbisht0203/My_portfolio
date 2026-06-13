'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { Markdown } from '@/app/components/ai-chat/Markdown';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Animate list entrance
  useEffect(() => {
    if (messagesListRef.current) {
      // Trigger reflow for animation
      messagesListRef.current.style.opacity = '0';
      void messagesListRef.current.offsetWidth; // Trigger reflow
      messagesListRef.current.style.opacity = '1';
    }
  }, [messages.length]);

  return (
    <div
      ref={messagesListRef}
      className="flex-1 overflow-y-auto p-5 space-y-4
                 bg-white/10 dark:bg-slate-900/10 backdrop-blur"
    >
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                     max-w-[85%] opacity-0`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end ${message.role === 'assistant' ? '' : 'flex-row-reverse'} gap-3`}>
              {message.role === 'assistant' ? (
                <div className="w-8 h-8 rounded-full avatar-gradient text-white flex items-center justify-center text-[11px] font-semibold">
                  AI
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-semibold">
                  You
                </div>
              )}
              <div className="flex flex-col">
                <div className={`${message.role === 'assistant' ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : 'bg-indigo-600 text-white'}
                             rounded-lg px-4 py-3 max-w-[80%] break-words
                             backdrop-blur-sm bg-white/20 dark:bg-slate-900/20
                             border border-white/20 dark:border-slate-800/20`}>
                  <Markdown content={message.content} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ))}

      {/* Loading indicator at the bottom when waiting for response */}
      {isLoading && messages.length > 0 && (
        <div ref={messagesEndRef} className="flex items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-full avatar-gradient text-white flex items-center justify-center text-[11px] font-semibold">
              AI
            </div>
            <div className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white
                     rounded-lg px-4 py-3 max-w-[80%] backdrop-blur-sm
                     bg-white/20 dark:bg-slate-900/20 border border-white/20 dark:border-slate-800/20">
              <div className="typing-indicator">
                <span className="dot bg-white dark:bg-white/90" />
                <span className="dot bg-white/80 dark:bg-white/70" />
                <span className="dot bg-white/60 dark:bg-white/50" />
              </div>
              <span className="ml-2 text-xs text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}