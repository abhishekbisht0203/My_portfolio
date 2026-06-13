'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConversation } from '@/lib/ai/conversationHook';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInputBox } from './ChatInputBox';
import { Message } from '@prisma/client';

export function AiAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    conversations,
    selectedConversationId,
    messages,
    isLoading,
    error,
    createNewConversation,
    selectConversation,
    sendMessage
  } = useConversation();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-full"
        >
          <div ref={chatContainerRef} className="relative">
            {/* Glassmorphism container */}
            <div className="bg-white/20 dark:bg-slate-900/20 backdrop-blur-lg
                           border border-white/20 dark:border-slate-800/20
                           shadow-lg rounded-2xl overflow-hidden">
              <ChatHeader
                selectedConversationId={selectedConversationId}
                onNewChat={async () => {
                  const id = await createNewConversation('PORTFOLIO');
                  selectConversation(id);
                }}
              />
              <div className="flex-1 overflow-hidden">
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
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