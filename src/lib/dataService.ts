import { supabase, isSupabaseConfigured } from './supabase/client';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_MEDIA,
  INITIAL_CATEGORIES,
  INITIAL_EDUCATION,
  INITIAL_EXPERIENCE,
} from './initialData';
import { Profile, Project, MediaItem, Category, Education, Experience, SiteSettings } from './types';

const STORAGE_KEYS = {
  PROFILE: 'gokul_portfolio_profile',
  PROJECTS: 'gokul_portfolio_projects',
  MEDIA: 'gokul_portfolio_media',
  CATEGORIES: 'gokul_portfolio_categories',
  EDUCATION: 'gokul_portfolio_education',
  EXPERIENCE: 'gokul_portfolio_experience',
  SETTINGS: 'gokul_portfolio_settings',
};

function getLocal<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
}

/* ==========================================================================
   PROFILE
   ========================================================================== */
export async function getProfile(): Promise<Profile> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
    if (!error && data) return data as Profile;
  }
  return getLocal<Profile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  if (isSupabaseConfigured) {
    const current = await getProfile();
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', current.id)
      .select()
      .single();
    if (!error && data) return data as Profile;
  }
  const current = getLocal<Profile>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);
  const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
  setLocal(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

/* ==========================================================================
   PROJECTS
   ========================================================================== */
export async function getProjects(filter?: {
  type?: string;
  category?: string;
  featuredOnly?: boolean;
}): Promise<Project[]> {
  if (isSupabaseConfigured) {
    let query = supabase.from('projects').select('*').eq('published', true).order('order_index', { ascending: true });

    if (filter?.type && filter.type !== 'all') {
      query = query.eq('type', filter.type);
    }
    if (filter?.category && filter.category !== 'All') {
      query = query.eq('category_name', filter.category);
    }
    if (filter?.featuredOnly) {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as Project[];
  }

  // Fallback to local
  let list = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  if (filter?.type && filter.type !== 'all') {
    list = list.filter((p) => p.type === filter.type);
  }
  if (filter?.category && filter.category !== 'All') {
    list = list.filter((p) => p.category_name.toLowerCase() === filter.category?.toLowerCase());
  }
  if (filter?.featuredOnly) {
    list = list.filter((p) => p.featured);
  }
  return list.sort((a, b) => a.order_index - b.order_index);
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (!error && data) return data as Project[];
  }
  return getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const isNew = !project.id;
  const projectToSave: Project = {
    id: project.id || `proj-${Date.now()}`,
    title: project.title || 'Untitled Project',
    slug:
      project.slug ||
      (project.title || 'project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + `-${Date.now().toString(36)}`,
    description: project.description || '',
    category_id: project.category_id,
    category_name: project.category_name || 'Cinematic Films',
    type: project.type || 'video',
    thumbnail_url: project.thumbnail_url || '/images/gokul-portrait.jpg',
    video_url: project.video_url || '',
    video_source: project.video_source || 'youtube',
    software_used: project.software_used || [],
    project_date: project.project_date || new Date().toISOString().split('T')[0],
    client_name: project.client_name || '',
    featured: Boolean(project.featured),
    published: project.published !== undefined ? project.published : true,
    order_index: project.order_index || 0,
    created_at: project.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    if (isNew) {
      const { data, error } = await supabase.from('projects').insert(projectToSave).select().single();
      if (!error && data) return data as Project;
    } else {
      const { data, error } = await supabase
        .from('projects')
        .update(projectToSave)
        .eq('id', projectToSave.id)
        .select()
        .single();
      if (!error && data) return data as Project;
    }
  }

  // Local storage handling
  const existing = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  let updatedList: Project[];
  if (isNew) {
    updatedList = [projectToSave, ...existing];
  } else {
    updatedList = existing.map((p) => (p.id === projectToSave.id ? projectToSave : p));
  }
  setLocal(STORAGE_KEYS.PROJECTS, updatedList);
  return projectToSave;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) return true;
  }
  const existing = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const updatedList = existing.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PROJECTS, updatedList);
  return true;
}

/* ==========================================================================
   MEDIA / PHOTOGRAPHY
   ========================================================================== */
