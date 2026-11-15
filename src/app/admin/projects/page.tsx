'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Film,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  ExternalLink,
  Play,
} from 'lucide-react';
import { getAllProjectsAdmin, saveProject, deleteProject } from '@/lib/dataService';
import { Project } from '@/lib/types';
import VideoModal from '@/components/VideoModal';

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const list = await getAllProjectsAdmin();
    setProjects(list);
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProject(id);
      await loadProjects();
    }
  };

  const handleTogglePublish = async (project: Project) => {
    await saveProject({
      ...project,
      published: !project.published,
    });
    await loadProjects();
  };

  const handleToggleFeatured = async (project: Project) => {
    await saveProject({
      ...project,
      featured: !project.featured,
    });
    await loadProjects();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    await saveProject(editingProject);
    setEditingProject(null);
    await loadProjects();
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Manage Projects ({projects.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Edit metadata, toggle publish status, manage featured highlights, or remove projects.
          </p>
        </div>

        <Link
          href="/admin/upload-video"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-wider font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Video Project</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by title or category..."
          className="w-full bg-[#121212] border border-neutral-800 rounded-sm pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
        />
      </div>

      {/* Projects Table / Cards */}
      <div className="space-y-3">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-surface-card border border-neutral-800 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
          >
            {/* Thumbnail & Title */}
            <div className="flex items-center space-x-4 min-w-0">
              <div
                className="relative aspect-video w-24 bg-black rounded overflow-hidden shrink-0 cursor-pointer group"
                onClick={() => setActiveVideo(project)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-400 bg-black/60 px-2 py-0.5 rounded border border-gold-500/30">
                    {project.category_name}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {project.project_date}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white truncate max-w-md">
                  {project.title}
                </h3>
                <p className="text-xs text-neutral-400 truncate max-w-md mt-0.5">
                  {project.description || 'No description provided'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
              {/* Featured toggle */}
              <button
                onClick={() => handleToggleFeatured(project)}
                className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded border transition-colors ${
                  project.featured
                    ? 'bg-gold-400/20 text-gold-300 border-gold-400/50'
                    : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                }`}
                title="Toggle Featured on Home Page"
              >
                {project.featured ? '★ Featured' : '☆ Not Featured'}
              </button>

              {/* Published toggle */}
              <button
                onClick={() => handleTogglePublish(project)}
                className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded border flex items-center space-x-1 transition-colors ${
                  project.published
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                    : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                }`}
              >
                {project.published ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Published</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 text-neutral-500" />
                    <span>Draft</span>
                  </>
                )}
              </button>

              {/* Edit button */}
              <button
                onClick={() => setEditingProject(project)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-gold-400 rounded border border-neutral-800 transition-colors"
                title="Edit Details"
              >
                <Edit className="w-4 h-4" />
              </button>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(project.id, project.title)}
                className="p-1.5 bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 rounded border border-neutral-800 hover:border-red-800/60 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-gold-500/40 rounded-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-white border-b border-neutral-800 pb-3">
              Edit Project Details
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.category_name}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, category_name: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Video URL
                </label>
                <input
                  type="text"
                  value={editingProject.video_url}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, video_url: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-400 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-400 text-black font-bold uppercase rounded shadow-gold-glow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.video_url || ''}
        title={activeVideo?.title || 'Preview Player'}
      />
    </div>
  );
}
