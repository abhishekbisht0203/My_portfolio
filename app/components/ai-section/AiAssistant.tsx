'use client';

import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConversation } from '@/lib/ai/conversationHook';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInputBox } from './ChatInputBox';
import { Message } from '@prisma/client';

export function AiAssistant({ isOpen, anchorRef, onClose }: { isOpen: boolean, anchorRef?: React.RefObject<HTMLElement>, onClose?: () => void }) {
  const {
    selectedConversationId,
    messages,
    isLoading,
    error,
    createNewConversation,
    selectConversation,
    sendMessage
  } = useConversation();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [topOffset, setTopOffset] = useState<number | null>(null);

  // Initialize a new conversation when the component opens
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    (async () => {
      try {
        // Create/select a conversation when opening the section
        if (!selectedConversationId) {
          const id = await createNewConversation('PORTFOLIO'); // Use PORTFOLIO mode by default
          if (mounted) selectConversation(id);
        }
      } catch (err) {
        console.error('Failed to create conversation for AI section', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, selectedConversationId, createNewConversation, selectConversation]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Focus textarea when section opens
  useEffect(() => {
    if (isOpen) {
      // Wait for animation to complete before focusing
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll section into view when it opens
  useEffect(() => {
    if (isOpen) {
      // Wait for animation to complete before scrolling
      const timer = setTimeout(() => {
        chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Compute overlay position so it doesn't overlap the hero buttons
  useLayoutEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    try {
      const anchor = anchorRef.current as HTMLElement;
      const anchorRect = anchor.getBoundingClientRect();
      // Find the nearest positioned ancestor (the hero section)
      const container = anchor.closest('section') as HTMLElement | null;
      const containerRect = container ? container.getBoundingClientRect() : null;

      if (containerRect) {
        // top offset relative to the container
        const top = anchorRect.bottom - containerRect.top + 12; // 12px gap
        setTopOffset(Math.round(top));
      }
    } catch (err) {
      // ignore
    }
  }, [isOpen, anchorRef]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;
    await sendMessage(content, 'PORTFOLIO', false); // Using PORTFOLIO mode, no web search
  };

  if (error) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <h3 className="text-lg font-medium mb-4">Something went wrong</h3>
        <p className="mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute left-1/2 transform -translate-x-1/2 z-50 w-[min(900px,92%)] pointer-events-auto"
          style={{ top: topOffset !== null ? `${topOffset}px` : undefined, bottom: topOffset === null ? '7rem' : undefined }}
        >
          <div ref={chatContainerRef} className="relative">
            {/* Glassmorphism container */}
            <div className="flex h-[640px] max-h-[70vh] flex-col bg-white/20 dark:bg-slate-900/20 backdrop-blur-lg
                           border border-white/20 dark:border-slate-800/20
                           shadow-lg rounded-2xl overflow-hidden">
              <ChatHeader
                selectedConversationId={selectedConversationId}
                onNewChat={async () => {
                  const id = await createNewConversation('PORTFOLIO');
                  selectConversation(id);
                }}
                onClose={onClose}
              />
              <div className="min-h-0 flex-1 overflow-hidden">
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                  containerRef={messagesContainerRef}
                />
              </div>
              <ChatInputBox
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                textareaRef={textareaRef}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