export async function getMedia(filter?: { category?: string; featuredOnly?: boolean }): Promise<MediaItem[]> {
  if (isSupabaseConfigured) {
    let query = supabase.from('media').select('*').order('order_index', { ascending: true });
    if (filter?.category && filter.category !== 'All') {
      query = query.eq('category_name', filter.category);
    }
    if (filter?.featuredOnly) {
      query = query.eq('featured', true);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as MediaItem[];
  }

  let list = getLocal<MediaItem[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  if (filter?.category && filter.category !== 'All') {
    list = list.filter((m) => m.category_name.toLowerCase() === filter.category?.toLowerCase());
  }
  if (filter?.featuredOnly) {
    list = list.filter((m) => m.featured);
  }
  return list;
}

export async function saveMediaItem(item: Partial<MediaItem>): Promise<MediaItem> {
  const isNew = !item.id;
  const id = item.id || `med-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const itemToSave: MediaItem = {
    id,
    project_id: item.project_id,
    title: item.title || 'Untitled Image',
    description: item.description || '',
    category_name: item.category_name || 'Portrait',
    media_type: item.media_type || 'image',
    url: item.url || '/images/gokul-portrait.jpg',
    storage_path: item.storage_path || '',
    thumbnail_url: item.thumbnail_url || item.url || '/images/gokul-portrait.jpg',
    aspect_ratio: item.aspect_ratio || '4:5',
    featured: Boolean(item.featured),
    order_index: item.order_index || 0,
    created_at: item.created_at || new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    if (isNew) {
      const { data, error } = await supabase.from('media').insert(itemToSave).select().single();
      if (!error && data) return data as MediaItem;
    } else {
      const { data, error } = await supabase
        .from('media')
        .update(itemToSave)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as MediaItem;
    }
  }

  const existing = getLocal<MediaItem[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  const exists = existing.some((m) => m.id === id);
  const updated = exists
    ? existing.map((m) => (m.id === id ? itemToSave : m))
    : [itemToSave, ...existing];
  setLocal(STORAGE_KEYS.MEDIA, updated);
  return itemToSave;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (!error) return true;
  }
  const existing = getLocal<MediaItem[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  const updated = existing.filter((m) => m.id !== id);
  setLocal(STORAGE_KEYS.MEDIA, updated);
  return true;
}

/* ==========================================================================
   CATEGORIES
   ========================================================================== */
export async function getCategories(type?: 'video' | 'photo' | 'vfx'): Promise<Category[]> {
  if (isSupabaseConfigured) {
    let query = supabase.from('categories').select('*').order('order_index', { ascending: true });
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data as Category[];
  }

  let list = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  if (type) {
    list = list.filter((c) => c.type === type || c.type === 'all');
  }
  return list;
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const isNew = !category.id;
  const item: Category = {
    id: category.id || `cat-${Date.now()}`,
    name: category.name || 'New Category',
    slug:
      category.slug ||
      (category.name || 'category')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    type: category.type || 'video',
    description: category.description || '',
    order_index: category.order_index || 0,
  };

  if (isSupabaseConfigured) {
    if (isNew) {
      const { data } = await supabase.from('categories').insert(item).select().single();
      if (data) return data as Category;
    } else {
      const { data } = await supabase.from('categories').update(item).eq('id', item.id).select().single();
      if (data) return data as Category;
    }
  }

  const existing = getLocal<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  let updatedList: Category[];
  if (isNew) {
    updatedList = [...existing, item];
  } else {
    updatedList = existing.map((c) => (c.id === item.id ? item : c));
  }
  setLocal(STORAGE_KEYS.CATEGORIES, updatedList);
  return item;
}

/* ==========================================================================
   EDUCATION & EXPERIENCE
   ========================================================================== */
export async function getEducation(): Promise<Education[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('education').select('*').order('order_index', { ascending: true });
    if (!error && data && data.length > 0) return data as Education[];
  }
  return getLocal<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
}

export async function saveEducation(item: Partial<Education>): Promise<Education> {
  const isNew = !item.id;
  const edu: Education = {
    id: item.id || `edu-${Date.now()}`,
    degree: item.degree || '',
    field_of_study: item.field_of_study || '',
    institution: item.institution || '',
    score: item.score || '',
    start_year: item.start_year || '',
    end_year: item.end_year || '',
    order_index: item.order_index || 0,
  };

  if (isSupabaseConfigured) {
    if (isNew) {
      const { data } = await supabase.from('education').insert(edu).select().single();
      if (data) return data as Education;
    } else {
      const { data } = await supabase.from('education').update(edu).eq('id', edu.id).select().single();
      if (data) return data as Education;
    }
  }

  const existing = getLocal<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
  const updatedList = isNew ? [...existing, edu] : existing.map((e) => (e.id === edu.id ? edu : e));
  setLocal(STORAGE_KEYS.EDUCATION, updatedList);
  return edu;
}

export async function deleteEducation(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    await supabase.from('education').delete().eq('id', id);
  }
  const existing = getLocal<Education[]>(STORAGE_KEYS.EDUCATION, INITIAL_EDUCATION);
  setLocal(
    STORAGE_KEYS.EDUCATION,
    existing.filter((e) => e.id !== id)
  );
  return true;
}

export async function getExperience(): Promise<Experience[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('experiences').select('*').order('order_index', { ascending: true });
    if (!error && data && data.length > 0) return data as Experience[];
  }
  return getLocal<Experience[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
}

export async function saveExperience(item: Partial<Experience>): Promise<Experience> {
  const isNew = !item.id;
  const exp: Experience = {
    id: item.id || `exp-${Date.now()}`,
    role: item.role || '',
    company: item.company || '',
    location: item.location || '',
    start_date: item.start_date || '',
    end_date: item.end_date || '',
    is_current: Boolean(item.is_current),
    description: item.description || '',
    order_index: item.order_index || 0,
  };

  if (isSupabaseConfigured) {
    if (isNew) {
      const { data } = await supabase.from('experiences').insert(exp).select().single();
      if (data) return data as Experience;
    } else {
      const { data } = await supabase.from('experiences').update(exp).eq('id', exp.id).select().single();
      if (data) return data as Experience;
    }
  }

  const existing = getLocal<Experience[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
  const updatedList = isNew ? [...existing, exp] : existing.map((e) => (e.id === exp.id ? exp : e));
  setLocal(STORAGE_KEYS.EXPERIENCE, updatedList);
  return exp;
}

export async function deleteExperience(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    await supabase.from('experiences').delete().eq('id', id);
  }
  const existing = getLocal<Experience[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
  setLocal(
    STORAGE_KEYS.EXPERIENCE,
    existing.filter((e) => e.id !== id)
  );
  return true;
}
