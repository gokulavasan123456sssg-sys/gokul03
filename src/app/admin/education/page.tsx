'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Edit2, Check, X, CheckCircle2 } from 'lucide-react';
import { getEducation, saveEducation, deleteEducation } from '@/lib/dataService';
import { Education } from '@/lib/types';
import { INITIAL_EDUCATION } from '@/lib/initialData';

export default function ManageEducationPage() {
  const [educationList, setEducationList] = useState<Education[]>(INITIAL_EDUCATION);
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [institution, setInstitution] = useState('');
  const [score, setScore] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [editingItem, setEditingItem] = useState<Education | null>(null);

  useEffect(() => {
    loadEdu();
  }, []);

  async function loadEdu() {
    const list = await getEducation();
    setEducationList(list);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree || !institution) return;

    await saveEducation({
      degree,
      field_of_study: fieldOfStudy,
      institution,
      score,
      start_year: startYear,
      end_year: endYear,
    });

    setDegree('');
    setFieldOfStudy('');
    setInstitution('');
    setScore('');
    setStartYear('');
    setEndYear('');
    await loadEdu();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    await saveEducation(editingItem);
    setEditingItem(null);
    await loadEdu();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete education item: "${name}"?`)) {
      await deleteEducation(id);
      await loadEdu();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
          Academic Qualifications
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Manage Education
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Add or edit degrees, polytechnic diplomas, institutions, and scores displayed on your portfolio.
        </p>
      </div>

      {/* Add Education Form */}
      <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-white font-semibold border-b border-neutral-800 pb-2">
          Add Qualification
        </h3>

        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">Degree *</label>
              <input
                type="text"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Bachelor of Engineering"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                Field of Study
              </label>
              <input
                type="text"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Cyber Security"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                Institution *
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. SRM Valliammai Engineering College"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">Score / %</label>
              <input
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 74%"
                className="w-full bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold uppercase">Duration</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="2022"
                  className="w-1/2 bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
                />
                <input
                  type="text"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  placeholder="2025"
                  className="w-1/2 bg-[#121212] border border-neutral-800 rounded p-2.5 text-white focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-wider font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Qualification</span>
          </button>
        </form>
      </div>

      {/* Existing Education List */}
      <div className="space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-white font-semibold">
          Current Qualifications ({educationList.length})
        </h3>

        <div className="space-y-3">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="p-5 bg-surface-card border border-neutral-800 rounded-sm flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-semibold text-white">{edu.degree}</h4>
                  <span className="text-[10px] bg-gold-400 text-black font-bold px-2 py-0.5 rounded">
                    {edu.score}
                  </span>
                </div>
                <p className="text-xs text-gold-400 mt-0.5">{edu.field_of_study}</p>
                <p className="text-xs text-neutral-400 mt-1">{edu.institution}</p>
                {edu.start_year && (
                  <p className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                    {edu.start_year} – {edu.end_year || 'Present'}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingItem(edu)}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-gold-400 rounded border border-neutral-800"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id, edu.degree)}
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
              Edit Qualification
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Degree</label>
                <input
                  type="text"
                  required
                  value={editingItem.degree}
                  onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={editingItem.field_of_study}
                  onChange={(e) => setEditingItem({ ...editingItem, field_of_study: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Institution
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.institution}
                  onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">Score</label>
                <input
                  type="text"
                  value={editingItem.score}
                  onChange={(e) => setEditingItem({ ...editingItem, score: e.target.value })}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
