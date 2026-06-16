// Updated ChatWindow component with forwardRef to avoid prop name conflict and hydration issues
'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { Markdown } from './Markdown';

// Props no longer include a "ref" field; ref is forwarded via React.forwardRef
interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
  ({ messages, isLoading }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll the latest message into view when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
      <div
        suppressHydrationWarning
        className="flex-1 overflow-y-auto space-y-4 p-4"
        ref={ref}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} max-w-[85%]`}
          >
            <div
              className={`rounded-xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted-background text-foreground'
              }`}
            >
              {message.role === 'assistant' && isLoading && index === messages.length - 1 ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
                  <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
                  <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              ) : (
                <Markdown content={message.content} />
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator at the bottom when waiting for response */}
        {isLoading && messages.length > 0 && (
          <div ref={messagesEndRef} className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';
