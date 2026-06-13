'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useConversation } from '@/lib/ai/conversationHook';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, isLoading, placeholder = 'Type a message...' }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = useConversation();

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!inputValue.trim() || isLoading) return;

      const message = inputValue.trim();
      setInputValue('');


      // Send to AI
      try {
        await onSendMessage(message);
      } catch (error) {
        // Handle error - in a real app, you might want to show a notification
        console.error('Failed to send message:', error);
      }
    },
    [inputValue, isLoading, onSendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="flex flex-col space-y-2 p-4 bg-muted-background/50 border-t border-muted-background/50">
      <div className="flex items-center space-x-3">
        {/* Attachment button (placeholder for future file upload) */}
        <button
          onClick={() => {/* TODO: Implement file upload */}}
          className="p-2 rounded hover:bg-muted-foreground/10"
          aria-label="Attach files"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 min-h-[44px] resize-none rounded-border px-3 py-2 bg-muted-background/50 text-foreground/90 placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary focus:ring-offset-0"
          rows={1}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={`px-4 py-2 rounded-border ${
            !inputValue.trim() || isLoading
              ? 'bg-muted-foreground/10 hover:bg-muted-foreground/20'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          } transition-colors`}
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l4 4" />
              </svg>
            </>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5l7 7-7 7" />
                </svg>
          )}
          <span className="ml-2">{isLoading ? 'Sending...' : 'Send'}</span>
        </button>
      </div>

      {/* Suggested prompts */}
      {!inputValue && !isLoading && (
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <button
            onClick={() => setInputValue('Tell me about Abhishek Bisht')}
            className="px-2 py-1 rounded-border bg-muted-background/50 hover:bg-muted-background/70"
          >
            About me
          </button>
          <button
            onClick={() => setInputValue('What projects have you built?')}
            className="px-2 py-1 rounded-border bg-muted-background/50 hover:bg-muted-background/70"
          >
            Projects
          </button>
          <button
            onClick={() => setInputValue('Help me write a React component')}
            className="px-2 py-1 rounded-border bg-muted-background/50 hover:bg-muted-background/70"
          >
            Coding help
          </button>
          <button
            onClick={() => setInputValue('What career advice do you have for developers?')}
            className="px-2 py-1 rounded-border bg-muted-background/50 hover:bg-muted-background/70"
          >
            Career advice
          </button>
        </div>
      )}
    </form>
  );
}