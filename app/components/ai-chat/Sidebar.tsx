'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AIMode, Message, UserConversation } from '@prisma/client';

interface SidebarProps {
  conversations: Array<UserConversation & { messages: Message[] }>;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => Promise<void>;
  onDeleteConversation: (id: string) => Promise<void>;
  onNewConversation: () => Promise<void>;
  onModeChange: (mode: AIMode) => void;
  currentMode: AIMode;
  className?: string;
}

export function Sidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onModeChange,
  currentMode,
  className
}: SidebarProps) {
  const [modeMenuOpen, setModeMenuOpen] = useState(false);

  const handleModeSelect = (mode: AIMode) => {
    onModeChange(mode);
    setModeMenuOpen(false);
  };

  return (
    <aside suppressHydrationWarning className={`${className} border-r border-muted-background/50 bg-background/50 backdrop-blur`}
      >
      <div className="flex flex-col h-full p-4 space-y-4">
        {/* New Chat Button */}
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-between px-4 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">New Chat</span>
          </div>
          <span className="ml-auto p-1 rounded hover:bg-primary/40" aria-hidden="true">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l3 3m0 0l3-3m-3 3V9m0 0h6m-6 0h6" />
            </svg>
          </span>
        </button>

        {/* Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setModeMenuOpen(!modeMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.902l-.707-.707M13 9.134l-.707.707m1.414 2.226l-.707.707M3 7.5h1M16 12h1m0 0H9m3.343-5.657l.707-.707m-2.828 9.902l.707-.707M9.663 7h4.673" />
              </svg>
              <span className="font-medium">Mode: {currentMode}</span>
            </div>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mode dropdown menu */}
            {modeMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-popover border border-popover/50 rounded-md shadow-lg z-20 py-1">
                {[AIMode.GENERAL, AIMode.PORTFOLIO, AIMode.CODING, AIMode.PROJECT_ADVISOR, AIMode.CAREER_MENTOR].map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleModeSelect(mode)}
                    className={`w-full text-left px-4 py-2 hover:bg-accent/20 ${mode === currentMode ? 'font-medium bg-accent/10' : ''}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`flex items-start space-x-3 rounded-border p-2 hover:bg-muted-background/50 transition-colors cursor-pointer ${conversation.id === selectedConversationId ? 'bg-muted-background/70' : ''}`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-1 font-medium text-foreground truncate">
                    {conversation.title || 'New Chat'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conversation.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  aria-label="Delete conversation"
                  title="Delete conversation"
                  className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Show placeholder if no conversations */}
            {conversations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations yet</p>
                <button
                  onClick={onNewConversation}
                  className="mt-2 px-3 py-1 bg-primary/20 hover:bg-primary/30 rounded text-xs"
                >
                  Start chatting
                </button>
              </div>
            )}
          </div>
        </div>
    </aside>
  );
}