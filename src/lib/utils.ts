import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses video URLs (YouTube, Vimeo, direct MP4) into embeddable URLs or direct playback
 */
export function parseVideoUrl(url: string | undefined): {
  type: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  embedUrl: string;
  videoId?: string;
} {
  if (!url) return { type: 'unknown', embedUrl: '' };

  const trimmed = url.trim();

  // YouTube matchers: youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID or youtube.com/shorts/ID
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      videoId,
    };
  }

  // Vimeo matcher: vimeo.com/ID
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&color=d4af37`,
      videoId,
    };
  }

  // Direct video file (mp4, webm, mov)
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('data:video/') || trimmed.startsWith('blob:')) {
    return {
      type: 'direct',
      embedUrl: trimmed,
    };
  }

  return {
    type: 'unknown',
    embedUrl: trimmed,
  };
}

/**
 * Extracts a YouTube thumbnail if user provides a YouTube link without uploading custom thumbnail
 */
export function getYouTubeThumbnail(url: string): string | null {
  const parsed = parseVideoUrl(url);
  if (parsed.type === 'youtube' && parsed.videoId) {
    return `https://img.youtube.com/vi/${parsed.videoId}/maxresdefault.jpg`;
  }
  return null;
}

/**
 * Format bytes into human readable format (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
