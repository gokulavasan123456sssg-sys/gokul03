'use client';

import React from 'react';
import { Maximize2 } from 'lucide-react';
import { MediaItem } from '@/lib/types';

interface PhotoCardProps {
  item: MediaItem;
  onClick: () => void;
  allowDownload?: boolean;
}

export default function PhotoCard({ item, onClick, allowDownload = false }: PhotoCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-sm bg-neutral-900 border border-neutral-800 hover:border-gold-500/50 transition-all duration-300 hover:shadow-gold-glow mb-4 break-inside-avoid"
      onContextMenu={(e) => {
        if (!allowDownload) e.preventDefault();
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={item.title || 'Photograph'}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        draggable={false}
      />

      {/* Hover Information Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-300 bg-black/60 px-2 py-0.5 rounded border border-gold-500/30">
            {item.category_name}
          </span>
          <div className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20">
            <Maximize2 className="w-4 h-4 text-gold-400" />
          </div>
        </div>

        <h3 className="text-sm font-serif font-semibold text-white tracking-wide">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}
