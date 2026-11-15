'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Film, Camera, Sparkles, Play, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import CinematicHero from '@/components/CinematicHero';
import SectionHeader from '@/components/SectionHeader';
import ProjectCard from '@/components/ProjectCard';
import PhotoCard from '@/components/PhotoCard';
import VideoModal from '@/components/VideoModal';
import Lightbox from '@/components/Lightbox';
import { getProfile, getProjects, getMedia } from '@/lib/dataService';
import { Profile, Project, MediaItem } from '@/lib/types';
import { INITIAL_PROFILE } from '@/lib/initialData';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredPhotos, setFeaturedPhotos] = useState<MediaItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const p = await getProfile();
      setProfile(p);

      const projs = await getProjects({ featuredOnly: true });
      setFeaturedProjects(projs.slice(0, 4));

      const photos = await getMedia({ featuredOnly: true });
      setFeaturedPhotos(photos.slice(0, 6));
    }
    loadData();
  }, []);

  return (
    <div className="bg-background">
      {/* 1. Full Screen Cinematic Hero */}
      <CinematicHero profile={profile} />

      {/* 2. About Intro Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Portrait Image with Golden Border Accent */}
          <div className="lg:col-span-5 relative group">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-sm border border-neutral-800 group-hover:border-gold-500/50 transition-colors shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url || '/images/gokul-portrait.jpg'}
                alt="Gokulavasan Portrait"
                className="w-full h-auto object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>

            {/* Experience Card Floating Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-surface-card border border-gold-500/40 p-4 rounded-sm shadow-gold-glow backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-bold">
                Specialization
              </p>
              <p className="text-sm font-serif font-semibold text-white mt-0.5">
                Cinematography &amp; Editorial
              </p>
            </div>
          </div>

          {/* About Text Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400">
                Visual Identity
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Crafting visual rhythm, atmosphere, and raw emotion.
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              I am Gokulavasan, a filmmaker, video editor, and cinematographer driven by the art of cinematic storytelling. From capturing golden hour shadows on prime cinema glass to crafting rhythmic soundscapes and color grades in post-production, every frame is treated as a piece of visual poetry.
            </p>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              With deep technical expertise across industry-grade toolsets—including DaVinci Resolve, Premiere Pro, Autodesk Maya, and Nuke—I bridge the gap between creative visual intuition and high-end technical execution.
            </p>

            {/* Discipline tags */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Cinematic Films',
                'Wedding Films',
                'Short Films',
                'Color Grading',
                'VFX Compositing',
                'Editorial Direction',
              ].map((item) => (
                <div key={item} className="flex items-center space-x-2 text-xs text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-bold text-gold-400 hover:text-white transition-colors"
              >
                <span>Read Full Biography</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Video Projects Showcase */}
      <section className="py-24 bg-[#080808] border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <SectionHeader
              badge="Selected Works"
              title="Featured Films & Projects"
              subtitle="Explore narrative films, commercial advertisements, and editorial highlights crafted for dynamic storytelling."
            />
            <Link
              href="/video-editing"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400 hover:text-gold-400 transition-colors mb-6 md:mb-12"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPlay={(proj) => setActiveVideo(proj)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Photography Gallery Preview */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            badge="Still Frames"
            title="Featured Photography"
            subtitle="Curated collection of portraits, weddings, landscapes, and creative optical stills captured in natural light."
          />
          <Link
            href="/photography"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400 hover:text-gold-400 transition-colors mb-6 md:mb-12"
          >
            <span>Explore Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {featuredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              item={photo}
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* 5. Software & Toolset Proficiency Grid */}
      <section className="py-20 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Technical Mastery"
            title="Industry Software Suite"
            subtitle="Equipped with post-production and 3D pipelines to bring complex visual ideas from imagination into reality."
            centered
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto mt-8">
            {[
              { name: 'Adobe Premiere Pro', role: 'Editorial Pacing & Cut' },
              { name: 'After Effects', role: 'Motion Design & VFX' },
              { name: 'DaVinci Resolve', role: 'Color Science & LUTs' },
              { name: 'Autodesk Maya', role: '3D Modeling & Lighting' },
              { name: 'Foundry Nuke', role: 'Node Compositing' },
            ].map((tool) => (
              <div
                key={tool.name}
                className="p-5 bg-[#0a0a0a] border border-neutral-800/80 rounded-sm hover:border-gold-500/50 transition-all hover:-translate-y-1"
              >
                <div className="w-2 h-2 rounded-full bg-gold-400 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-white">{tool.name}</h4>
                <p className="text-[11px] text-neutral-400 mt-1">{tool.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="py-24 relative overflow-hidden bg-black text-center border-t border-neutral-900">
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Start A Conversation
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-3">
            Have a project in mind? Let&apos;s create something timeless.
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Available for narrative films, wedding cinematography, commercial advertisements, and creative collaborations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.2em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all"
            >
              Get In Touch
            </Link>
            <Link
              href="/education-experience"
              className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs uppercase tracking-[0.2em] font-semibold rounded-sm transition-all"
            >
              View Experience
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.video_url || ''}
        title={activeVideo?.title || 'Project Playback'}
      />

      {/* Lightbox Viewer */}
      <Lightbox
        items={featuredPhotos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
