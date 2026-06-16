'use client';

import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConversation } from '@/lib/ai/conversationHook';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInputBox } from './ChatInputBox';
import { Message } from '@prisma/client';

export function AiAssistant({ isOpen, anchorRef, onClose }: { isOpen: boolean, anchorRef?: React.RefObject<HTMLElement | null>, onClose?: () => void }) {
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
  const [maxHeight, setMaxHeight] = useState<string>('900px');

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

  // NOTE: intentionally no scrollIntoView here — the hero section should not
  // re-position itself when the chat opens. The chat overlays in-place.

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
        // Keep the chat visible within the viewport, even when the page is scrolled
        const desiredTop = anchorRect.bottom - containerRect.top + 12; // 12px gap
        const targetHeight = Math.min(900, Math.max(560, window.innerHeight - 96));
        const minTop = 48;
        const maxTop = Math.max(minTop, window.innerHeight - targetHeight - 48);
        const top = Math.max(minTop, Math.min(desiredTop, maxTop));
        setTopOffset(Math.round(top));
        setMaxHeight(`${targetHeight}px`);
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
          className="fixed left-1/2 transform -translate-x-1/2 z-[9999] w-[min(1100px,96%)] pointer-events-auto"
          style={{ top: topOffset !== null ? `${topOffset}px` : '50%' }}
        >
          <div ref={chatContainerRef} className="relative">
            {/* Glassmorphism container */}
            <div className="flex flex-col bg-white/20 dark:bg-slate-900/20 backdrop-blur-lg
                           border border-white/20 dark:border-slate-800/20
                           shadow-lg rounded-2xl"
                 style={{ height: maxHeight, maxHeight, overflowY: 'auto' }}>
              <ChatHeader
                selectedConversationId={selectedConversationId}
                onNewChat={async () => {
                  const id = await createNewConversation('PORTFOLIO');
                  selectConversation(id);
                }}
                onClose={onClose}
              />
              <div className="min-h-0 flex-1">
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