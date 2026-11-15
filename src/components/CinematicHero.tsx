'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Instagram, Youtube, Linkedin, Volume2, VolumeX, Sparkles, Film, Camera } from 'lucide-react';
import VideoModal from './VideoModal';
import { Profile } from '@/lib/types';

interface CinematicHeroProps {
  profile: Profile;
}

export default function CinematicHero({ profile }: CinematicHeroProps) {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white pt-24 pb-16">
      {/* Background Cinematic Video / Ambient Canvas */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-35 filter brightness-75 contrast-125"
          poster="/images/gokul-portrait.jpg"
        >
          {/* High quality cinematic royalty-free atmospheric background video */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-cinematographer-adjusting-a-camera-lens-41481-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

        {/* Subtle golden atmospheric dust glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold-400/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Portrait Badge & Status */}
        <div className="mb-6 flex items-center space-x-3 bg-neutral-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/30 shadow-gold-glow animate-fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar_url || '/images/gokul-portrait.jpg'}
            alt="Gokulavasan"
            className="w-8 h-8 rounded-full object-cover border border-gold-400"
          />
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-200">
            Filmmaker &amp; Visual Artist
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Available for projects" />
        </div>

        {/* Primary Name */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-[0.18em] uppercase text-white drop-shadow-2xl">
          <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
            {profile.full_name}
          </span>
        </h1>

        {/* Sub-headline */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-gold-400 uppercase">
          <span>Video Editor</span>
          <span className="text-neutral-600">•</span>
          <span>Cinematographer</span>
          <span className="text-neutral-600">•</span>
          <span>Photographer</span>
        </div>

        {/* Quote / Tagline */}
        <blockquote className="mt-6 text-base sm:text-xl md:text-2xl font-serif italic text-neutral-300 max-w-2xl font-light">
          &ldquo;{profile.tagline}&rdquo;
        </blockquote>

        {/* Call to action buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Play Showreel */}
          <button
            onClick={() => setShowreelOpen(true)}
            className="group px-7 py-3.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.22em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center space-x-3"
          >
            <div className="w-5 h-5 rounded-full bg-black/80 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-3 h-3 fill-current translate-x-0.5" />
            </div>
            <span>Watch Showreel</span>
          </button>

          {/* Explore Projects */}
          <Link
            href="/video-editing"
            className="px-7 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700 hover:border-gold-400/60 text-xs uppercase tracking-[0.22em] font-semibold rounded-sm transition-all flex items-center space-x-2"
          >
            <span>Explore Works</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
        </div>

        {/* Social Links & Ambient Controls */}
        <div className="mt-14 flex items-center space-x-6 text-neutral-400">
          <a
            href={profile.social_youtube || 'https://youtube.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-400 transition-colors p-1"
            title="YouTube Channel"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href={profile.social_instagram || 'https://instagram.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-400 transition-colors p-1"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href={profile.social_linkedin || 'https://linkedin.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-400 transition-colors p-1"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <div className="h-4 w-[1px] bg-neutral-800" />
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-xs tracking-wider flex items-center space-x-1 hover:text-white transition-colors"
            title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-gold-400" />}
            <span className="hidden sm:inline text-[11px] uppercase tracking-widest text-neutral-500">
              {isMuted ? 'Sound Off' : 'Sound On'}
            </span>
          </button>
        </div>
      </div>

      {/* Showreel Modal */}
      <VideoModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        videoUrl={profile.showreel_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
        title="Gokulavasan – Filmmaking &amp; Editing Showreel"
      />
    </section>
  );
}
