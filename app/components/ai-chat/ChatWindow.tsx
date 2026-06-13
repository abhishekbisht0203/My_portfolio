'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { Markdown } from './Markdown';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
}

export function ChatWindow({ messages, isLoading, ref }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div suppressHydrationWarning className="flex-1 overflow-y-auto space-y-4 p-4" ref={ref}>
      {messages.map((message, index) => (
        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} max-w-[85%}`}>
          <div className={`rounded-xl px-4 py-2 ${
            message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted-background text-foreground'
          }`}>
            {message.role === 'assistant' && isLoading && index === messages.length - 1 ? (
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground"></div>
                <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground"></div>
                <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground"></div>
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
            <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground"></div>
            <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground"></div>
            <div className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground"></div>
            <span className="text-xs text-muted-foreground">AI is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
}