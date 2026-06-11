import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Stub */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Dashboard</Link>
          <Link href="/appointments" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Appointments</Link>
          <Link href="/meetings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Meetings</Link>
          <Link href="/analytics" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Analytics</Link>
          <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Settings</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
