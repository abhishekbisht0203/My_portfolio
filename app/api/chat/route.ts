import { NextRequest, NextResponse } from 'next/server';
import { prisma, isPrismaEnabled } from '@/lib/prisma';
import * as mockDb from '@/lib/ai/mockDb';
import { AIProviderFactory } from '@/lib/ai/providerFactory';
import { AIMessage } from '@/lib/ai/types';
import { performWebSearch, formatSearchResultsForPrompt } from '@/lib/ai/tools/webSearch';
import { AIProvider, AIMode } from '@prisma/client';

export const maxDuration = 60; // Allow longer execution time for AI endpoints

export async function POST(req: NextRequest) {
  try {
    const { conversationId, content, webSearchEnabled, aiMode = 'GENERAL' } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let conversation: any = null;
    if (!isPrismaEnabled()) {
      conversation = await mockDb.getConversation(conversationId);
    } else {
      try {
        conversation = await prisma.userConversation.findUnique({ where: { id: conversationId } });
      } catch (err) {
        // Prisma unavailable - try mock DB
        conversation = await mockDb.getConversation(conversationId);
      }
    }

    if (!conversation) {
      // On Vercel, server actions and route handlers can run in different
      // isolated instances. Recreate the selected conversation in this route
      // instance instead of failing the chat request.
      if (!isPrismaEnabled()) {
        conversation = await mockDb.createConversation(aiMode as any, conversationId);
      } else {
        try {
          await prisma.userConversation.create({
            data: {
              id: conversationId,
              title: 'New Chat',
            },
          });
          conversation = await prisma.userConversation.findUnique({ where: { id: conversationId } });
        } catch (err) {
          conversation = await mockDb.createConversation(aiMode as any, conversationId);
        }
      }
    }

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Save user message immediately (DB or mock)
    if (!isPrismaEnabled()) {
      await mockDb.createMessage({ role: 'user', content, conversationId, aiMode: aiMode as any });
    } else {
      try {
        await prisma.message.create({
          data: {
            role: 'user',
            content,
            conversationId,
            aiMode,
          },
        });
      } catch (err) {
        await mockDb.createMessage({ role: 'user', content, conversationId, aiMode: aiMode as any });
      }
    }

    // Update conversation timestamp
    if (!isPrismaEnabled()) {
      const c = await mockDb.getConversation(conversationId);
      if (c) c.updatedAt = new Date();
    } else {
      try {
        await prisma.userConversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
      } catch (err) {
        const c = await mockDb.getConversation(conversationId);
        if (c) c.updatedAt = new Date();
      }
    }

    // Get previous messages
    let previousMessages: any[] = [];
    if (!isPrismaEnabled()) {
      previousMessages = await mockDb.findMessages(conversationId);
    } else {
      try {
        previousMessages = await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' }, take: 20 });
      } catch (err) {
        previousMessages = await mockDb.findMessages(conversationId);
      }
    }

    let systemPrompt = getSystemPrompt(aiMode);

    if (webSearchEnabled) {
      const searchResults = await performWebSearch(content, 4);
      if (searchResults.length > 0) {
        systemPrompt += formatSearchResultsForPrompt(searchResults);
      }
    }

    // Prepare messages for AI provider
    const aiMessages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...previousMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Initialize provider (fall back to a lightweight local provider when no API key is configured)
    let provider: any = null;
    try {
      provider = AIProviderFactory.getProviderFromEnv();
    } catch (err) {
      console.warn('AI provider not configured, using local fallback provider for development.');

      // Local fallback provider that answers common portfolio questions
      provider = {
        getProviderName() {
          return 'local';
        },
        async *streamComplete(messages: any[], _opts: any) {
          const userMsg = messages[messages.length - 1]?.content || '';
          const reply = getLocalFallbackReply(userMsg, aiMode);
          // Simple streaming: emit small chunks
          for (let i = 0; i < reply.length; i += 60) {
            const chunk = reply.slice(i, i + 60);
            yield { choices: [{ delta: { content: chunk } }] };
            // small delay to mimic streaming
            await new Promise((r) => setTimeout(r, 8));
          }
        },
      };
    }

    // Set up text stream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Process stream asynchronously to not block returning the response
    (async () => {
      let fullAssistantMessage = '';
      try {
        const aiStream = provider.streamComplete(aiMessages, {
          temperature: 0.7,
          maxTokens: 2000,
        });

        for await (const chunk of aiStream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            fullAssistantMessage += delta;
            await writer.write(encoder.encode(delta));
          }
        }
      } catch (error: any) {
        console.error('Streaming error:', error);
        await writer.write(encoder.encode('\n\n**Error:** An issue occurred while generating the response.'));
      } finally {
        await writer.close();

        // Save complete assistant message
        if (fullAssistantMessage) {
          try {
            await prisma.message.create({
              data: {
                role: 'assistant',
                content: fullAssistantMessage,
                conversationId,
                aiMode,
                aiProvider: provider.getProviderName().toUpperCase() as AIProvider
              }
            });

            // Track usage for admin dashboard
            try {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Start of today

              // Try to find existing stats record for today/provider/mode
              const existingStat = await prisma.aIUsageStats.findFirst({
                where: {
                  date: today,
                  provider: provider.getProviderName().toUpperCase() as AIProvider,
                  mode: aiMode as AIMode
                }
              });

              if (existingStat) {
                // Update existing record
                await prisma.aIUsageStats.update({
                  where: { id: existingStat.id },
                  data: {
                    totalRequests: { increment: 1 },
                    totalTokens: {
                      // For now, we don't have token usage from streaming response
                      // This would need to be enhanced to track actual token usage
                      // We could approximate or leave as 0 for now
                      // In a future improvement, we could get usage from provider response
                      increment: 0
                    }
                  }
                });
              } else {
                // Create new record
                await prisma.aIUsageStats.create({
                  data: {
                    date: today,
                    provider: provider.getProviderName().toUpperCase() as AIProvider,
                    mode: aiMode as AIMode,
                    totalRequests: 1,
                    totalTokens: 0, // To be implemented with actual token tracking
                    errorCount: 0
                  }
                });
              }
            } catch (usageError) {
              console.warn('Failed to track AI usage stats:', usageError);
              // Don't fail the whole request if usage tracking fails
            }
          } catch (err) {
            await mockDb.createMessage({ role: 'assistant', content: fullAssistantMessage, conversationId, aiMode: aiMode as any, aiProvider: provider.getProviderName().toUpperCase() as any });
          }
        }
      }
    })();

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

function getSystemPrompt(mode: string): string {
  switch (mode) {
    case 'PORTFOLIO':
      return `You are an AI assistant for Abhishek Bisht's portfolio. You have access to his complete professional information including:

      Personal Info: Abhishek Bisht, Software Engineer, Full Stack Developer

      Skills: React, Next.js, TypeScript, Node.js, Express.js, FastAPI, Django REST Framework, MongoDB, PostgreSQL, Tailwind CSS, WebSockets, OAuth, Cloudinary, CI/CD

      Experience:
      - Dexplovate Pvt. Ltd. (Full Stack Developer, May 2025 - Nov 2025)
        * Led development of scalable applications using MERN stack and FastAPI
        * Architected MongoDB and PostgreSQL schemas
        * Built high-performance APIs integrated with React frontends
        * Delivered real-time features and UI/UX improvements

      - CADL (Python Full Stack Developer, Apr 2024 - Apr 2025)
        * Engineered scalable web applications using Django REST Framework
        * Implemented secure authentication systems
        * Built responsive UIs using React and Tailwind CSS
        * Integrated third-party APIs, payment gateways, and WebSockets

      - Vahanfin Solutions Pvt. Ltd. (Software Engineer, Feb 2026 - May 2026)
        * Built and deployed scalable E-challan admin dashboard using Next.js, Node.js, MongoDB
        * Designed and optimized REST APIs for vehicle challan data
        * Implemented role-based dashboards (RMCC, RMI, Admin)
        * Developed dynamic data tables with Excel/CSV export
        * Improved backend performance by optimizing database queries

      Projects:
      - ChatClassRoom – Virtual Learning Platform (Django REST, React, WebSockets, PWA)
      - E-Commerce Platform (Django, React, Stripe, REST APIs)
      - FormCoach (Next.js, TypeScript, MediaPipe, React) - AI-powered vertical jump form analyzer
      - Yash Shell (C, Unix Systems Programming) - Custom Unix shell from scratch
      - MetadataEditor (Electron, Node.js, JavaScript) - Desktop app for batch metadata editing
      - Algorithm Visualizer (Next.js, React) - Pathfinding visualizer with BFS/DFS
      - Space Invaders Clone (C, Assembly) - On MSPM0 microcontroller
      - Portfolio Website (Next.js, Framer Motion, Tailwind CSS, TypeScript) - This very site
      - Traffic Light FSM (C, Assembly) - Embedded system traffic light controller
      - Rowdy Park (Python, Pygame) - 48-hour hackathon RPG
      - Cyclone Database (Java) - Command-line database system

      When answering questions about Abhishek, his experience, skills, or projects, use this information. Do not make up information that is not provided above.

      If asked about technologies not mentioned in his experience, say that you don't have specific information about his experience with those technologies but can provide general guidance.

      Keep responses helpful, accurate, and concise unless detailed explanation is requested.`;

    case 'CODING':
      return `You are an expert coding assistant. You help with:
      - Writing clean, efficient code in various languages
      - Debugging and troubleshooting code issues
      - Explaining programming concepts and algorithms
      - Suggesting best practices and design patterns
      - Code reviews and improvements
      - Learning new technologies and frameworks

      When providing code examples, use proper syntax highlighting and explain what the code does.
      Always strive for production-quality, maintainable code solutions.

      If asked about specific projects or technologies from the portfolio, provide context-aware assistance based on the technologies mentioned in Abhishek's experience.`;

    case 'PROJECT_ADVISOR':
      return `You are a project advisor and consultant. You help with:
      - Project planning and architecture
      - Technology stack selection
      - Feature planning and prioritization
      - Development best practices
      - Deployment and DevOps guidance
      - Scalability and performance considerations
      - User experience and interface design

      Draw from Abhishek's experience building various platforms including e-learning systems, e-commerce platforms, embedded systems, and desktop applications.
      Provide practical, actionable advice based on real-world development experience.`;

    case 'CAREER_MENTOR':
      return `You are a career mentor and advisor for software developers. You help with:
      - Career development and progression
      - Skill development and learning paths
      - Job search strategies and interview preparation
      - Resume and portfolio improvement
      - Professional networking and branding
      - Workplace skills and professional development
      - Emerging technologies and industry trends

      Base your advice on Abhishek's journey from Python full stack developer to software engineer working on diverse projects including embedded systems, web applications, and enterprise solutions.
      Provide personalized, actionable career guidance.`;

    case 'GENERAL':
    default:
      return `You are a helpful AI assistant. You can:
      - Answer general questions on various topics
      - Provide explanations and tutorials
      - Help with writing and communication
      - Offer suggestions and recommendations
      - Engage in thoughtful discussions

      When asked about Abhishek Bisht's portfolio, experience, or projects, refer to the specific information provided in the portfolio context.

      Be helpful, accurate, and engaging in your responses.`;
  }
}

function getLocalFallbackReply(content: string, mode: string) {
  const query = content.toLowerCase().trim();

  const projectsReply = `Abhishek has built projects across web, desktop, and embedded systems. Highlights include ChatClassRoom (virtual learning platform with Django REST, React, WebSockets, and PWA support), FormCoach (AI-powered jump form analyzer with Next.js and TypeScript), an E-Commerce Platform with Stripe integration, MetadataEditor (Electron desktop app), an Algorithm Visualizer in Next.js, Yash Shell in C, and embedded systems projects like Space Invaders Clone and Traffic Light FSM.`;

  const skillsReply = `Abhishek works mainly across full stack JavaScript and Python. His portfolio highlights React, Next.js, TypeScript, Node.js, Express.js, FastAPI, Django REST Framework, MongoDB, PostgreSQL, Tailwind CSS, WebSockets, OAuth, Cloudinary, and CI/CD.`;

  const experienceReply = `Abhishek's recent experience includes Full Stack Developer at Dexplovate Pvt. Ltd. from May 2025 to November 2025, Python Full Stack Developer at CADL from April 2024 to April 2025, and Software Engineer at Vahanfin Solutions Pvt. Ltd. from February 2026 to May 2026. His work includes scalable web apps, REST APIs, real-time features, dashboards, and database design.`;

  const fullStackReply = `Yes. Abhishek is positioned as a full stack engineer with strong experience across frontend, backend, APIs, databases, and deployment-oriented workflows. His stack includes Next.js, React, Node.js, FastAPI, Django REST Framework, MongoDB, and PostgreSQL.`;

  const contactReply = `You can reach Abhishek through the contact section of this portfolio. If you're a recruiter or hiring manager, a strong outreach message would mention the role, core stack, team context, and whether you're looking for frontend, backend, or full stack ownership.`;

  const resumeReply = `Abhishek's resume is available from the Resume section in the site navigation. If you'd like, I can also summarize his experience, skills, or best-fit roles directly here.`;

  const aboutReply = `Abhishek Bisht is a Software Engineer and Full Stack Developer with strong experience in MERN, Next.js, FastAPI, and Django REST Framework. He focuses on building scalable production-ready applications and has worked on dashboards, APIs, real-time systems, e-learning platforms, desktop tools, and embedded projects.`;

  const recruiterReply = `For recruiters, Abhishek is a strong fit for full stack software engineering roles involving React, Next.js, TypeScript, Node.js, Python backend work, REST APIs, and database-driven products. He has experience building admin dashboards, real-time features, e-learning platforms, and scalable application backends.`;

  if (query.includes('project')) return projectsReply;
  if (query.includes('skill') || query.includes('technology') || query.includes('tech stack')) return skillsReply;
  if (query.includes('experience') || query.includes('worked at') || query.includes('company')) return experienceReply;
  if (query.includes('full stack') || query.includes('frontend') || query.includes('backend')) return fullStackReply;
  if (query.includes('contact') || query.includes('reach') || query.includes('hire')) return contactReply;
  if (query.includes('resume') || query.includes('cv')) return resumeReply;
  if (query.includes('recruiter') || query.includes('role fit') || query.includes('fit for')) return recruiterReply;
  if (query.includes('about') || query.includes('who is') || query.includes('introduce')) return aboutReply;

  if (mode === 'PORTFOLIO') {
    return `${aboutReply} ${skillsReply} ${experienceReply} Ask about projects, skills, experience, or role fit and I can answer in more detail.`;
  }

  return `I'm running in local portfolio assistant mode right now, so I can still help with Abhishek's projects, skills, experience, role fit, and contact details. Try asking about projects, skills, experience, resume, or recruiter fit.`;
}
