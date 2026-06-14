import { prisma, isPrismaEnabled } from '@/lib/prisma';
import * as mockDb from '@/lib/ai/mockDb';

// Lightweight adapter to match expected `db` usage in admin components.
// When `DATABASE_URL` is not configured, expose a mock-backed API that
// implements the commonly used Prisma methods to avoid runtime errors.
const prismaAdapter = {
  userConversation: prisma.userConversation,
  message: prisma.message,
  // Prisma maps `AIUsageStats` model to `aIUsageStats` on the client
  usageStats: (prisma as any).aIUsageStats || (prisma as any).aiUsageStats,
};

const mockAdapter = {
  userConversation: {
    findMany: async (_args?: any) => mockDb.getConversations(),
    findUnique: async ({ where }: any) => (where?.id ? mockDb.getConversation(where.id) : null),
    create: async ({ data }: any) => mockDb.createConversation(data?.mode),
    update: async ({ where, data }: any) => mockDb.updateConversationTitle(where.id, data?.title),
    delete: async ({ where }: any) => mockDb.deleteConversation(where.id),
    count: async () => (await mockDb.getConversations()).length,
  },
  message: {
    create: async ({ data }: any) => mockDb.createMessage(data),
    findMany: async ({ where }: any) => mockDb.findMessages(where?.conversationId),
    deleteMany: async ({ where }: any) => {
      if (where?.conversationId) return mockDb.deleteMessagesByConversation(where.conversationId);
      return 0;
    },
    count: async () => {
      const convs = await mockDb.getConversations();
      return convs.reduce((sum, c) => sum + c.messages.length, 0);
    },
    groupBy: async () => [],
  },
  usageStats: {
    groupBy: async () => [],
  },
};

export const db = new Proxy(
  {},
  {
    get(_target, prop) {
      const adapter = isPrismaEnabled() ? prismaAdapter : mockAdapter;
      return adapter[prop as keyof typeof prismaAdapter];
    },
  }
) as typeof prismaAdapter;
export default db;
