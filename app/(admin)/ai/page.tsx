import { getAIUsageStats } from '@/app/actions/ai-actions';

export const metadata = {
  title: 'AI Dashboard | Admin',
  description: 'AI usage statistics and management',
};

export default async function AIAssistantAdminPage() {
  const stats = await getAIUsageStats();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your AI assistant usage, conversation metrics, and mode popularity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Chats</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.totalChats}</div>
            <p className="text-xs text-muted-foreground">
              Total conversation sessions created
            </p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Messages</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Messages exchanged with AI
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col space-y-1.5">
            <h3 className="font-semibold leading-none tracking-tight">Messages by AI Mode</h3>
            <p className="text-sm text-muted-foreground">
              Distribution of conversations across different assistant modes.
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {stats.modeStats.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">No data available yet</div>
              ) : (
                stats.modeStats.map((modeStat) => (
                  <div key={modeStat.mode} className="flex items-center">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{modeStat.mode}</p>
                    </div>
                    <div className="font-medium">{modeStat.count} messages</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
