import { AIMode, Message, UserConversation } from '@prisma/client';

type Conv = UserConversation & { messages: Message[] };

// Simple in-memory mock DB for local dev when Prisma/database is unavailable
const conversations: Conv[] = [
  {
    id: 'local-1',
    title: 'Welcome to the demo chat',
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
    messages: [
      {
        id: 'm-local-1',
        conversationId: 'local-1',
        role: 'assistant',
        content: "Hi! This is a local demo chat. Ask me about the portfolio or say 'help' to get started.",
        aiMode: 'GENERAL' as AIMode,
        aiProvider: 'OPENAI' as any,
        tokensUsed: 0,
        createdAt: new Date(),
      },
    ],
  },
];

export async function getConversations(): Promise<Conv[]> {
  // return clone to mimic DB behavior
  return conversations
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getConversation(id: string): Promise<Conv | null> {
  const c = conversations.find((x) => x.id === id) || null;
  return c ? JSON.parse(JSON.stringify(c)) : null;
}

export async function createConversation(mode: AIMode = 'GENERAL'): Promise<Conv> {
  const id = `local-${Date.now()}`;
  const conv: Conv = {
    id,
    title: 'New Chat',
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isArchived: false,
    messages: [],
  };
  conversations.unshift(conv);
  return JSON.parse(JSON.stringify(conv));
}

export async function updateConversationTitle(id: string, title: string) {
  const conv = conversations.find((c) => c.id === id);
  if (!conv) return null;
  conv.title = title;
  conv.updatedAt = new Date();
  return JSON.parse(JSON.stringify(conv));
}

export async function deleteConversation(id: string) {
  const idx = conversations.findIndex((c) => c.id === id);
  if (idx !== -1) conversations.splice(idx, 1);
  return true;
}

export async function createMessage(data: Partial<Message> & { conversationId: string }) {
  const conv = conversations.find((c) => c.id === data.conversationId);
  if (!conv) throw new Error('Conversation not found');
  const id = `m-${Date.now()}`;
  const message: Message = {
    id,
    conversationId: data.conversationId,
    role: (data.role as any) || 'assistant',
    content: data.content || '',
    aiMode: (data.aiMode as AIMode) || ('GENERAL' as AIMode),
    aiProvider: (data.aiProvider as any) || ('OPENAI' as any),
    tokensUsed: (data.tokensUsed as number) || 0,
    createdAt: new Date(),
  };
  conv.messages.push(message);
  conv.updatedAt = new Date();
  return JSON.parse(JSON.stringify(message));
}

export async function findMessages(conversationId: string) {
  const conv = conversations.find((c) => c.id === conversationId);
  if (!conv) return [];
  return conv.messages.slice().sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export async function deleteMessagesByConversation(conversationId: string) {
  const conv = conversations.find((c) => c.id === conversationId);
  if (!conv) return 0;
  const count = conv.messages.length;
  conv.messages = [];
  return count;
}

export default {
  getConversations,
  getConversation,
  createConversation,
  updateConversationTitle,
  deleteConversation,
  createMessage,
  findMessages,
  deleteMessagesByConversation,
};
