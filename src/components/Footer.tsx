'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Youtube, Instagram, Linkedin, Mail, Film, Camera, ArrowUp } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] text-neutral-400 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle top gold accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif tracking-[0.25em] font-bold text-white">
                GOKULAVASAN
              </span>
            </Link>
            <p className="text-gold-400 text-xs tracking-[0.2em] uppercase font-semibold">
              Video Editor | Cinematographer | Photographer
            </p>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
              &ldquo;Capturing Moments. Creating Stories.&rdquo; High-end narrative editing, cinematic camera operation, and commercial visual production crafted for screens worldwide.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:gokulavasan.visuals@gmail.com"
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Disciplines */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-4 border-l-2 border-gold-400 pl-2">
              Disciplines
            </h3>
            <ul className="space-y-2 text-xs tracking-wider">
              <li>
                <Link href="/video-editing" className="hover:text-gold-400 transition-colors">
                  Cinematic Video Editing
                </Link>
              </li>
              <li>
                <Link href="/cinematography" className="hover:text-gold-400 transition-colors">
                  Cinematography & Films
                </Link>
              </li>
              <li>
                <Link href="/photography" className="hover:text-gold-400 transition-colors">
                  Photography & Stills
                </Link>
              </li>
              <li>
                <Link href="/vfx-3d" className="hover:text-gold-400 transition-colors">
                  VFX & 3D Modeling
                </Link>
              </li>
              <li>
                <Link href="/education-experience" className="hover:text-gold-400 transition-colors">
                  Career & Background
                </Link>
              </li>
            </ul>
          </div>

          {/* Software Proficiency */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-4 border-l-2 border-gold-400 pl-2">
              Software Suite
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>Adobe Premiere Pro</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>After Effects</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>DaVinci Resolve Studio</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>Autodesk Maya</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>Foundry Nuke</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} GOKULAVASAN. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="hover:text-gold-400 transition-colors">
              Admin Login
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
