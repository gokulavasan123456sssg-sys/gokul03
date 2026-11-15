export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  cover_url?: string;
  showreel_url?: string;
  email: string;
  phone: string;
  location: string;
  social_instagram: string;
  social_youtube: string;
  social_linkedin: string;
  social_vimeo: string;
  social_behance: string;
  software: string[];
  skills: string[];
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: 'video' | 'photo' | 'vfx' | 'all';
  description?: string;
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id?: string;
  category_name: string;
  type: 'video' | 'photo' | 'vfx';
  thumbnail_url: string;
  video_url?: string;
  video_source: 'youtube' | 'vimeo' | 'upload' | 'direct';
  software_used: string[];
  project_date: string;
  client_name?: string;
  featured: boolean;
  published: boolean;
  order_index: number;
  views_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  project_id?: string;
  title: string;
  description?: string;
  category_name: string;
  media_type: 'image' | 'video';
  url: string;
  storage_path?: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  featured: boolean;
  order_index: number;
  created_at: string;
}

export interface Education {
  id: string;
  degree: string;
  field_of_study: string;
  institution: string;
  score: string;
  start_year: string;
  end_year: string;
  order_index: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  order_index: number;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  allow_image_download: boolean;
  hero_video_url?: string;
  updated_at?: string;
}
