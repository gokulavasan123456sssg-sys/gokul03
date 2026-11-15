'use client';

import React, { useState } from 'react';
import {
  Settings,
  Database,
  Globe,
  ShieldCheck,
  Save,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function WebsiteSettingsPage() {
  const [siteTitle, setSiteTitle] = useState('GOKULAVASAN | Creative Portfolio');
  const [siteDesc, setSiteDesc] = useState(
    'Video Editor | Cinematographer | Photographer portfolio showcasing cinematic visual craft.'
  );
  const [allowDownload, setAllowDownload] = useState(false);
  const [contactEmail, setContactEmail] = useState('gokulavasan.visuals@gmail.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [saved, setSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
          System Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Website &amp; Cloud Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Configure site metadata, protect photography downloads, and check your Supabase &amp; Vercel deployment credentials.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-700/80 rounded-sm text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Settings successfully updated.</span>
        </div>
      )}

      {/* Cloud & Supabase Integration Status */}
      <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-gold-400" />
            <h3 className="text-sm uppercase tracking-wider text-white font-semibold">
              Supabase Cloud Database &amp; Storage Setup
            </h3>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
              isSupabaseConfigured
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                : 'bg-amber-950/60 text-amber-400 border border-amber-800'
            }`}
          >
            {isSupabaseConfigured ? 'Connected' : 'Action Required for Live Cloud'}
          </span>
        </div>

        <div className="text-xs text-neutral-300 space-y-3 leading-relaxed">
          <p>
            To link your portfolio to your free Supabase cloud instance:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-neutral-400 pl-2">
            <li>
              Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-gold-400 underline">supabase.com</a> and create a new free project.
            </li>
            <li>
              Navigate to <strong>Project Settings → API</strong> and copy your <code className="text-gold-300 bg-neutral-900 px-1 py-0.5 rounded">Project URL</code> and <code className="text-gold-300 bg-neutral-900 px-1 py-0.5 rounded">anon public key</code>.
            </li>
            <li>
              Add them to your project&apos;s <code className="text-white">.env.local</code> file or into your Vercel Environment Variables:
              <div className="mt-2 p-3 bg-black border border-neutral-800 rounded font-mono text-[11px] text-neutral-300 select-all">
                NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co<br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
              </div>
            </li>
            <li>
              In Supabase dashboard, open the <strong>SQL Editor</strong>, open the provided file <code className="text-gold-300 bg-neutral-900 px-1.5 py-0.5 rounded">supabase/schema.sql</code>, and click <strong>RUN</strong>. This creates all tables, Row Level Security policies, and the <code className="text-gold-400">portfolio-media</code> storage bucket automatically!
            </li>
          </ol>
        </div>
      </div>

      {/* General Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-5">
          <h3 className="text-sm uppercase tracking-wider text-white font-semibold border-b border-neutral-800 pb-2">
            Website Identity &amp; Metadata
          </h3>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Website Title
            </label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Meta Description (SEO &amp; Social Sharing)
            </label>
            <textarea
              rows={3}
              value={siteDesc}
              onChange={(e) => setSiteDesc(e.target.value)}
              className="w-full bg-[#121212] border border-neutral-800 rounded-sm p-4 text-xs text-white focus:outline-none focus:border-gold-500/60 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Notification &amp; Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>
        </div>

        {/* Media Protection Policy */}
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Photography Right-Click Protection</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Disables right-click context menu and direct downloads on original high-resolution gallery images.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!allowDownload}
                onChange={() => setAllowDownload(!allowDownload)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-400"></div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.22em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
