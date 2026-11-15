'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Camera,
  ImagePlus,
  Video,
  FolderTree,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Database,
  ArrowRight,
} from 'lucide-react';
import { getAllProjectsAdmin, getMedia, getCategories } from '@/lib/dataService';
import { Project, MediaItem, Category } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminOverviewPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const projs = await getAllProjectsAdmin();
      setProjects(projs);
      const media = await getMedia();
      setMediaItems(media);
      const cats = await getCategories();
      setCategories(cats);
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="p-8 bg-gradient-to-r from-[#111] via-[#0d0d0d] to-[#070707] border border-neutral-800 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-bold">
            Executive Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Welcome to Your Creative Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Upload new films, add photography stills, customize categories, and manage profile information.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/upload-photo"
            className="px-4 py-2.5 bg-neutral-900 border border-neutral-700 hover:border-gold-400 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center space-x-2"
          >
            <ImagePlus className="w-4 h-4 text-gold-400" />
            <span>Upload Photo</span>
          </Link>
          <Link
            href="/admin/upload-video"
            className="px-4 py-2.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-wider font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <Video className="w-4 h-4" />
            <span>Upload / Link Video</span>
          </Link>
        </div>
      </div>

      {/* Supabase Status Banner */}
      <div
        className={`p-5 rounded-sm border ${
          isSupabaseConfigured
            ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
            : 'bg-amber-950/20 border-amber-800/60 text-amber-200'
        } flex items-start space-x-3 text-xs`}
      >
        <Database className="w-5 h-5 shrink-0 mt-0.5 text-gold-400" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider">
              {isSupabaseConfigured ? 'Supabase Database & Storage Active' : 'Supabase Local Storage Mode'}
            </span>
          </div>
          <p className="mt-1 text-neutral-400 leading-relaxed">
            {isSupabaseConfigured
              ? 'Your portfolio is synced with Supabase PostgreSQL and Supabase Storage bucket `portfolio-media`.'
              : 'The application is running in persistent local development mode. To connect your live Supabase cloud project, copy your Supabase URL & Anon Key into `.env.local` and execute `supabase/schema.sql` in your Supabase SQL editor.'}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider">Video Projects</span>
            <Film className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-white mt-3">{projects.length}</p>
          <p className="text-[11px] text-neutral-400 mt-1">Live on website</p>
        </div>

        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider">Photo Stills</span>
            <Camera className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-white mt-3">{mediaItems.length}</p>
          <p className="text-[11px] text-neutral-400 mt-1">In gallery</p>
        </div>

        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider">Categories</span>
            <FolderTree className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-white mt-3">{categories.length}</p>
          <p className="text-[11px] text-neutral-400 mt-1">Active disciplines</p>
        </div>

        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs uppercase tracking-wider">Portfolio Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-serif font-bold text-emerald-400 mt-3">Live</p>
          <p className="text-[11px] text-neutral-400 mt-1">Publicly accessible</p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload System Card */}
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
          <h3 className="text-lg font-serif font-bold text-white border-b border-neutral-800 pb-3">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/upload-photo"
              className="flex items-center justify-between p-3.5 bg-neutral-900 border border-neutral-800 hover:border-gold-500/50 rounded transition-all group"
            >
              <div className="flex items-center space-x-3">
                <ImagePlus className="w-5 h-5 text-gold-400" />
                <div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-gold-300">
                    Photos: Add, Edit &amp; Delete
                  </h4>
                  <p className="text-[11px] text-neutral-400">Drag &amp; drop upload, edit captions, delete photos</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-gold-400 transition-colors" />
            </Link>

            <Link
              href="/admin/upload-video"
              className="flex items-center justify-between p-3.5 bg-neutral-900 border border-neutral-800 hover:border-gold-500/50 rounded transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Video className="w-5 h-5 text-gold-400" />
                <div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-gold-300">
                    Videos: Add, Edit &amp; Delete
                  </h4>
                  <p className="text-[11px] text-neutral-400">Upload MP4 or paste YouTube links, edit &amp; delete</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-gold-400 transition-colors" />
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center justify-between p-3.5 bg-neutral-900 border border-neutral-800 hover:border-gold-500/50 rounded transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Film className="w-5 h-5 text-gold-400" />
                <div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-gold-300">
                    Manage Existing Projects
                  </h4>
                  <p className="text-[11px] text-neutral-400">Edit titles, thumbnails, categories or delete items</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-gold-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Projects List Preview */}
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-lg font-serif font-bold text-white">Recent Projects</h3>
            <Link href="/admin/projects" className="text-xs text-gold-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 bg-neutral-900 rounded border border-neutral-800"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumbnail_url}
                    alt={p.title}
                    className="w-12 h-8 object-cover rounded bg-neutral-950 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{p.title}</h4>
                    <p className="text-[10px] text-gold-400 uppercase tracking-wider">
                      {p.category_name}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono shrink-0 ml-2">
                  {p.project_date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
