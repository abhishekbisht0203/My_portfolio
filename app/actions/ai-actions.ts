"use server";

import { prisma } from '@/lib/prisma';
import { AIMode, Message, UserConversation, AIProvider } from '@prisma/client';
import * as mockDb from '@/lib/ai/mockDb';

export async function getConversations() {
  try {
    return await prisma.userConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { messages: true }
    });
  } catch (error) {
    console.warn('Prisma unavailable, falling back to mock DB for getConversations:', (error as any)?.message || error);
    return mockDb.getConversations();
  }
}

export async function getConversation(id: string) {
  try {
    return await prisma.userConversation.findUnique({
      where: { id },
      include: { messages: true }
    });
  } catch (error) {
    console.warn('Prisma unavailable, falling back to mock DB for getConversation:', (error as any)?.message || error);
    return mockDb.getConversation(id);
  }
}

export async function createConversation(mode: AIMode = AIMode.GENERAL) {
  try {
    return await prisma.userConversation.create({
      data: {
        title: "New Chat",
      }
    });
  } catch (error) {
    console.warn('Prisma unavailable, falling back to mock DB for createConversation:', (error as any)?.message || error);
    return mockDb.createConversation(mode);
  }
}

export async function updateConversationTitleAction(id: string, title: string) {
  try {
    return await prisma.userConversation.update({
      where: { id },
      data: { title }
    });
  } catch (error) {
    console.warn('Prisma unavailable, falling back to mock DB for updateConversationTitleAction:', (error as any)?.message || error);
    return mockDb.updateConversationTitle(id, title);
  }
}

export async function deleteConversationAction(id: string) {
  try {
    await prisma.message.deleteMany({
      where: { conversationId: id }
    });

    return await prisma.userConversation.delete({
      where: { id }
    });
  } catch (error) {
    console.warn('Prisma unavailable, falling back to mock DB for deleteConversationAction:', (error as any)?.message || error);
    await mockDb.deleteMessagesByConversation(id);
    return mockDb.deleteConversation(id);
  }
}

export async function getAIUsageStats() {
  try {
    // If no database is configured (e.g. local dev without env), avoid attempting to connect
    if (!process.env.DATABASE_URL) {
      return { totalChats: 0, totalMessages: 0, modeStats: [] };
    }
    const totalChats = await prisma.userConversation.count();
    const totalMessages = await prisma.message.count();
    
    // Aggregate by mode
    const messagesByMode = await prisma.message.groupBy({
      by: ['aiMode'],
      _count: true,
    });
    
    return {
      totalChats,
      totalMessages,
      modeStats: messagesByMode.map((stat: any) => ({
        mode: stat.aiMode,
        count: stat._count
      }))
    };
  } catch (error) {
    // Suppress detailed DB errors during build/dev when credentials may be missing
    console.warn('Skipping AI usage stats: database unavailable');
    return { totalChats: 0, totalMessages: 0, modeStats: [] };
  }
}
