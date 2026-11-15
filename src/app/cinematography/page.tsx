'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/ProjectCard';
import VideoModal from '@/components/VideoModal';
import { getProjects } from '@/lib/dataService';
import { Project } from '@/lib/types';
import { INITIAL_PROJECTS } from '@/lib/initialData';
import { Camera, Sun, Sliders, Film } from 'lucide-react';

export default function CinematographyPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);

  useEffect(() => {
    async function loadData() {
      const allProjects = await getProjects();
      // Filter projects that showcase cinematography craft
      const filtered = allProjects.filter(
        (p) =>
          p.category_name === 'Cinematic Films' ||
          p.category_name === 'Wedding Films' ||
          p.category_name === 'Short Films'
      );
      setProjects(filtered);
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="Direction of Photography"
          title="Cinematography &amp; Visual Direction"
          subtitle="Sculpting light, depth, camera movement, and anamorphic aesthetics for unforgettable silver-screen moments."
        />

        {/* Cinematography Technical Craft Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-white font-serif font-semibold text-lg">Camera &amp; Optics</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Experience with modern cinema sensors, gimbal and shoulder rigs, vintage manual primes, and anamorphic adapters to create organic optical character.
            </p>
          </div>

          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-white font-serif font-semibold text-lg">Lighting Architecture</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Designing high-contrast chiaroscuro, naturalistic soft window wraps, and atmospheric haze to build emotional resonance within every interior and exterior setup.
            </p>
          </div>

          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-white font-serif font-semibold text-lg">Color Science &amp; Grading</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Color pipeline development in DaVinci Resolve utilizing ACES / DaVinci YRGB Color Managed, protecting skin tone integrity and rich shadow roll-off.
            </p>
          </div>
        </div>

        {/* Featured Cinematography Films */}
        <div className="mb-8">
          <h3 className="text-xl font-serif font-bold text-white mb-2">Cinematography Projects</h3>
          <p className="text-xs text-neutral-400">Click any project to play high-definition film footage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPlay={(proj) => setActiveVideo(proj)}
            />
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.video_url || ''}
        title={activeVideo?.title || 'Cinematography Reel'}
      />
    </div>
  );
}
