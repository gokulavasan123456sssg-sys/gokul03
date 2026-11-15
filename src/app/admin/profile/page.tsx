'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, Save, Image as ImageIcon, Sparkles } from 'lucide-react';
import { getProfile, updateProfile } from '@/lib/dataService';
import { Profile } from '@/lib/types';
import { INITIAL_PROFILE } from '@/lib/initialData';
import { uploadMedia } from '@/lib/storage';

export default function ManageProfilePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [softwareInput, setSoftwareInput] = useState('');

  useEffect(() => {
    async function load() {
      const p = await getProfile();
      setProfile(p);
      setSoftwareInput(p.software?.join(', ') || '');
    }
    load();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadMedia(file, { folder: 'avatar', compress: true });
      setProfile({ ...profile, avatar_url: res.url });
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    const softwareArray = softwareInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await updateProfile({
      ...profile,
      software: softwareArray,
    });

    setIsSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
          Identity &amp; Biography
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Manage Profile Information
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Update your public artist profile, headline, biography, showreel link, and social channels.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-700/80 rounded-sm text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile changes saved successfully! Live website has been updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar & Basic Info */}
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-6">
          <h3 className="text-sm uppercase tracking-wider text-white font-semibold border-b border-neutral-800 pb-2">
            Artist Portrait &amp; Core Info
          </h3>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gold-400 shrink-0 bg-neutral-900 shadow-gold-glow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar_url || '/images/gokul-portrait.jpg'}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 flex-1">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                Change Portrait Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload-input"
              />
              <label
                htmlFor="avatar-upload-input"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-900 border border-neutral-700 hover:border-gold-400 text-xs uppercase tracking-wider text-white font-semibold rounded cursor-pointer transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-gold-400" />
                <span>Select New Portrait</span>
              </label>
              <p className="text-[11px] text-neutral-400">
                Recommended: High-resolution close-up portrait in square aspect ratio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Headline / Title
              </label>
              <input
                type="text"
                required
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Tagline / Quote
            </label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              About Bio Narrative
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-[#121212] border border-neutral-800 rounded-sm p-4 text-xs text-white focus:outline-none focus:border-gold-500/60 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Showreel Video Link (YouTube / Vimeo)
            </label>
            <input
              type="url"
              value={profile.showreel_url}
              onChange={(e) => setProfile({ ...profile, showreel_url: e.target.value })}
              className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Software Suite (Comma-separated)
            </label>
            <input
              type="text"
              value={softwareInput}
              onChange={(e) => setSoftwareInput(e.target.value)}
              placeholder="Adobe Premiere Pro, After Effects, DaVinci Resolve, Autodesk Maya, Nuke"
              className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
            />
          </div>
        </div>

        {/* Contact & Social Channels */}
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-5">
          <h3 className="text-sm uppercase tracking-wider text-white font-semibold border-b border-neutral-800 pb-2">
            Social Media &amp; Contacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="e.g. gokulavasan.visuals@gmail.com"
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="e.g. Tamil Nadu, India"
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={profile.social_youtube}
                onChange={(e) => setProfile({ ...profile, social_youtube: e.target.value })}
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={profile.social_instagram}
                onChange={(e) => setProfile({ ...profile, social_instagram: e.target.value })}
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.social_linkedin}
                onChange={(e) => setProfile({ ...profile, social_linkedin: e.target.value })}
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.22em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
