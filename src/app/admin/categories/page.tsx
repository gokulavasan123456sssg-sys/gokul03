'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { getCategories, saveCategory } from '@/lib/dataService';
import { Category } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/initialData';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'video' | 'photo' | 'vfx'>('video');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    loadCats();
  }, []);

  async function loadCats() {
    const list = await getCategories();
    setCategories(list);
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await saveCategory({
      name: newCatName.trim(),
      type: newCatType,
    });
    setNewCatName('');
    await loadCats();
  };

  const handleUpdate = async (cat: Category) => {
    if (!editingName.trim()) return;
    await saveCategory({
      ...cat,
      name: editingName.trim(),
    });
    setEditingId(null);
    await loadCats();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
          Taxonomy &amp; Organization
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Manage Categories
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Create and organize categories for video editing, cinematography, photography stills, and VFX breakdowns.
        </p>
      </div>

      {/* Add Category Form */}
      <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm">
        <h3 className="text-sm uppercase tracking-wider text-white font-semibold mb-4">
          Add New Category
        </h3>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name (e.g. Drone Films, Commercial Stills)"
            className="flex-1 bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
          />
          <select
            value={newCatType}
            onChange={(e) => setNewCatType(e.target.value as 'video' | 'photo' | 'vfx')}
            className="bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2 text-xs text-white focus:outline-none focus:border-gold-500/60"
          >
            <option value="video">Video Category</option>
            <option value="photo">Photo Category</option>
            <option value="vfx">VFX Category</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-wider font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Categories by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Categories */}
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
          <h3 className="text-sm font-serif font-bold text-white border-b border-neutral-800 pb-2 flex items-center justify-between">
            <span>Video Categories</span>
            <span className="text-[10px] text-gold-400 uppercase font-mono">
              {categories.filter((c) => c.type === 'video').length} items
            </span>
          </h3>
          <div className="space-y-2">
            {categories
              .filter((c) => c.type === 'video')
              .map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 bg-[#121212] rounded border border-neutral-800 text-xs"
                >
                  {editingId === cat.id ? (
                    <div className="flex items-center space-x-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full bg-black border border-gold-400 rounded px-2 py-1 text-xs text-white"
                      />
                      <button
                        onClick={() => handleUpdate(cat)}
                        className="text-emerald-400 p-1 hover:bg-neutral-800 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-neutral-500 p-1 hover:bg-neutral-800 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-white">{cat.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditingName(cat.name);
                          }}
                          className="text-neutral-400 hover:text-gold-400 p-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Photo Categories */}
        <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
          <h3 className="text-sm font-serif font-bold text-white border-b border-neutral-800 pb-2 flex items-center justify-between">
            <span>Photo Categories</span>
            <span className="text-[10px] text-gold-400 uppercase font-mono">
              {categories.filter((c) => c.type === 'photo').length} items
            </span>
          </h3>
          <div className="space-y-2">
            {categories
              .filter((c) => c.type === 'photo')
              .map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 bg-[#121212] rounded border border-neutral-800 text-xs"
                >
                  {editingId === cat.id ? (
                    <div className="flex items-center space-x-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full bg-black border border-gold-400 rounded px-2 py-1 text-xs text-white"
                      />
                      <button
                        onClick={() => handleUpdate(cat)}
                        className="text-emerald-400 p-1 hover:bg-neutral-800 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-neutral-500 p-1 hover:bg-neutral-800 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-white">{cat.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditingName(cat.name);
                          }}
                          className="text-neutral-400 hover:text-gold-400 p-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
