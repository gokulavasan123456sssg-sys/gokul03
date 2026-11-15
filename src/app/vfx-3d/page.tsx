'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/ProjectCard';
import VideoModal from '@/components/VideoModal';
import { getProjects } from '@/lib/dataService';
import { Project } from '@/lib/types';
import { INITIAL_PROJECTS } from '@/lib/initialData';
import { Layers, Box, Cpu, Sparkles } from 'lucide-react';

export default function Vfx3DPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);

  useEffect(() => {
    async function loadData() {
      const allProjects = await getProjects();
      const vfxProjects = allProjects.filter(
        (p) =>
          p.type === 'vfx' ||
          p.category_name === 'VFX & 3D Breakdown' ||
          p.software_used?.includes('Autodesk Maya') ||
          p.software_used?.includes('Nuke')
      );
      setProjects(vfxProjects);
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="CGI &amp; Compositing"
          title="VFX &amp; 3D Breakdowns"
          subtitle="Seamless integration of computer-generated elements, multi-pass compositing, lighting, and procedural simulations."
        />

        {/* Pipeline & Disciplines Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-white font-serif font-semibold text-lg">Autodesk Maya</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Hard-surface and environmental asset modeling, UV unwrapping, camera projection, and realistic PBR lighting setups.
            </p>
          </div>

          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-white font-serif font-semibold text-lg">Foundry Nuke</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Industry-standard node graph compositing: deep rotoscoping, clean-plating, 3D point cloud tracking, and multi-channel EXR beauty pass integration.
            </p>
          </div>

          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-white font-serif font-semibold text-lg">After Effects &amp; Simulation</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Particle systems, atmospheric smoke &amp; embers, optical flares, motion tracking, and kinetic typography.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-serif font-bold text-white mb-2">VFX Showcases &amp; Breakdowns</h3>
          <p className="text-xs text-neutral-400">Click to watch sequence comparisons, pass breakdowns, and final shots.</p>
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
        title={activeVideo?.title || 'VFX Breakdown'}
      />
    </div>
  );
}
