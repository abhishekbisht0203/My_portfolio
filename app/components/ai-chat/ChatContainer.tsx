'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { useConversation } from '@/lib/ai/conversationHook';
import { AIMode } from '@prisma/client';

export function ChatContainer() {
  const {
    conversations,
    selectedConversationId,
    messages,
    isLoading,
    error,
    createNewConversation,
    selectConversation,
    updateConversationTitle,
    deleteConversation,
    sendMessage
  } = useConversation();

  const [aiMode, setAiMode] = useState<AIMode>(AIMode.GENERAL);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle new conversation
  const handleNewChat = useCallback(async () => {
    const conversationId = await createNewConversation(aiMode);
    selectConversation(conversationId);
    // Reset input focus will happen automatically
  }, [aiMode, createNewConversation, selectConversation]);

  // Handle AI mode change
  const handleModeChange = useCallback((mode: AIMode) => {
    setAiMode(mode);
    // Optionally create new conversation when mode changes
    handleNewChat();
  }, [handleNewChat]);

  // Handle sidebar toggle (for mobile)
  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      {!(() => {
        if (typeof window !== 'undefined') {
          return window.innerWidth < 768;
        }
        return false;
      })() && !isSidebarOpen ? null : (
        <Sidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={async (id) => selectConversation(id)}
          onDeleteConversation={deleteConversation}
          onNewConversation={handleNewChat}
          onModeChange={handleModeChange}
          currentMode={aiMode}
          className={`flex-shrink-0 w-64 lg:block ${!isSidebarOpen && 'hidden'} transition-transform duration-300`}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex h-14 items-center justify-between px-4 bg-primary/90 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSidebarToggle}
              className="lg:hidden p-2 rounded hover:bg-primary/80"
              aria-label="Toggle sidebar"
            >
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-white/80">
            <span>Mode: {aiMode}</span>
            {/* Add mode indicator dots */}
            <div className="flex space-x-1">
              {[AIMode.GENERAL, AIMode.PORTFOLIO, AIMode.CODING, AIMode.PROJECT_ADVISOR, AIMode.CAREER_MENTOR].map(mode => (
                <div
                  key={mode}
                  className={`h-2 w-2 rounded-full ${mode === aiMode ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/80">Web Search</span>
            <button
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              aria-label="Toggle web search"
              aria-pressed={webSearchEnabled ? 'true' : 'false'}
              title="Toggle web search"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${webSearchEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${webSearchEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-background">
          <ChatWindow
            ref={chatWindowRef}
            messages={messages}
            isLoading={isLoading}
          />
        </div>

        <ChatInput
          onSendMessage={(content) => sendMessage(content, aiMode, webSearchEnabled)}
          isLoading={isLoading}
          placeholder="Ask me anything about my portfolio, projects, experience, or get coding help..."
        />
      </div>
    </div>
  );
}