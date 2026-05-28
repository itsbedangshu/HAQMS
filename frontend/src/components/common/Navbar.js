'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Activity, LogOut, LayoutDashboard, MonitorPlay, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl tracking-tight">
          <Activity className="h-6 w-6" />
          <span>HAQMS</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/queue"
            className="flex items-center gap-1.5 text-base font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <MonitorPlay className="h-5 w-5" />
            Live Queue
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-base font-semibold text-gray-900">{user.name}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-bold tracking-wide uppercase bg-blue-100 text-blue-700 border border-blue-200">
              <Shield className="h-4 w-4" />
              {user.role}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors focus:outline-none"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
