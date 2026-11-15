'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Video,
  Youtube,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Sparkles,
  Trash2,
  Edit2,
  Search,
  Star,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { validateFile, uploadMedia, generateVideoThumbnail } from '@/lib/storage';
import { getAllProjectsAdmin, saveProject, deleteProject } from '@/lib/dataService';
import { getYouTubeThumbnail, parseVideoUrl, formatBytes } from '@/lib/utils';
import { Project } from '@/lib/types';
import VideoModal from '@/components/VideoModal';

const VIDEO_CATEGORIES = [
  'Cinematic Films',
  'Wedding Films',
  'Short Films',
  'YouTube Projects',
  'Promotional Videos',
  'Instagram Reels',
  'Freelance Projects',
  'VFX & 3D Breakdown',
];

const SOFTWARE_OPTIONS = [
  'Adobe Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Autodesk Maya',
  'Nuke',
];

export default function UploadVideoPage() {
  const router = useRouter();
  const [sourceType, setSourceType] = useState<'youtube' | 'file'>('youtube');

  // Video metadata for adding
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cinematic Films');
  const [videoUrl, setVideoUrl] = useState('');
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([
    'Adobe Premiere Pro',
    'DaVinci Resolve',
  ]);
  const [featured, setFeatured] = useState(true);

  // File uploads
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // Status for adding
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Existing Projects state (Edit & Delete)
  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    loadExistingProjects();
  }, []);

  async function loadExistingProjects() {
    setLoadingExisting(true);
    const list = await getAllProjectsAdmin();
    setExistingProjects(list);
    setLoadingExisting(false);
  }

  // Handle YouTube input change - automatically extract maxres thumbnail!
  const handleUrlChange = (val: string) => {
    setVideoUrl(val);
    const autoThumb = getYouTubeThumbnail(val);
    if (autoThumb && !thumbnailPreview) {
      setThumbnailPreview(autoThumb);
    }
  };

  // Handle local video selection
  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 'video');
    if (!validation.valid) {
      setError(validation.error || 'Invalid video file');
      return;
    }

    setVideoFile(file);
    setError(null);
    if (!title) {
      setTitle(
        file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      );
    }

    try {
      const generatedThumb = await generateVideoThumbnail(file);
      if (generatedThumb && !thumbnailPreview) {
        setThumbnailPreview(generatedThumb);
      }
    } catch (e) {
      console.warn('Auto thumbnail generation fallback:', e);
    }
  };

  // Handle custom thumbnail selection
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 'image');
    if (!validation.valid) {
      setError(validation.error || 'Invalid thumbnail');
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const toggleSoftware = (soft: string) => {
    setSelectedSoftware((prev) =>
      prev.includes(soft) ? prev.filter((s) => s !== soft) : [...prev, soft]
    );
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPublishing(true);
    setUploadProgress(10);

    try {
      let finalVideoUrl = videoUrl;
      let finalThumbnailUrl = thumbnailPreview || '/images/gokul-portrait.jpg';

      // 1. If uploading direct video file
      if (sourceType === 'file' && videoFile) {
        setStatusMessage('Uploading video to cloud storage...');
        const videoResult = await uploadMedia(videoFile, {
          folder: 'videos',
          onProgress: (p) => setUploadProgress(Math.round(p * 0.7)),
        });
        finalVideoUrl = videoResult.url;
      }

      // 2. If uploading custom thumbnail file
      if (thumbnailFile) {
        setStatusMessage('Uploading custom thumbnail...');
        const thumbResult = await uploadMedia(thumbnailFile, {
          folder: 'thumbnails',
          compress: true,
          onProgress: (p) => setUploadProgress(70 + Math.round(p * 0.2)),
        });
        finalThumbnailUrl = thumbResult.url;
      }

      setUploadProgress(95);
      setStatusMessage('Registering project in database...');

      const projectType = category === 'VFX & 3D Breakdown' ? 'vfx' : 'video';
      await saveProject({
        title,
        description,
        category_name: category,
        type: projectType,
        thumbnail_url: finalThumbnailUrl,
        video_url: finalVideoUrl,
        video_source: sourceType === 'youtube' ? 'youtube' : 'upload',
        software_used: selectedSoftware,
        project_date: projectDate,
        client_name: clientName,
        featured,
        published: true,
      });

      setUploadProgress(100);
      setIsPublishing(false);
      setStatusMessage('Project published successfully! Live website updated.');

      // Clear input fields
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setVideoFile(null);
      setThumbnailFile(null);
      setThumbnailPreview('');

      // Refresh existing list
      await loadExistingProjects();
    } catch (err) {
      setIsPublishing(false);
      setError((err as Error).message);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string, projectTitle: string) => {
    if (confirm(`Delete project "${projectTitle}"? It will be removed from your website.`)) {
      await deleteProject(id);
      await loadExistingProjects();
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (project: Project) => {
    await saveProject({
      ...project,
      featured: !project.featured,
    });
    await loadExistingProjects();
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    await saveProject(editingProject);
    setEditingProject(null);
    await loadExistingProjects();
  };

  // Filter projects
  const filteredProjects = existingProjects.filter((item) => {
    const matchesCat =
      categoryFilter === 'All' ||
      item.category_name?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
          Video Project Publisher &amp; Manager
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
          Upload, Edit &amp; Manage Video Projects
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Publish new videos from your computer or YouTube/Vimeo, edit metadata, or delete projects directly from this page.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-700/80 rounded-sm text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => router.push('/video-editing')}
            className="px-3 py-1 bg-emerald-500 text-black font-semibold uppercase tracking-wider rounded text-[11px] flex items-center space-x-1"
          >
            <span>View Public Films</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-sm text-red-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: ADD / UPLOAD NEW VIDEO
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-base font-serif font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span>1. Add New Video Project</span>
          </h2>
          <span className="text-xs text-neutral-400">Supports direct MP4 or YouTube/Vimeo</span>
        </div>

        {/* Source Selection Tabs */}
        <div className="flex border-b border-neutral-800">
          <button
            type="button"
            onClick={() => setSourceType('youtube')}
            className={`flex items-center space-x-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${
              sourceType === 'youtube'
                ? 'border-gold-400 text-gold-400 bg-gold-400/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span>YouTube / Vimeo Link (Instant)</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceType('file')}
            className={`flex items-center space-x-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-colors ${
              sourceType === 'file'
                ? 'border-gold-400 text-gold-400 bg-gold-400/5'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Video File (MP4, MOV, WEBM)</span>
          </button>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          {sourceType === 'youtube' ? (
            <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-3">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                YouTube or Vimeo URL *
              </label>
              <div className="relative">
                <Youtube className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  className="w-full bg-[#121212] border border-neutral-800 rounded-sm pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
                />
              </div>
              <p className="text-[11px] text-neutral-400">
                Thumbnails are extracted automatically from the video link.
              </p>
            </div>
          ) : (
            <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                Video File from Computer *
              </label>
              <div className="border border-dashed border-neutral-700 rounded p-6 text-center bg-[#121212]">
                <input
                  type="file"
                  required={!videoFile}
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleVideoFileSelect}
                  className="hidden"
                  id="video-file-input"
                />
                <label htmlFor="video-file-input" className="cursor-pointer block">
                  <Video className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">
                    {videoFile ? videoFile.name : 'Click to select MP4, MOV, or WEBM video'}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {videoFile ? formatBytes(videoFile.size) : 'Free tier supports up to 100MB per file'}
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Thumbnail Preview and Custom Upload */}
          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-4">
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              Video Thumbnail
            </label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative aspect-video w-full sm:w-60 bg-black rounded overflow-hidden border border-neutral-800 shrink-0">
                {thumbnailPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-[10px] uppercase">No Thumbnail</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                  id="custom-thumbnail-input"
                />
                <label
                  htmlFor="custom-thumbnail-input"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-900 border border-neutral-700 hover:border-gold-400 text-xs uppercase tracking-wider text-white font-semibold rounded cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-gold-400" />
                  <span>Upload Custom Thumbnail</span>
                </label>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Automatic thumbnail is extracted from YouTube or captured from your video file.
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="p-6 bg-surface-card border border-neutral-800 rounded-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider text-white font-semibold border-b border-neutral-800 pb-2">
              Project Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Silent Horizon"
                  className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
                >
                  {VIDEO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Project Date
                </label>
                <input
                  type="date"
                  value={projectDate}
                  onChange={(e) => setProjectDate(e.target.value)}
                  className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500/60"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Client / Production Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Independent Studio"
                  className="w-full bg-[#121212] border border-neutral-800 rounded-sm px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Project Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Narrative summary, technical camera setups, color grading workflow..."
                className="w-full bg-[#121212] border border-neutral-800 rounded-sm p-4 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-gold-500/60 leading-relaxed"
              />
            </div>

            {/* Software Used Tags */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Software Used
              </label>
              <div className="flex flex-wrap gap-2">
                {SOFTWARE_OPTIONS.map((soft) => {
                  const isSelected = selectedSoftware.includes(soft);
                  return (
                    <button
                      key={soft}
                      type="button"
                      onClick={() => toggleSoftware(soft)}
                      className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                        isSelected
                          ? 'bg-gold-400 text-black font-semibold border-gold-400'
                          : 'bg-[#121212] text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {soft}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="featured-check"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded bg-[#121212] border-neutral-700 text-gold-400"
              />
              <label htmlFor="featured-check" className="text-xs text-neutral-300">
                Display as featured project on the Home page
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {isPublishing && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>{statusMessage || 'Processing upload...'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isPublishing}
            className="w-full py-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-black text-xs uppercase tracking-[0.22em] font-bold rounded-sm shadow-gold-glow hover:brightness-110 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isPublishing ? (
              <span>Publishing Video Project...</span>
            ) : (
              <>
                <span>Publish Video Project</span>
                <CheckCircle2 className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </section>

      {/* =========================================================================
          SECTION 2: EDIT & DELETE EXISTING VIDEOS
          ========================================================================= */}
      <section className="space-y-6 pt-6 border-t border-neutral-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
          <h2 className="text-base font-serif font-bold text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span>2. Edit &amp; Delete Existing Videos ({existingProjects.length})</span>
          </h2>
          <span className="text-xs text-neutral-400">
            Click &ldquo;Edit&rdquo; to modify or &ldquo;Delete&rdquo; to remove instantly
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {['All', ...VIDEO_CATEGORIES].map((cat) => (
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

        {/* Existing Projects List */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 bg-surface-card border border-neutral-800 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center space-x-4 min-w-0">
                  <div
                    className="relative aspect-video w-24 bg-black rounded overflow-hidden shrink-0 cursor-pointer group"
                    onClick={() => setActiveVideoModal(project)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-400 bg-black/60 px-2 py-0.5 rounded border border-gold-500/30">
                        {project.category_name}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {project.project_date}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate max-w-md">
                      {project.title}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate max-w-md mt-0.5">
                      {project.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded border flex items-center space-x-1 transition-colors ${
                      project.featured
                        ? 'bg-gold-400/20 text-gold-300 border-gold-400/50'
                        : 'bg-neutral-900 text-neutral-500 border-neutral-800'
                    }`}
                    title="Toggle Featured on Home Page"
                  >
                    <Star className={`w-3 h-3 ${project.featured ? 'fill-current' : ''}`} />
                    <span>{project.featured ? 'Featured' : 'Regular'}</span>
                  </button>

                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-gold-400 rounded border border-neutral-800 transition-colors flex items-center space-x-1 text-xs px-2"
                    title="Edit Video Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProject(project.id, project.title)}
                    className="p-1.5 bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 rounded border border-neutral-800 hover:border-red-800/60 transition-colors flex items-center space-x-1 text-xs px-2"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-card border border-neutral-800 rounded-sm">
            <p className="text-neutral-400 text-xs">No video projects found matching this filter.</p>
          </div>
        )}
      </section>

      {/* Edit Video Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e0e0e] border border-gold-500/40 rounded-sm p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-gold-400" />
                <span>Edit Project Details</span>
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="aspect-video w-full rounded overflow-hidden bg-black border border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editingProject.thumbnail_url}
                  alt={editingProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Category *
                </label>
                <select
                  value={editingProject.category_name}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, category_name: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                >
                  {VIDEO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Video URL (YouTube / Vimeo / Direct)
                </label>
                <input
                  type="text"
                  value={editingProject.video_url || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, video_url: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={editingProject.thumbnail_url}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, thumbnail_url: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full bg-[#141414] border border-neutral-800 rounded p-2 text-white focus:outline-none focus:border-gold-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-proj-featured"
                  checked={editingProject.featured}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, featured: e.target.checked })
                  }
                  className="rounded bg-[#141414] border-neutral-700 text-gold-400"
                />
                <label htmlFor="edit-proj-featured" className="text-neutral-300">
                  Feature this project on the Home page
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-400 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-400 text-black font-bold uppercase rounded shadow-gold-glow"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      <VideoModal
        isOpen={Boolean(activeVideoModal)}
        onClose={() => setActiveVideoModal(null)}
        videoUrl={activeVideoModal?.video_url || ''}
        title={activeVideoModal?.title || 'Preview Player'}
      />
    </div>
  );
}
