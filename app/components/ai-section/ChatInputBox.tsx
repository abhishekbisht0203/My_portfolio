'use client';

import React, { useState, useCallback, useEffect } from 'react';

interface ChatInputBoxProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement> | null;
  placeholder?: string;
}

export function ChatInputBox({ onSendMessage, isLoading, textareaRef, placeholder = 'Ask about Abhishek...' }: ChatInputBoxProps) {
  const [inputValue, setInputValue] = useState('');

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
        console.error('Failed to send message:', error);
        // In a production app, you might want to show a toast notification
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

  // Focus textarea when it receives the ref
  useEffect(() => {
    if (textareaRef.current && !isLoading) {
      textareaRef.current.focus();
    }
  }, [textareaRef, isLoading]);

  return (
    <form suppressHydrationWarning onSubmit={handleSubmit} className="flex flex-col space-y-3 p-5
                                                                     bg-white/20 dark:bg-slate-900/20 backdrop-blur
                                                                     border-t border-white/20 dark:border-slate-800/20">
      <div className="flex items-center space-x-3">
        {/* Attachment button (placeholder for future file upload) */}
        <button
          type="button"
          onClick={() => {/* TODO: Implement file upload */}}
          className="p-2 rounded hover:bg-white/10 dark:hover:bg-slate-900/20 transition-colors"
          aria-label="Attach files"
        >
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 min-h-[12px] resize-none rounded-border px-4 py-3
                   bg-white/30 dark:bg-slate-900/30 backdrop-blur
                   text-foreground/90 placeholder:text-muted-foreground/50
                   focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0
                   border border-white/20 dark:border-slate-800/20
                   transition-all duration-200"
          rows={1}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={`mt-2 px-5 py-3 rounded-lg
                   ${!inputValue.trim() || isLoading
                     ? 'bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20'
                     : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:bg-gradient-to-r from-indigo-600 to-purple-600'}
                   transition-all duration-200`}
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l4 4"/>
              </svg>
            </>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5l7 7-7 7"/>
            </svg>
          )}
          <span className="ml-3">{isLoading ? 'Sending...' : 'Send'}</span>
        </button>
      </div>

      {/* Suggested prompts */}
      {!inputValue && !isLoading && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setInputValue('Tell me about Abhishek')}
            className="px-4 py-2 rounded-lg text-sm font-medium
                     bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20
                     border border-white/20 dark:border-slate-800/20
                     transition-all duration-200"
          >
            About me
          </button>
          <button
            type="button"
            onClick={() => setInputValue('What projects has Abhishek built?')}
            className="px-4 py-2 rounded-lg text-sm font-medium
                     bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20
                     border border-white/20 dark:border-slate-800/20
                     transition-all duration-200"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setInputValue('What technologies does Abhishek use?')}
            className="px-4 py-2 rounded-lg text-sm font-medium
                     bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20
                     border border-white/20 dark:border-slate-800/20
                     transition-all duration-200"
          >
            Technologies
          </button>
          <button
            type="button"
            onClick={() => setInputValue('Can Abhishek help with full stack development?')}
            className="px-4 py-2 rounded-lg text-sm font-medium
                     bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20
                     border border-white/20 dark:border-slate-800/20
                     transition-all duration-200"
          >
            Full Stack
          </button>
          <button
            type="button"
            onClick={() => setInputValue('Show experience')}
            className="px-4 py-2 rounded-lg text-sm font-medium
                     bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:bg-slate-900/20
                     border border-white/20 dark:border-slate-800/20
                     transition-all duration-200"
          >
            Experience
          </button>
          <button
            type="button"
            onClick={() => setInputValue('Show skills')}
            className="px-4 py-2 rounded-lg text-sm font-medium
                     bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:bg-slate-900/20
                     border border-white/20 dark:border-slate-800/20
                     transition-all duration-200"
          >
            Skills
          </button>
          <button
            type="button"
            onClick={() => setInputValue('Contact Abhishek')}
            className="px-4 py-2 rounded-lg text-sm font-medium
                     bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:bg-slate-900/20
                     border border-white/20 dark:border-slate-800/20
                     transition-all duration-200"
          >
            Contact
          </button>
        </div>
      )}
    </form>
  );
}
