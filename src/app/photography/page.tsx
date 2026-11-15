'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/SectionHeader';
import PhotoCard from '@/components/PhotoCard';
import Lightbox from '@/components/Lightbox';
import { getMedia } from '@/lib/dataService';
import { MediaItem } from '@/lib/types';
import { INITIAL_MEDIA } from '@/lib/initialData';

const PHOTO_CATEGORIES = [
  'All',
  'Portrait',
  'Wedding',
  'Nature',
  'Travel',
  'Street',
  'Events',
  'Creative Photography',
];

export default function PhotographyPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const items = await getMedia();
      setMediaList(items);
    }
    loadData();
  }, []);

  const filteredMedia = mediaList.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category_name?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="pt-28 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          badge="Still Life &amp; Frames"
          title="Photography Gallery"
          subtitle="Moments captured through optical lenses—celebrating human emotions, organic landscapes, street vitality, and creative light manipulation."
        />

        {/* Category Filter Pills */}
        <div className="mb-12 flex flex-wrap items-center gap-2 pb-6 border-b border-neutral-900">
          {PHOTO_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-[0.16em] px-4 py-2 rounded-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-400 text-black font-bold shadow-gold-glow'
                    : 'bg-[#111] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Masonry Layout */}
        {filteredMedia.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {filteredMedia.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                item={photo}
                onClick={() => setLightboxIndex(index)}
                allowDownload={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card border border-neutral-800 rounded-sm">
            <p className="text-neutral-400 text-sm">No photographs currently in this category.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-4 text-xs uppercase tracking-wider text-gold-400 hover:underline"
            >
              View All Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        items={filteredMedia}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
        allowDownload={false}
      />
    </div>
  );
}
