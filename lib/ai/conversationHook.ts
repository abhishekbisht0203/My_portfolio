'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, UserConversation, AIMode } from '@prisma/client';
import { 
  getConversations, 
  createConversation, 
  updateConversationTitleAction, 
  deleteConversationAction,
  getConversation
} from '@/app/actions/ai-actions';

export function useConversation() {
  const [conversations, setConversations] = useState<(UserConversation & { messages: Message[] })[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation selection changes
  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId]);

  const loadConversations = useCallback(async () => {
    try {
      const convs = await getConversations();
      setConversations(convs);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const conv = await getConversation(conversationId);
      if (conv) {
        setMessages(conv.messages);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const createNewConversation = useCallback(async (mode: AIMode = 'GENERAL') => {
    try {
      const conversation = await createConversation(mode);
      setConversations(prev => [{ ...conversation, messages: [] }, ...prev]);
      return conversation.id;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
  }, []);

  const updateConversationTitle = useCallback(async (conversationId: string, title: string) => {
    try {
      const updated = await updateConversationTitleAction(conversationId, title);
      setConversations(prev =>
        prev.map(c => c.id === conversationId ? { ...c, title: updated.title } : c)
      );
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversationAction(conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
        setMessages([]);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [selectedConversationId]);

  const sendMessage = useCallback(async (content: string, aiMode: string = 'GENERAL', webSearchEnabled: boolean = false) => {
    if (!selectedConversationId) return;

    setIsLoading(true);
    setError(null);

    // Optimistic user message
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversationId,
      role: 'user',
      content,
      aiMode: aiMode as AIMode,
      aiProvider: 'OPENAI',
      tokensUsed: 0,
      createdAt: new Date(),
    };

    const tempAssistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      conversationId: selectedConversationId,
      role: 'assistant',
      content: '',
      aiMode: aiMode as AIMode,
      aiProvider: 'OPENAI',
      tokensUsed: 0,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, tempUserMsg, tempAssistantMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversationId, content, aiMode, webSearchEnabled }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      if (!res.body) {
        throw new Error('Readable stream not supported');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullAssistantMessage = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullAssistantMessage += chunk;

        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          if (newMessages[lastIndex].role === 'assistant') {
            newMessages[lastIndex] = { ...newMessages[lastIndex], content: fullAssistantMessage };
          }
          return newMessages;
        });
      }

      // Title generation for "New Chat"
      const conv = conversations.find(c => c.id === selectedConversationId);
      if (conv && conv.title === "New Chat" && fullAssistantMessage) {
        const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
        await updateConversationTitle(selectedConversationId, title);
      }

    } catch (err) {
      setError(err as Error);
      // Rollback messages
      setMessages(prev => prev.slice(0, -2));
    } finally {
      setIsLoading(false);
      // Reload actual messages to get real IDs and sync state
      await loadMessages(selectedConversationId);
    }
  }, [selectedConversationId, conversations, updateConversationTitle, loadMessages]);

  return {
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
  };
}