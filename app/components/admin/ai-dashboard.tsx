"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/ai/db';
import { AIProvider, AIMode } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { XCircle, Clock, Database, Zap, MessageCircle, Users } from 'lucide-react';

export function AIAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('7d'); // 7d, 30d, 90d
  const [providerFilter, setProviderFilter] = useState<AIProvider | 'all'>('all');
  const [modeFilter, setModeFilter] = useState<AIMode | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter, providerFilter, modeFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date based on time filter
      const now = new Date();
      let startDate: Date;

      switch (timeFilter) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      // Fetch overall stats
      const [totalChats, totalMessages, providerStats, modeStats, recentChats] = await Promise.all([
        db.userConversation.count(),
        db.message.count(),
        db.usageStats.groupBy({
          by: ['provider'],
          where: {
            date: {
              gte: startDate
            }
          },
          _sum: {
            totalTokens: true,
            totalRequests: true
          },
          _avg: {
            totalTokens: true
          }
        }),
        db.usageStats.groupBy({
          by: ['mode'],
          where: {
            date: {
              gte: startDate
            }
          },
          _sum: {
            totalTokens: true,
            totalRequests: true
          }
        }),
        db.userConversation.findMany({
          take: 10,
          orderBy: { updatedAt: 'desc' },
          include: {
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' }
            }
          }
        })
      ]);

      // Apply filters
      let filteredProviderStats = providerStats;
      let filteredModeStats = modeStats;

      if (providerFilter !== 'all') {
        filteredProviderStats = providerStats.filter((stat: any) => stat.provider === providerFilter);
      }

      if (modeFilter !== 'all') {
        filteredModeStats = modeStats.filter((stat: any) => stat.mode === modeFilter);
      }

      setStats({
        totalChats,
        totalMessages,
        providerStats: filteredProviderStats,
        modeStats: filteredModeStats,
        recentChats
      });
    } catch (err) {
      console.error('Failed to fetch AI admin data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => fetchDashboardData()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">AI Assistant Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor usage, performance, and statistics of your AI assistant
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Time Range:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1 border rounded hover:bg-muted-background">
                {timeFilter === '1d' ? '1 Day' : timeFilter === '7d' ? '7 Days' : timeFilter === '30d' ? '30 Days' : '90 Days'}
                <svg className="ml-2 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7" />
                  </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => setTimeFilter('1d')}>1 Day</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('7d')}>7 Days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('30d')}>30 Days</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeFilter('90d')}>90 Days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="text-sm">Provider:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1 border rounded hover:bg-muted-background">
                {providerFilter === 'all' ? 'All Providers' : String(providerFilter)}
                <svg className="ml-2 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7" />
                  </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => setProviderFilter('all')}>All Providers</DropdownMenuItem>
                {[AIProvider.OPENAI, AIProvider.ANTHROPIC, AIProvider.GOOGLE, AIProvider.GROQ, AIProvider.OPENROUTER].map(provider => (
                  <DropdownMenuItem
                    key={provider}
                    onClick={() => setProviderFilter(provider)}
                  >
                    {provider}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Mode:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1 border rounded hover:bg-muted-background">
                {modeFilter === 'all' ? 'All Modes' : String(modeFilter)}
                <svg className="ml-2 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 9l-7 7-7-7" />
                  </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => setModeFilter('all')}>All Modes</DropdownMenuItem>
                {[AIMode.GENERAL, AIMode.PORTFOLIO, AIMode.CODING, AIMode.PROJECT_ADVISOR, AIMode.CAREER_MENTOR].map(mode => (
                  <DropdownMenuItem
                    key={mode}
                    onClick={() => setModeFilter(mode)}
                  >
                    {mode}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Conversations</CardTitle>
            <CardDescription>
              Total number of chat sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalChats}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Messages</CardTitle>
            <CardDescription>
              Messages exchanged with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalMessages}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Usage</CardTitle>
            <CardDescription>
              Most used AI provider
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.providerStats.length > 0 ?
              stats.providerStats.reduce((a: any, b: any) =>
                (a._sum.totalRequests || 0) > (b._sum.totalRequests || 0) ? a : b
              ).provider : 'N/A'
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Mode</CardTitle>
            <CardDescription>
              Most used AI mode
            </CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.modeStats.length > 0 ?
              stats.modeStats.reduce((a: any, b: any) =>
                (a._sum.totalRequests || 0) > (b._sum.totalRequests || 0) ? a : b
              ).mode : 'N/A'
            }
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-6">
        {/* Provider Stats */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Provider Usage Statistics</CardTitle>
              <CardDescription>
                Token consumption and request count by AI provider
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.refresh()}
            >
              Refresh Data
            </Button>
          </CardHeader>
          <CardContent>
            {stats.providerStats.length === 0 ? (
              <p className="text-muted-foreground">No provider data available for selected filters</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-center">Total Requests</TableHead>
                    <TableHead className="text-center">Total Tokens</TableHead>
                    <TableHead className="text-center">Avg Tokens/Request</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.providerStats.map((stat: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className="font-medium">{stat.provider}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {stat._sum.totalRequests || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat._sum.totalTokens?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat._avg.totalTokens ? Math.round(stat._avg.totalTokens) : 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Mode Stats */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Mode Usage Statistics</CardTitle>
              <CardDescription>
                Usage breakdown by AI assistant mode
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {stats.modeStats.length === 0 ? (
              <p className="text-muted-foreground">No mode data available for selected filters</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mode</TableHead>
                    <TableHead className="text-center">Total Requests</TableHead>
                    <TableHead className="text-center">Total Tokens</TableHead>
                    <TableHead className="text-center">Avg Tokens/Request</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.modeStats.map((stat: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className="font-medium">{stat.mode}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {stat._sum.totalRequests || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat._sum.totalTokens?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {stat._avg.totalTokens ? Math.round(stat._avg.totalTokens) : 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Chats */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>
              Most recent chat sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentChats.length === 0 ? (
              <p className="text-muted-foreground">No recent conversations</p>
            ) : (
              <div className="space-y-3">
                {stats.recentChats.map((chat: any, index: number) => (
                  <div key={index} className="border rounded-border p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{chat.title || 'Untitled Conversation'}</h3>
                        <p className="text-sm text-muted-foreground">
                          Mode: {chat.aiMode} •
                          <span className="whitespace-nowrap">
                            {chat && chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : 'Unknown'}
                          </span>
                        </p>
                      </div>
                      <Badge variant="secondary" size="xs">
                        {chat.messages.length} msg
                      </Badge>
                    </div>
                    {chat.messages.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Last message:</strong>
                        {chat.messages[0].content.length > 50
                          ? chat.messages[0].content.substring(0, 50) + '...'
                          : chat.messages[0].content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}