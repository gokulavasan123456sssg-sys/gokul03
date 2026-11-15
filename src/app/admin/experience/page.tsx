'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Edit2, Check, X, MapPin } from 'lucide-react';
import { getExperience, saveExperience, deleteExperience } from '@/lib/dataService';
import { Experience } from '@/lib/types';
import { INITIAL_EXPERIENCE } from '@/lib/initialData';

export default function ManageExperiencePage() {
  const [experienceList, setExperienceList] = useState<Experience[]>(INITIAL_EXPERIENCE);
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [editingItem, setEditingItem] = useState<Experience | null>(null);

  useEffect(() => {
    loadExp();
  }, []);

  async function loadExp() {
    const list = await getExperience();
    setExperienceList(list);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !company) return;

    await saveExperience({
      role,
      company,
      location,
      start_date: startDate,
      end_date: endDate,
      is_current: isCurrent,
      description,
    });

    setRole('');
    setCompany('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDescription('');
    await loadExp();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    await saveExperience(editingItem);
    setEditingItem(null);
    await loadExp();
  };

  const handleDelete = async (id: string, roleName: string) => {
    if (confirm(`Delete experience: "${roleName}"?`)) {
      await deleteExperience(id);
      await loadExp();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
          Career Trajectory
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Manage Experience
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Add or edit production milestones, client commissions, and cinematography positions.
        </p>
      </div>

      {/* Add Experience Form */}
      <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-white font-semibold border-b border-neutral-800 pb-2">
          Add Production Role
        </h3>

        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">Role Title *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead Cinematographer"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                Production / Studio *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Independent Studio"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chennai / Coimbatore"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">Start Date</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. 2023"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">End Date</label>
              <input
                type="text"
                disabled={isCurrent}
                value={isCurrent ? 'Present' : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="e.g. Present"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is-current-role"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="rounded bg-[#121212] border-neutral-700 text-gold-400"
            />
            <label htmlFor="is-current-role" className="text-neutral-300">
              This is my current ongoing role
            </label>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-semibold uppercase">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsibilities, cameras operated, post pipelines managed..."
              className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-wider font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </form>
      </div>

      {/* Existing Experience List */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-white font-semibold">
          Current Roles ({experienceList.length})
        </h3>

        <div className="space-y-3">
          {experienceList.map((exp) => (
            <div
              key={exp.id}
              className="p-5 bg-surface-card border border-neutral-800 rounded-sm flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-white">{exp.role}</h4>
                  <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-gold-400 font-mono px-2 py-0.5 rounded">
                    {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-neutral-400 mt-1">
                  <span className="text-neutral-300 font-medium">{exp.company}</span>
                  {exp.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{exp.description}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setEditingItem(exp)}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-gold-400 rounded border border-neutral-800"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id, exp.role)}
                  className="p-1.5 bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 rounded border border-neutral-800"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e0e0e] border border-gold-500/40 rounded-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-white border-b border-neutral-800 pb-2">
              Edit Experience Role
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Role</label>
                <input
                  type="text"
                  required
                  value={editingItem.role}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Company</label>
                <input
                  type="text"
                  required
                  value={editingItem.company}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-400 text-black font-bold uppercase rounded shadow-gold-glow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
