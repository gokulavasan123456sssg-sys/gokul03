'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ImagePlus,
  Video,
  Film,
  FolderTree,
  UserCheck,
  GraduationCap,
  Briefcase,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { getCurrentAdmin, logoutAdmin, AdminUser } from '@/lib/authService';
import { isSupabaseConfigured } from '@/lib/supabase/client';

const ADMIN_NAV = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Photos (Upload / Edit / Delete)', href: '/admin/upload-photo', icon: ImagePlus },
  { name: 'Videos (Upload / Edit / Delete)', href: '/admin/upload-video', icon: Video },
  { name: 'Manage Projects', href: '/admin/projects', icon: Film },
  { name: 'Manage Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Manage Profile', href: '/admin/profile', icon: UserCheck },
  { name: 'Manage Education', href: '/admin/education', icon: GraduationCap },
  { name: 'Manage Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Website Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }
      const admin = await getCurrentAdmin();
      if (!admin) {
        router.push('/admin/login');
      } else {
        setAdminUser(admin);
      }
      setLoading(false);
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  // If on login page, render children directly without dashboard shell
  if (isLoginPage) {
    return <div className="min-h-screen bg-black text-white">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gold-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em]">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <span className="font-serif font-bold text-white tracking-widest text-sm">GOKULAVASAN</span>
          <span className="text-[10px] uppercase font-bold text-black bg-gold-400 px-1.5 py-0.5 rounded">
            ADMIN
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-neutral-400 hover:text-white p-2"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-neutral-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Brand & Portal Title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="font-serif font-bold text-lg text-white tracking-[0.18em]">
                GOKULAVASAN
              </Link>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-semibold mt-0.5">
                Admin Control Room
              </p>
            </div>
          </div>

          {/* Database Connection Status Pill */}
          <div className="mb-6 p-2.5 bg-neutral-900 border border-neutral-800 rounded text-xs flex items-center space-x-2">
            <Database
              className={`w-4 h-4 shrink-0 ${
                isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <div className="truncate">
              <p className="text-[11px] font-semibold text-white">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}
              </p>
              <p className="text-[10px] text-neutral-400">
                {isSupabaseConfigured ? 'PostgreSQL & Storage Active' : 'Ready for Supabase credentials'}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-colors ${
                    isActive
                      ? 'bg-gold-400/10 text-gold-400 border-l-2 border-gold-400 font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Live Site & Logout */}
        <div className="p-4 border-t border-neutral-900 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              <span>View Live Website</span>
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 overflow-y-auto max-w-6xl">
        {children}
      </main>
    </div>
  );
}
