'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Download, Info } from 'lucide-react';
import { MediaItem } from '@/lib/types';

interface LightboxProps {
  items: MediaItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  allowDownload?: boolean;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
  allowDownload = false,
}: LightboxProps) {
  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + items.length) % items.length);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!allowDownload) {
      e.preventDefault();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-fade-in select-none"
      onClick={onClose}
      onContextMenu={handleContextMenu}
    >
      {/* Top action controls */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center space-x-3">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-400 bg-black/60 px-3 py-1 rounded border border-gold-500/30">
            {currentItem.category_name}
          </span>
          <span className="text-xs text-neutral-400">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {allowDownload && (
            <a
              href={currentItem.url}
              download={currentItem.title || 'gokulavasan-photo'}
              className="text-neutral-400 hover:text-white p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-colors"
              title="Download Original"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prev Navigation Button */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex - 1 + items.length) % items.length);
          }}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 text-neutral-300 hover:text-white bg-black/50 hover:bg-black/90 rounded-full border border-neutral-800 hover:border-gold-500/50 transition-all z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-6xl max-h-[82vh] w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[72vh] max-w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentItem.url}
            alt={currentItem.title || 'Photograph'}
            className="max-h-[72vh] max-w-full object-contain rounded shadow-2xl pointer-events-auto"
            draggable={false}
          />
        </div>

        {/* Caption & Description */}
        <div className="mt-4 text-center max-w-xl px-4">
          <h4 className="text-base font-serif font-semibold text-white tracking-wide">
            {currentItem.title}
          </h4>
          {currentItem.description && (
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {currentItem.description}
            </p>
          )}
        </div>
      </div>

      {/* Next Navigation Button */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((currentIndex + 1) % items.length);
          }}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 text-neutral-300 hover:text-white bg-black/50 hover:bg-black/90 rounded-full border border-neutral-800 hover:border-gold-500/50 transition-all z-10"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
