# GOKULAVASAN — Creative Portfolio Website

> **VIDEO EDITOR | CINEMATOGRAPHER | PHOTOGRAPHER**  
> *"Capturing Moments. Creating Stories."*

A luxury, filmmaker-style production-ready portfolio built with **Next.js 14**, **Tailwind CSS**, **Supabase PostgreSQL & Storage**, and designed for deployment on **Vercel** (`gokulavasan.vercel.app`).

---

## 🌟 Visual & Design Identity

- **Design Aesthetic:** Premium Cinematic Black (`#050505`) with Metallic Gold accents (`#D4AF37`)
- **Typography:** Gold & White cinematic editorial hierarchy
- **Hero Section:** Full-screen cinematic video canvas with Gokulavasan's portrait badge, showreel modal player, and audio toggle
- **Responsive Layout:** Engineered for ultra-wide cinema displays down to mobile smartphones
- **Media Protection:** Right-click context protection and configurable download disable flag for photography

---

## 🚀 Public Pages

1. **Home (`/`)**: Cinematic hero, about summary, featured films & video projects, photography preview, technical software suite, and direct contact CTA.
2. **About Me (`/about`)**: Biography, creative philosophy, core visual pillars, academic foundation, and full software suite.
3. **Video Editing (`/video-editing`)**: Narrative films, commercial promos, YouTube projects, wedding films, and Instagram reels with interactive category filters, search, and cinema video modal.
4. **Cinematography (`/cinematography`)**: Director of photography showcase, camera & optical gear, lighting architectures, and ACES / DaVinci Resolve color pipelines.
5. **Photography Gallery (`/photography`)**: Masonry grid with category filters (Portrait, Wedding, Nature, Travel, Street, Events, Creative), high-res preview, and full-screen lightbox viewer.
6. **VFX & 3D (`/vfx-3d`)**: CGI asset breakdowns, Autodesk Maya 3D models, Foundry Nuke node compositing, and After Effects particle simulations.
7. **Education & Experience (`/education-experience`)**:
   - *Bachelor of Engineering – Cyber Security*, SRM Valliammai Engineering College (74%)
   - *Diploma in Engineering*, Sri Ramakrishna Polytechnic College (81%)
   - Production experience timeline and capabilities matrix.
8. **Contact (`/contact`)**: Interactive project inquiry brief form, response guarantee, direct email, location, and social channels.

---

## 🛡️ Private Admin Dashboard (`/admin`)

Manage and upload content dynamically **without ever needing to edit source code**.

### Routes
- `/admin` — Overview metrics, recent uploads, system integration status
- `/admin/upload-photo` — Multi-image drag-and-drop easy uploader with category selection, compression, and live publishing
- `/admin/upload-video` — Direct video upload (MP4/MOV/WEBM) or instant YouTube/Vimeo embed with custom or auto-extracted thumbnail
- `/admin/projects` — Edit, delete, reorder, toggle featured, and toggle draft/published status
- `/admin/categories` — Manage video, photo, and VFX categories
- `/admin/profile` — Update headline, tagline, bio, showreel link, social URLs, and portrait photo
- `/admin/education` — Update degrees, institutions, and scores
- `/admin/experience` — Update production roles and company milestones
- `/admin/settings` — Website metadata, image right-click download protection, Supabase configuration

### Default Admin Sign-In
- **Email:** `admin@gokulavasan.com`
- **Password:** `admin123`  
*(Or your authenticated Supabase user account once connected)*

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router, Server Components & Client Hydration)
- **Styling:** Tailwind CSS with custom metallic gold palette & glow utilities
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth (Email & Password, Session Persistence)
- **Storage:** Supabase Storage (`portfolio-media` public bucket with authenticated upload)
- **Icons:** Lucide React
- **Hosting:** Vercel (Free tier, serverless edge deployment)

---

## 📦 Local Development Setup

1. **Clone or Navigate to the Project:**
   ```bash
   cd "c:\Users\GOKULAVASAN\Desktop\portfolio file"
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## ☁️ Supabase Cloud Setup (Click-by-Click)

The application works immediately in local persistent storage mode and connects seamlessly to Supabase:

1. Create a free account at [supabase.com](https://supabase.com) and create a new project.
2. Open **Project Settings → API** and copy:
   - `Project URL`
   - `anon public key`
3. Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Open Supabase **SQL Editor**, paste the contents of `supabase/schema.sql`, and click **RUN**.
   - This automatically creates all tables (`profiles`, `projects`, `media`, `categories`, `education`, `experiences`, `site_settings`).
   - Configures Row Level Security (RLS) so visitors can only read published content while only you can edit.
   - Creates the `portfolio-media` storage bucket and security policies.

---

## 🚀 Vercel Free Deployment Guide

1. Push this project to GitHub (or import directly via Vercel CLI / Vercel Web Dashboard).
2. Go to [vercel.com/new](https://vercel.com/new) and select the repository.
3. In **Environment Variables**, enter:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://gokulavasan.vercel.app`
4. Set your custom domain to **`gokulavasan.vercel.app`** (verified available!).
5. Click **Deploy**. Your portfolio will be live worldwide in less than 60 seconds.
