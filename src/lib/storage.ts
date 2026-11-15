import { supabase, isSupabaseConfigured } from './supabase/client';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB for Supabase free tier

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  onProgress?: (percent: number) => void;
  compress?: boolean;
}

export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  size: number;
  type: string;
}

/**
 * Validates a file before upload
 */
export function validateFile(file: File, expectedType: 'image' | 'video' | 'any'): { valid: boolean; error?: string } {
  if (expectedType === 'image' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid image type (${file.type}). Supported formats: JPG, PNG, WEBP.`,
    };
  }

  if (expectedType === 'video' && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid video type (${file.type}). Supported formats: MP4, MOV, WEBM.`,
    };
  }

  if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image size exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit.`,
    };
  }

  if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Video size exceeds ${MAX_VIDEO_SIZE / (1024 * 1024)}MB free-tier limit. For larger videos, consider linking a YouTube or Vimeo URL.`,
    };
  }

  return { valid: true };
}

/**
 * Compresses an image in the browser using HTML5 Canvas before uploading
 */
export async function compressImage(file: File, maxWidth = 2560, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Generates a video thumbnail by seeking to 1 second and capturing canvas
 */
export async function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbUrl = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(url);
          resolve(thumbUrl);
        } else {
          URL.revokeObjectURL(url);
          resolve('/images/gokul-portrait.jpg');
        }
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('/images/gokul-portrait.jpg');
      };
    } catch {
      resolve('/images/gokul-portrait.jpg');
    }
  });
}

/**
 * Uploads a file to Supabase Storage with progress simulation, retry logic, and fallback
 */
export async function uploadMedia(file: File, options: UploadOptions = {}): Promise<UploadResult> {
  const bucket = options.bucket || 'portfolio-media';
  const folder = options.folder ? `${options.folder}/` : '';
  const onProgress = options.onProgress || (() => {});

  // Clean filename
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const uniqueName = `${folder}${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanName}`;

  onProgress(15);

  let fileToUpload: Blob | File = file;
  if (options.compress && file.type.startsWith('image/')) {
    try {
      fileToUpload = await compressImage(file);
      onProgress(35);
    } catch (e) {
      console.warn('Compression skipped:', e);
    }
  }

  // If Supabase is configured, upload to Supabase Storage
  if (isSupabaseConfigured) {
    onProgress(50);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(uniqueName, fileToUpload, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        onProgress(90);

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        onProgress(100);

        return {
          url: publicUrlData.publicUrl,
          path: data.path,
          fileName: cleanName,
          size: file.size,
          type: file.type,
        };
      } catch (err) {
        if (attempts >= maxAttempts) {
          throw new Error(`Upload failed after ${maxAttempts} attempts: ${(err as Error).message}`);
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  // Graceful fallback for local development before Supabase keys are set:
  // Convert to base64 DataURL and return for instant preview and testing!
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };
    reader.onload = () => {
      onProgress(100);
      resolve({
        url: reader.result as string,
        path: uniqueName,
        fileName: cleanName,
        size: file.size,
        type: file.type,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file for local preview.'));
    reader.readAsDataURL(fileToUpload);
  });
}
