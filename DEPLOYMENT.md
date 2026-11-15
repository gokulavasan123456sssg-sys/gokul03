# DEPLOYMENT & PRODUCTION SETUP GUIDE

## 1. Vercel Free Deployment

### Target Domain
- **Primary Domain:** `gokulavasan.vercel.app` *(Verified available!)*
- **Alternative options if ever required:**
  - `gokulavasan-films.vercel.app`
  - `gokulavasan-portfolio.vercel.app`
  - `gokulavasan-visuals.vercel.app`

### Steps to Deploy via Vercel Web Dashboard:
1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New..." → "Project"**.
3. Import your GitHub repository containing this portfolio code.
4. Under **"Build and Output Settings"**, leave default settings:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
5. Under **"Environment Variables"**, add:
   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xyz.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |
   | `NEXT_PUBLIC_SITE_URL` | `https://gokulavasan.vercel.app` |
6. Click **Deploy**.
7. Once deployed, open **Settings → Domains** in your Vercel project dashboard, and ensure `gokulavasan.vercel.app` is assigned.

---

## 2. Supabase Storage & Database Setup

1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. In the left navigation, click **SQL Editor**.
3. Click **New Query**, paste the complete contents of `supabase/schema.sql` located in this project, and click **RUN**.
4. Check the results:
   - Tables created: `profiles`, `projects`, `media`, `categories`, `education`, `experiences`, `site_settings`.
   - Bucket created: `portfolio-media` with public access enabled for reading files and authenticated access for uploading/deleting.
5. In **Authentication → Users**, create an administrator account using your email (e.g., `gokulavasan.visuals@gmail.com`).
   - The included SQL trigger `handle_new_user` will automatically assign `is_admin = TRUE` to the profile.

---

## 3. Uploading New Work Without Code Editing

Once deployed:
1. Navigate to `https://gokulavasan.vercel.app/admin`.
2. Sign in with your admin credentials.
3. Use:
   - **Upload Photos**: Drag and drop photography files directly. Add titles and assign categories. Hit Publish.
   - **Upload / Link Video**: Paste a YouTube/Vimeo URL or upload an MP4/MOV file. Fill in project details and software tags. Hit Publish.
4. The new project will immediately appear on your public website!
