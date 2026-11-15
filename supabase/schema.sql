-- ==============================================================================
-- GOKULAVASAN CREATIVE PORTFOLIO - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT 'Gokulavasan',
    headline TEXT DEFAULT 'Video Editor | Cinematographer | Photographer',
    tagline TEXT DEFAULT 'Capturing Moments. Creating Stories.',
    bio TEXT DEFAULT 'Passionate visual storyteller, editor, and cinematographer dedicated to crafting cinematic experiences with precision, mood, and emotion.',
    avatar_url TEXT DEFAULT '/images/gokul-portrait.jpg',
    cover_url TEXT DEFAULT '',
    showreel_url TEXT DEFAULT 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    location TEXT DEFAULT 'Tamil Nadu, India',
    social_instagram TEXT DEFAULT 'https://instagram.com/',
    social_youtube TEXT DEFAULT 'https://youtube.com/',
    social_linkedin TEXT DEFAULT 'https://linkedin.com/',
    social_vimeo TEXT DEFAULT 'https://vimeo.com/',
    social_behance TEXT DEFAULT 'https://behance.net/',
    software TEXT[] DEFAULT ARRAY['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Autodesk Maya', 'Nuke'],
    skills TEXT[] DEFAULT ARRAY['Cinematography', 'Video Editing', 'Color Grading', '3D & VFX Compositing', 'Camera Operation', 'Lighting Design'],
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'video', -- 'video', 'photo', 'vfx', 'all'
    description TEXT DEFAULT '',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL DEFAULT 'Cinematic Films',
    type TEXT NOT NULL DEFAULT 'video', -- 'video', 'photo', 'vfx'
    thumbnail_url TEXT NOT NULL,
    video_url TEXT DEFAULT '',
    video_source TEXT DEFAULT 'youtube', -- 'youtube', 'vimeo', 'upload', 'direct'
    software_used TEXT[] DEFAULT ARRAY[]::TEXT[],
    project_date DATE DEFAULT CURRENT_DATE,
    client_name TEXT DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. MEDIA TABLE (For Photography & Project Gallery Assets)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT DEFAULT '',
    description TEXT DEFAULT '',
    category_name TEXT NOT NULL DEFAULT 'Portrait',
    media_type TEXT NOT NULL DEFAULT 'image', -- 'image', 'video'
    url TEXT NOT NULL,
    storage_path TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    width INT DEFAULT 1920,
    height INT DEFAULT 1080,
    aspect_ratio TEXT DEFAULT '16:9',
    featured BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. EDUCATION TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    institution TEXT NOT NULL,
    score TEXT NOT NULL,
    start_year TEXT DEFAULT '',
    end_year TEXT DEFAULT '',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. EXPERIENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT DEFAULT '',
    start_date TEXT DEFAULT '',
    end_date TEXT DEFAULT '',
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT DEFAULT '',
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. SITE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_title TEXT NOT NULL DEFAULT 'GOKULAVASAN | Creative Portfolio',
    site_description TEXT DEFAULT 'Cinematographer, Video Editor & Photographer portfolio showcasing cinematic visual craft.',
    contact_email TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '',
    allow_image_download BOOLEAN DEFAULT FALSE,
    hero_video_url TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- SEED DEFAULT CATEGORIES
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, type, order_index) VALUES
    ('Cinematic Films', 'cinematic-films', 'video', 1),
    ('Wedding Films', 'wedding-films', 'video', 2),
    ('Short Films', 'short-films', 'video', 3),
    ('YouTube Projects', 'youtube-projects', 'video', 4),
    ('Promotional Videos', 'promotional-videos', 'video', 5),
    ('Instagram Reels', 'instagram-reels', 'video', 6),
    ('Freelance Projects', 'freelance-projects', 'video', 7),
    ('VFX & 3D Breakdown', 'vfx-3d-breakdown', 'vfx', 8),
    ('Portrait', 'portrait', 'photo', 10),
    ('Wedding', 'wedding', 'photo', 11),
    ('Nature', 'nature', 'photo', 12),
    ('Travel', 'travel', 'photo', 13),
    ('Street', 'street', 'photo', 14),
    ('Events', 'events', 'photo', 15),
    ('Creative Photography', 'creative-photography', 'photo', 16)
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------------------------
-- SEED INITIAL EDUCATION DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.education (degree, field_of_study, institution, score, start_year, end_year, order_index) VALUES
    ('Bachelor of Engineering', 'Cyber Security', 'SRM Valliammai Engineering College', '74%', '2022', '2025', 1),
    ('Diploma in Engineering', 'Engineering', 'Sri Ramakrishna Polytechnic College', '81%', '2019', '2022', 2)
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- SEED INITIAL SITE SETTINGS
-- ------------------------------------------------------------------------------
INSERT INTO public.site_settings (id, site_title, site_description, allow_image_download) VALUES
    ('default', 'GOKULAVASAN | Filmmaker & Visual Artist', 'Video Editor | Cinematographer | Photographer Portfolio', FALSE)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Categories Policies
CREATE POLICY "Categories are viewable by everyone" 
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert categories" 
    ON public.categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" 
    ON public.categories FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete categories" 
    ON public.categories FOR DELETE TO authenticated USING (true);

-- 3. Projects Policies
CREATE POLICY "Published projects are viewable by everyone" 
    ON public.projects FOR SELECT USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert projects" 
    ON public.projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" 
    ON public.projects FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete projects" 
    ON public.projects FOR DELETE TO authenticated USING (true);

-- 4. Media Policies
CREATE POLICY "Media items are viewable by everyone" 
    ON public.media FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert media" 
    ON public.media FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update media" 
    ON public.media FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete media" 
    ON public.media FOR DELETE TO authenticated USING (true);

-- 5. Education Policies
CREATE POLICY "Education is viewable by everyone" 
    ON public.education FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage education" 
    ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Experiences Policies
CREATE POLICY "Experiences are viewable by everyone" 
    ON public.experiences FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage experiences" 
    ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Site Settings Policies
CREATE POLICY "Site settings are viewable by everyone" 
    ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update site settings" 
    ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- ------------------------------------------------------------------------------
-- Run this in SQL Editor to create the bucket 'portfolio-media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-media', 
    'portfolio-media', 
    true, 
    104857600, -- 100MB limit for Supabase free tier
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for 'portfolio-media'
CREATE POLICY "Media public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

CREATE POLICY "Media authenticated insert"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Media authenticated update"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'portfolio-media');

CREATE POLICY "Media authenticated delete"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'portfolio-media');

-- ------------------------------------------------------------------------------
-- HELPER TRIGGER: Auto-create profile record when new user signs up in Auth
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, is_admin)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Gokulavasan'),
        TRUE -- Automatically elevate to admin for the portfolio owner
    )
    ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
