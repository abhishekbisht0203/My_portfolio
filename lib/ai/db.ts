import { prisma } from '@/lib/prisma';

// Lightweight adapter to match expected `db` usage in admin components
export const db = {
  userConversation: prisma.userConversation,
  message: prisma.message,
  // Prisma maps `AIUsageStats` model to `aIUsageStats` on the client
  usageStats: (prisma as any).aIUsageStats || (prisma as any).aiUsageStats,
};

export default db;
