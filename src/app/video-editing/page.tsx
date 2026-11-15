'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/ProjectCard';
import VideoModal from '@/components/VideoModal';
import { getProjects, getCategories } from '@/lib/dataService';
import { Project, Category } from '@/lib/types';
import { INITIAL_PROJECTS, INITIAL_CATEGORIES } from '@/lib/initialData';
import { Search } from 'lucide-react';

export default function VideoEditingPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);

  useEffect(() => {
    async function loadData() {
      const cats = await getCategories('video');
      setCategories(cats);
      const projs = await getProjects({ type: 'video' });
      setProjects(projs);
    }
    loadData();
  }, []);

  const videoCategories = [
    'All',
    'Cinematic Films',
    'Wedding Films',
    'Short Films',
    'YouTube Projects',
    'Promotional Videos',
    'Instagram Reels',
    'Freelance Projects',
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === 'All' ||
      project.category_name?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.software_used?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="Post-Production &amp; Narrative"
          title="Video Editing Portfolio"
          subtitle="Precision pacing, seamless continuity, dynamic sound design, and narrative clarity crafted for high visual impact."
        />

        {/* Filter Controls Bar */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {videoCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs uppercase tracking-[0.16em] px-4 py-2 rounded-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gold-400 text-black font-bold shadow-gold-glow'
                      : 'bg-[#111] text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or software..."
              className="w-full bg-[#111] border border-neutral-800 rounded-sm pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500/60"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPlay={(proj) => setActiveVideo(proj)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card border border-neutral-800/80 rounded-sm">
            <p className="text-neutral-400 text-sm">No video projects found matching your filter.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 text-xs uppercase tracking-wider text-gold-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.video_url || ''}
        title={activeVideo?.title || 'Video Player'}
      />
    </div>
  );
}
