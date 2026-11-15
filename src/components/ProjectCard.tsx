'use client';

import React from 'react';
import { Play, Calendar, Film, Layers } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  onPlay: (project: Project) => void;
}

export default function ProjectCard({ project, onPlay }: ProjectCardProps) {
  return (
    <div
      onClick={() => onPlay(project)}
      className="group relative bg-[#0d0d0d] border border-neutral-800/80 rounded-sm overflow-hidden hover:border-gold-500/60 transition-all duration-300 hover:shadow-gold-glow flex flex-col cursor-pointer"
    >
      {/* Thumbnail with 16:9 cinematic aspect ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-300 bg-black/80 px-2.5 py-1 rounded-sm border border-gold-500/30 backdrop-blur-sm">
            {project.category_name}
          </span>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/60 border border-gold-400/80 flex items-center justify-center text-gold-300 group-hover:bg-gold-400 group-hover:text-black group-hover:scale-110 transition-all duration-300 shadow-xl">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-gold-400" />
              <span>{project.project_date}</span>
            </span>
            {project.client_name && (
              <span className="text-neutral-400 truncate max-w-[140px]">{project.client_name}</span>
            )}
          </div>

          <h3 className="text-lg font-serif font-semibold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="mt-2 text-xs text-neutral-400 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Software used pills */}
        {project.software_used && project.software_used.length > 0 && (
          <div className="pt-3 border-t border-neutral-900 flex flex-wrap gap-1.5">
            {project.software_used.map((soft) => (
              <span
                key={soft}
                className="text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
              >
                {soft}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
