'use client';

import { RefObject, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from '@prisma/client';
import { Markdown } from '@/app/components/ai-chat/Markdown';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  containerRef?: RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ messages, isLoading, containerRef }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localMessagesListRef = useRef<HTMLDivElement>(null);
  const messagesListRef = containerRef ?? localMessagesListRef;

  // Scroll to bottom when messages update
  useEffect(() => {
    const container = messagesListRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isLoading, messagesListRef]);

  return (
    <div
      ref={messagesListRef}
      className="h-full overflow-y-auto overscroll-contain p-5 pr-3 space-y-4
                 bg-white/10 dark:bg-slate-900/10 backdrop-blur"
    >
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                     w-full`}
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
              <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`${message.role === 'assistant' ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white' : 'bg-indigo-600 text-white'}
                             rounded-lg px-4 py-3 max-w-[min(42rem,80vw)] break-words
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

      {!isLoading && messages.length === 0 && (
        <div className="flex h-full min-h-[260px] items-center justify-center text-center text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground/80">Start the conversation</p>
            <p className="mt-2">Ask about Abhishek&apos;s work, projects, or experience.</p>
          </div>
        </div>
      )}

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
