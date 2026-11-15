'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  Edit2,
  Search,
  Filter,
  Star,
  Check,
} from 'lucide-react';
import { validateFile, uploadMedia } from '@/lib/storage';
import { getMedia, saveMediaItem, deleteMediaItem } from '@/lib/dataService';
import { formatBytes } from '@/lib/utils';
import { MediaItem } from '@/lib/types';
import Lightbox from '@/components/Lightbox';

interface PendingPhoto {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

const CATEGORIES = [
  'Portrait',
  'Wedding',
  'Nature',
  'Travel',
  'Street',
  'Events',
  'Creative Photography',
];

export default function UploadPhotoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<string>('Portrait');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Existing photos state (Edit & Delete)
  const [existingPhotos, setExistingPhotos] = useState<MediaItem[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingPhoto, setEditingPhoto] = useState<MediaItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load existing photos
  useEffect(() => {
    loadExisting();
  }, []);

  async function loadExisting() {
    setLoadingExisting(true);
    const items = await getMedia();
    setExistingPhotos(items);
    setLoadingExisting(false);
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newItems: PendingPhoto[] = [];

    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file, 'image');
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const title = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      newItems.push({
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl,
        title,
        description: '',
        category: defaultCategory,
        progress: 0,
        status: 'pending',
      });
    });

    setPhotos((prev) => [...prev, ...newItems]);
    setSuccessMessage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePendingPhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updatePendingPhoto = (id: string, updates: Partial<PendingPhoto>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handlePublishAll = async () => {
    if (photos.length === 0) return;
    setIsUploading(true);
    let publishedCount = 0;

    for (const photo of photos) {
      if (photo.status === 'completed') continue;

      updatePendingPhoto(photo.id, { status: 'uploading', progress: 10 });

      try {
        const result = await uploadMedia(photo.file, {
          folder: 'photography',
          compress: true,
          onProgress: (percent) => {
            updatePendingPhoto(photo.id, { progress: percent });
          },
        });

        await saveMediaItem({
          title: photo.title,
          description: photo.description,
          category_name: photo.category,
          media_type: 'image',
          url: result.url,
          storage_path: result.path,
          thumbnail_url: result.url,
          featured: true,
        });

        updatePendingPhoto(photo.id, { status: 'completed', progress: 100 });
        publishedCount++;
      } catch (err) {
        updatePendingPhoto(photo.id, {
          status: 'error',
          error: (err as Error).message,
        });
      }
    }

    setIsUploading(false);
    if (publishedCount > 0) {
      setSuccessMessage(
        `Successfully published ${publishedCount} photo${publishedCount > 1 ? 's' : ''}! Live gallery updated.`
      );
      // Reload existing photos so newly published photos appear below
      await loadExisting();
    }
  };

  // Delete an existing photo
  const handleDeleteExisting = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title || 'this photo'}"? It will be removed from your public portfolio.`)) {
      await deleteMediaItem(id);
      await loadExisting();
    }
  };

  // Toggle Featured flag
  const handleToggleFeatured = async (photo: MediaItem) => {
    await saveMediaItem({
      ...photo,
      featured: !photo.featured,
    });
    await loadExisting();
  };

  // Save edits
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    await saveMediaItem(editingPhoto);
    setEditingPhoto(null);
    await loadExisting();
  };

  // Filter existing photos
  const filteredExisting = existingPhotos.filter((item) => {
    const matchesCat =
      categoryFilter === 'All' ||
      item.category_name?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
          Photo Management &amp; Studio
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Upload, Edit &amp; Manage Photos
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Add new photography stills via drag-and-drop, edit details of existing photos, or delete unwanted items from your portfolio.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-700/80 rounded-sm text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => router.push('/photography')}
            className="px-3 py-1 bg-emerald-500 text-black font-semibold uppercase tracking-wider rounded text-[11px] flex items-center space-x-1"
          >
            <span>View Public Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: ADD / UPLOAD NEW PHOTOS
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-base font-serif font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span>1. Add New Photos</span>
          </h2>
          <span className="text-xs text-neutral-400">Multiple image selection enabled</span>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-gold-400 bg-gold-400/10'
              : 'border-neutral-800 hover:border-gold-500/50 bg-[#0d0d0d]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-gold-400 mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-serif font-semibold text-white">
            Drag &amp; drop photos here, or click to browse computer
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Supports high-resolution JPG, JPEG, PNG, WEBP files.
          </p>

          <div className="mt-4 inline-flex items-center space-x-2 text-xs text-gold-400 font-semibold bg-neutral-900/80 px-4 py-1.5 rounded-full border border-neutral-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automatic in-browser image optimization &amp; thumbnail generation</span>
          </div>
        </div>

        {/* Pending Photos Queue */}
        {photos.length > 0 && (
          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-xs uppercase tracking-wider text-white font-semibold">
                Upload Queue ({photos.length} item{photos.length > 1 ? 's' : ''})
              </h3>
              <button
                onClick={() => setPhotos([])}
                className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
              >
                Clear Queue
              </button>
            </div>

            <div className="space-y-4">
              {photos.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#0a0a0a] border border-neutral-800 rounded-sm flex flex-col md:flex-row gap-4 items-start relative"
                >
                  <div className="relative w-24 h-24 rounded overflow-hidden shrink-0 bg-neutral-950 border border-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 text-neutral-300 px-1 py-0.5 rounded font-mono">
                      {formatBytes(item.file.size)}
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updatePendingPhoto(item.id, { title: e.target.value })}
                        className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => updatePendingPhoto(item.id, { category: e.target.value })}
                        className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Description / Caption
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updatePendingPhoto(item.id, { description: e.target.value })}
                        placeholder="Lighting details, location, camera setup..."
                        className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
                      />
                    </div>

                    {item.status === 'uploading' && (
                      <div className="sm:col-span-2 space-y-1">
                        <div className="flex justify-between text-[10px] text-neutral-400">
                          <span>Uploading...</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold-400 transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {item.status === 'completed' && (
                      <div className="sm:col-span-2 flex items-center space-x-1 text-emerald-400 text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Published to live gallery!</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removePendingPhoto(item.id)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                    title="Remove from queue"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handlePublishAll}
                disabled={isUploading}
                className="px-8 py-3 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.2em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {isUploading ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <span>Publish Queue ({photos.length})</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 2: EDIT & DELETE EXISTING PHOTOS
          ========================================================================= */}
      <section className="space-y-6 pt-6 border-t border-neutral-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
          <h2 className="text-base font-serif font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span>2. Edit &amp; Delete Existing Photos ({existingPhotos.length})</span>
          </h2>
          <span className="text-xs text-neutral-400">
            Click &ldquo;Edit&rdquo; to modify or &ldquo;Delete&rdquo; to remove instantly
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[11px] uppercase tracking-wider px-3 py-1 rounded transition-colors ${
                  categoryFilter === cat
                    ? 'bg-gold-400 text-black font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title..."
              className="w-full bg-[#111] border border-neutral-800 rounded-sm pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-gold-500/60"
            />
          </div>
        </div>

        {/* Existing Photos Grid */}
        {filteredExisting.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExisting.map((item, index) => (
              <div
                key={item.id}
                className="bg-surface-card border border-neutral-800 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-colors"
              >
                {/* Photo Image Preview */}
                <div
                  className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] uppercase font-semibold text-gold-300 bg-black/80 px-2 py-0.5 rounded border border-gold-500/30">
                    {item.category_name}
                  </span>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs uppercase tracking-wider text-white bg-black/70 px-3 py-1 rounded border border-white/20 flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>Preview</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                      {item.description || 'No caption'}
                    </p>
                  </div>

                  {/* Actions: Edit, Delete, Featured */}
                  <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded border flex items-center space-x-1 transition-colors ${
                        item.featured
                          ? 'bg-gold-400/20 text-gold-300 border-gold-400/50'
                          : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:text-neutral-300'
                      }`}
                      title="Toggle Featured on Home Page"
                    >
                      <Star className={`w-3 h-3 ${item.featured ? 'fill-current' : ''}`} />
                      <span>{item.featured ? 'Featured' : 'Regular'}</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setEditingPhoto(item)}
                        className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-gold-400 rounded border border-neutral-800 transition-colors flex items-center space-x-1 text-xs px-2"
                        title="Edit Photo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteExisting(item.id, item.title)}
                        className="p-1.5 bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 rounded border border-neutral-800 hover:border-red-800/60 transition-colors flex items-center space-x-1 text-xs px-2"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-card border border-neutral-800 rounded-sm">
            <p className="text-neutral-400 text-xs">No photos found matching this filter.</p>
          </div>
        )}
      </section>

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e0e0e] border border-gold-500/40 rounded-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-gold-400" />
                <span>Edit Photo Details</span>
              </h3>
              <button
                onClick={() => setEditingPhoto(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="aspect-video w-full rounded overflow-hidden bg-black border border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editingPhoto.url}
                  alt={editingPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, title: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Category *
                </label>
                <select
                  value={editingPhoto.category_name}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, category_name: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Description / Caption
                </label>
                <textarea
                  rows={3}
                  value={editingPhoto.description}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, description: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={editingPhoto.featured}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, featured: e.target.checked })
                  }
                  className="rounded bg-[#141414] border-neutral-700 text-gold-400"
                />
                <label htmlFor="edit-featured" className="text-neutral-300">
                  Feature this photo on the Home page preview
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-400 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-400 text-black font-bold uppercase rounded shadow-gold-glow"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      <Lightbox
        items={filteredExisting}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
        allowDownload={false}
      />
    </div>
  );
}
