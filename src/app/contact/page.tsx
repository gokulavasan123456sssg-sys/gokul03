'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import { getProfile } from '@/lib/dataService';
import { Profile } from '@/lib/types';
import { INITIAL_PROFILE } from '@/lib/initialData';
import { Mail, Phone, MapPin, Send, CheckCircle2, Youtube, Instagram, Linkedin, Film } from 'lucide-react';

export default function ContactPage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Cinematic Film',
    timeline: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      const p = await getProfile();
      setProfile(p);
    }
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending inquiry
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="pt-28 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="Inquiries &amp; Bookings"
          title="Let's Bring Your Vision To Life"
          subtitle="Available for cinematography, narrative editing, wedding films, commercial campaigns, and post-production consultations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact & Socials */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-surface-card border border-neutral-800 rounded-sm space-y-6">
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                Direct Contact
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${profile.email || 'gokulavasan.visuals@gmail.com'}`}
                      className="text-white hover:text-gold-400 transition-colors font-medium"
                    >
                      {profile.email || 'gokulavasan.visuals@gmail.com'}
                    </a>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                        Phone / WhatsApp
                      </p>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-white hover:text-gold-400 transition-colors font-medium"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                      Base Location
                    </p>
                    <p className="text-white font-medium">{profile.location || 'Tamil Nadu, India'}</p>
                    <p className="text-xs text-neutral-400">Available for domestic and international travel</p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-6 border-t border-neutral-800">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold mb-4">
                  Follow &amp; Connect
                </p>
                <div className="flex items-center space-x-3">
                  <a
                    href={profile.social_youtube || 'https://youtube.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href={profile.social_instagram || 'https://instagram.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={profile.social_linkedin || 'https://linkedin.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Turnaround Commitment Card */}
            <div className="p-6 bg-neutral-950 border border-neutral-800/80 rounded-sm">
              <div className="flex items-center space-x-2 text-gold-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs uppercase tracking-[0.18em] font-bold text-white">
                  Quick Response Time
                </h4>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Project inquiries receive an initial technical and schedule response within 24 to 48 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-surface-card border border-neutral-800 rounded-sm shadow-2xl relative">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-gold-400/20 border border-gold-400 flex items-center justify-center text-gold-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}! Your message has been noted. Gokulavasan will review your project requirements and be in touch promptly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        projectType: 'Cinematic Film',
                        timeline: '',
                        message: '',
                      });
                    }}
                    className="mt-6 px-6 py-2.5 bg-neutral-900 border border-neutral-700 text-xs uppercase tracking-wider text-white hover:border-gold-400 rounded-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-white border-b border-neutral-800 pb-4">
                    Send Project Brief
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. client@example.com"
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                        Project Category
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500/60"
                      >
                        <option value="Cinematic Film">Cinematic Film</option>
                        <option value="Wedding Film">Wedding Film</option>
                        <option value="Short Film Editorial">Short Film Editorial</option>
                        <option value="Commercial Advertisement">Commercial Advertisement</option>
                        <option value="Color Grading (DaVinci)">Color Grading (DaVinci)</option>
                        <option value="VFX & 3D Compositing">VFX &amp; 3D Compositing</option>
                        <option value="Photography Session">Photography Session</option>
                        <option value="Other Collaboration">Other Collaboration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                        Estimated Date / Timeline
                      </label>
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="e.g. Next Month / Immediate"
                        className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                      Project Details &amp; Vision *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe the story, scope, deliverables, references, or specific requirements..."
                      className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-sm p-4 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.22em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
