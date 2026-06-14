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
      } else {
        setMessages([]);
      }
    } catch (err) {
      setError(err as Error);
      setMessages([]);
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
    if (!selectedConversationId) {
      setError(new Error('No conversation selected'));
      return;
    }

    setIsLoading(true);
    setError(null);

    // Optimistic user message
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversationId,
      role: 'user',
      content,
      aiMode: aiMode as AIMode,
      aiProvider: 'OPENAI', // Will be updated with actual provider later
      tokensUsed: 0,
      createdAt: new Date(),
    };

    // Optimistic assistant message (empty initially)
    const tempAssistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      conversationId: selectedConversationId,
      role: 'assistant',
      content: '',
      aiMode: aiMode as AIMode,
      aiProvider: 'OPENAI', // Will be updated with actual provider later
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
        throw new Error(`Failed to send message: ${res.status} ${res.statusText}`);
      }

      if (!res.body) {
        throw new Error('Readable stream not supported');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullAssistantMessage = '';

      // Process the stream
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullAssistantMessage += chunk;

          // Update the assistant message in state
          setMessages(prev => {
            // Find the last assistant message (our optimistic one)
            const lastIndex = prev.length - 1;
            if (lastIndex >= 0 && prev[lastIndex].role === 'assistant' && prev[lastIndex].id === tempAssistantMsg.id) {
              // Create a new array with the updated message
              const newMessages = [...prev];
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                content: fullAssistantMessage
              };
              return newMessages;
            }
            // Fallback: if we can't find our optimistic message, just return prev
            return prev;
          });
        }
      } finally {
        reader.releaseLock();
      }

      // Title generation for "New Chat"
      try {
        const conv = conversations.find(c => c.id === selectedConversationId);
        if (conv && conv.title === "New Chat" && fullAssistantMessage) {
          const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
          await updateConversationTitle(selectedConversationId, title);
        }
      } catch (titleError) {
        console.warn('Failed to update conversation title:', titleError);
        // Don't fail the whole operation for title issues
      }

    } catch (err) {
      console.error('Error in sendMessage:', err);
      setError(err as Error);

      // Rollback optimistic messages
      setMessages(prev => {
        // Remove the last two messages (user and assistant) we added optimistically
        if (prev.length >= 2) {
          return prev.slice(0, prev.length - 2);
        }
        return prev;
      });

      // Throw to be handled by calling code if needed
      throw err;
    } finally {
      setIsLoading(false);
      // Reload actual messages to get real IDs and sync state
      // Only do this if we don't have an error (to avoid overwriting error state)
      if (!error) {
        try {
          await loadMessages(selectedConversationId);
        } catch (reloadError) {
          console.warn('Failed to reload messages after send:', reloadError);
          // Don't set error here as it might overwrite a more meaningful send error
        }
      }
    }
  }, [selectedConversationId, conversations, updateConversationTitle, loadMessages, error]);

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