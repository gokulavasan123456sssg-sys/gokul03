'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { loginAdmin } from '@/lib/authService';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Cinematic subtle glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold-400/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#0b0b0b] border border-neutral-800 rounded-sm p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/40 flex items-center justify-center text-gold-400 mx-auto mb-4 shadow-gold-glow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-widest">
            GOKULAVASAN
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-semibold mt-1">
            Administrator Portal
          </p>
        </div>

        {/* Status notice */}
        <div className="mb-6 p-3 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-300">
          <p className="font-semibold text-white mb-1">
            {isSupabaseConfigured ? '🟢 Connected to Supabase' : '🟡 Local Development Mode'}
          </p>
          <p className="text-[11px] text-neutral-400">
            {isSupabaseConfigured
              ? 'Sign in using your authorized Supabase administrator account.'
              : 'Sign in with: admin@gokulavasan.com / password: admin123'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-800/80 rounded flex items-center space-x-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gokulavasan.com"
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.2em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying...</span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-neutral-900">
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
