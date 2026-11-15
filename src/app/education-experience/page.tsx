'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import { getEducation, getExperience, getProfile } from '@/lib/dataService';
import { Education, Experience, Profile } from '@/lib/types';
import { INITIAL_EDUCATION, INITIAL_EXPERIENCE, INITIAL_PROFILE } from '@/lib/initialData';
import { GraduationCap, Briefcase, Calendar, MapPin, CheckCircle, Award } from 'lucide-react';
import Link from 'next/link';

export default function EducationExperiencePage() {
  const [educationList, setEducationList] = useState<Education[]>(INITIAL_EDUCATION);
  const [experienceList, setExperienceList] = useState<Experience[]>(INITIAL_EXPERIENCE);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);

  useEffect(() => {
    async function loadData() {
      const edu = await getEducation();
      setEducationList(edu);
      const exp = await getExperience();
      setExperienceList(exp);
      const p = await getProfile();
      setProfile(p);
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="Credentials &amp; Milestones"
          title="Education &amp; Experience"
          subtitle="Academic rigor, technical problem-solving capabilities, and real-world professional production history."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column: Education */}
          <div>
            <div className="flex items-center space-x-3 mb-8 pb-3 border-b border-neutral-900">
              <div className="w-8 h-8 rounded-full bg-gold-400/10 border border-gold-400/40 flex items-center justify-center text-gold-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                Academic Background
              </h3>
            </div>

            <div className="space-y-6">
              {educationList.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 bg-surface-card border border-neutral-800 rounded-sm hover:border-gold-500/40 transition-all relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold-400">
                        {edu.field_of_study}
                      </span>
                      <h4 className="text-lg font-serif font-bold text-white mt-1">
                        {edu.degree}
                      </h4>
                      <p className="text-xs text-neutral-300 mt-1">{edu.institution}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-3 py-1 bg-gold-400 text-black font-bold text-xs rounded-sm shadow-gold-glow">
                        {edu.score}
                      </span>
                      {edu.start_year && (
                        <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                          {edu.start_year} – {edu.end_year || 'Present'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Experience */}
          <div>
            <div className="flex items-center space-x-3 mb-8 pb-3 border-b border-neutral-900">
              <div className="w-8 h-8 rounded-full bg-gold-400/10 border border-gold-400/40 flex items-center justify-center text-gold-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                Production Experience
              </h3>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-800">
              {experienceList.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[#0a0a0a] border-2 border-gold-400 group-hover:scale-125 transition-transform" />

                  <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm group-hover:border-gold-500/40 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h4 className="text-base font-serif font-bold text-white group-hover:text-gold-300 transition-colors">
                        {exp.role}
                      </h4>
                      <span className="text-[11px] font-mono text-gold-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-neutral-400 mb-3">
                      <span className="font-medium text-neutral-300">{exp.company}</span>
                      {exp.location && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills & Software Matrix */}
        <div className="p-8 sm:p-12 bg-neutral-950 border border-neutral-900 rounded-sm">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              Skill Alignment
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
              Capabilities &amp; Workflow Competencies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { title: 'Video Editing', desc: 'Narrative cutting, multi-cam synchronization, rhythm and emotional pacing.' },
              { title: 'Cinematography', desc: 'Framing, focal length selection, camera stabilization and organic hand-held motion.' },
              { title: 'Color Grading', desc: 'DaVinci Resolve node structures, look replication, ACES pipeline, skin tone balance.' },
              { title: 'Camera Operation', desc: 'Cinema camera builds, follow focus pulls, wireless video transmission.' },
              { title: 'VFX & Compositing', desc: 'Nuke node compositing, rotoscoping, clean-plates, multi-pass 3D integration.' },
              { title: 'Cyber Security & Systems', desc: 'Data integrity, secure asset archiving, backup redundancy, technical engineering.' },
            ].map((skill) => (
              <div key={skill.title} className="p-4 bg-[#0a0a0a] border border-neutral-800/80 rounded-sm">
                <div className="flex items-center space-x-2 text-gold-400 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <h4 className="text-sm font-semibold text-white">{skill.title}</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{skill.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gold-400 text-black text-xs uppercase tracking-[0.2em] font-bold rounded-sm shadow-gold-glow hover:bg-gold-300 transition-all"
            >
              <span>Discuss Project Availability</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
