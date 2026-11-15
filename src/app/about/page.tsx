'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Film, Camera, Layers, CheckCircle2, GraduationCap, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { getProfile, getEducation, getExperience } from '@/lib/dataService';
import { Profile, Education, Experience } from '@/lib/types';
import { INITIAL_PROFILE, INITIAL_EDUCATION, INITIAL_EXPERIENCE } from '@/lib/initialData';

export default function AboutPage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [educationList, setEducationList] = useState<Education[]>(INITIAL_EDUCATION);
  const [experienceList, setExperienceList] = useState<Experience[]>(INITIAL_EXPERIENCE);

  useEffect(() => {
    async function loadData() {
      const p = await getProfile();
      setProfile(p);
      const edu = await getEducation();
      setEducationList(edu);
      const exp = await getExperience();
      setExperienceList(exp);
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <SectionHeader
          badge="Biography &amp; Philosophy"
          title="About Gokulavasan"
          subtitle="Visual artist dedicated to cinematic aesthetics, narrative pacing, and technical perfection."
        />

        {/* Hero Grid: Portrait & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Portrait Collage */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-sm overflow-hidden border border-neutral-800 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url || '/images/gokul-portrait.jpg'}
                alt="Gokulavasan"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-card border border-neutral-800 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-semibold">
                  Location
                </p>
                <p className="text-sm font-semibold text-white mt-1">Tamil Nadu, India</p>
              </div>
              <div className="p-4 bg-surface-card border border-neutral-800 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold-400 font-semibold">
                  Availability
                </p>
                <p className="text-sm font-semibold text-emerald-400 mt-1">Open for Projects</p>
              </div>
            </div>
          </div>

          {/* Narrative Story */}
          <div className="lg:col-span-7 space-y-6 text-neutral-300 text-sm sm:text-base leading-relaxed">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              &ldquo;Visual storytelling is the art of translating unsaid emotions into light and rhythm.&rdquo;
            </h3>

            <p>
              Hello, I am Gokulavasan. My journey in visual media combines artistic sensibility with rigorous technical discipline. Having trained both in engineering problem-solving and cinematic art, I approach every project with a dual mindset: absolute creative intentionality paired with meticulous technical craft.
            </p>

            <p>
              Whether it is choreographing fluid camera movement on an anamorphic cinema rig, curating a bespoke LUT in DaVinci Resolve, or cutting a fast-paced narrative sequence in Premiere Pro, my goal is always to immerse the viewer into an unforgettable world.
            </p>

            <p>
              My expertise spans cinematography, editorial direction, color grading, and VFX compositing across Autodesk Maya and Foundry Nuke, enabling full-spectrum visual execution from initial concept through final delivery.
            </p>

            {/* Core Pillars */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-sm">
                <Film className="w-5 h-5 text-gold-400 mb-2" />
                <h4 className="text-white font-semibold text-sm">Cinematography &amp; Lighting</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Crafting mood, depth, and texture using cinematic lighting schemes and dynamic lens choices.
                </p>
              </div>

              <div className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-sm">
                <Camera className="w-5 h-5 text-gold-400 mb-2" />
                <h4 className="text-white font-semibold text-sm">Editorial &amp; Pacing</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Sculpting story tempo, sound cues, and seamless visual transitions that engage the audience.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                href="/contact"
                className="px-6 py-3 bg-gold-400 text-black text-xs uppercase tracking-[0.2em] font-bold rounded-sm shadow-gold-glow hover:bg-gold-300 transition-all"
              >
                Let&apos;s Work Together
              </Link>
              <Link
                href="/education-experience"
                className="px-6 py-3 bg-neutral-900 border border-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm hover:border-gold-400/50 transition-all"
              >
                View Qualifications
              </Link>
            </div>
          </div>
        </div>

        {/* Education & Academic Foundation */}
        <div className="pt-16 border-t border-neutral-900 mb-24">
          <SectionHeader
            badge="Academic Foundation"
            title="Education"
            subtitle="Technical discipline and analytical thinking applied to digital arts and systems."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {educationList.map((edu) => (
              <div
                key={edu.id}
                className="p-6 bg-surface-card border border-neutral-800 rounded-sm hover:border-gold-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">{edu.degree}</h4>
                      <p className="text-xs text-gold-400 font-medium">{edu.field_of_study}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-black bg-gold-400 px-2.5 py-0.5 rounded">
                    {edu.score}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-4 font-medium">{edu.institution}</p>
                {edu.start_year && (
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {edu.start_year} — {edu.end_year || 'Present'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Software Suite Showcase */}
        <div className="pt-16 border-t border-neutral-900">
          <SectionHeader
            badge="Arsenal"
            title="Software &amp; Digital Suite"
            subtitle="Mastered software tools powering high-end post-production."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {[
              {
                name: 'Adobe Premiere Pro',
                level: 'Mastery',
                desc: 'Narrative cutting, multi-cam editing, commercial sync',
              },
              {
                name: 'After Effects',
                level: 'Advanced',
                desc: 'Motion graphics, visual effects, tracking, titles',
              },
              {
                name: 'DaVinci Resolve',
                level: 'Mastery',
                desc: 'Color grading, look dev, ACES color management',
              },
              {
                name: 'Autodesk Maya',
                level: 'Proficient',
                desc: '3D modeling, lighting setup, animation',
              },
              {
                name: 'Foundry Nuke',
                level: 'Proficient',
                desc: 'Node-based compositing, rotoscoping, keying',
              },
            ].map((tool) => (
              <div
                key={tool.name}
                className="p-5 bg-[#0a0a0a] border border-neutral-800 rounded-sm hover:border-gold-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">
                    {tool.level}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">{tool.name}</h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
