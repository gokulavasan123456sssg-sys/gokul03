'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { parseVideoUrl } from '@/lib/utils';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoUrl) return null;

  const parsed = parseVideoUrl(videoUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/95 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0b0b0b] border border-gold-500/30 rounded-lg overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-[#070707]">
          <div className="flex items-center space-x-2 truncate">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <h3 className="text-sm font-medium text-neutral-200 truncate">{title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {parsed.type === 'youtube' && parsed.videoId && (
              <a
                href={`https://www.youtube.com/watch?v=${parsed.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-gold-400 p-1 text-xs flex items-center space-x-1"
                title="Watch on YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {parsed.type === 'youtube' || parsed.type === 'vimeo' ? (
            <iframe
              src={parsed.embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : parsed.type === 'direct' ? (
            <video
              src={parsed.embedUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-8">
              <p className="text-neutral-400 text-sm mb-4">Video format or link cannot be directly embedded.</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-500 text-black text-xs font-semibold uppercase tracking-wider rounded"
              >
                <span>Open Video Link</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
