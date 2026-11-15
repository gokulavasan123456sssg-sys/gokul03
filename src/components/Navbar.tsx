'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Film, Camera, Layers, User, Mail, ShieldCheck } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Video Editing', href: '/video-editing' },
  { name: 'Cinematography', href: '/cinematography' },
  { name: 'Photography', href: '/photography' },
  { name: 'VFX & 3D', href: '/vfx-3d' },
  { name: 'Experience', href: '/education-experience' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) return null; // Admin has its own dedicated dashboard shell

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/90 backdrop-blur-md border-b border-[#222222]/80 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] font-bold text-white group-hover:text-gold-300 transition-colors">
              GOKULAVASAN
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-400 group-hover:scale-150 transition-transform"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.18em] transition-all duration-200 relative py-1 ${
                    isActive
                      ? 'text-gold-400 font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Admin & Contact */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wider text-neutral-500 hover:text-gold-400 transition-colors flex items-center space-x-1 p-1.5 rounded"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="relative inline-flex items-center justify-center px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium text-black bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 rounded-sm hover:brightness-110 shadow-gold-glow transition-all"
            >
              Let&apos;s Connect
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <Link
              href="/admin"
              className="text-neutral-400 hover:text-gold-400 p-2"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-300 hover:text-white p-2 rounded-md focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070707] border-b border-neutral-800 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm uppercase tracking-[0.2em] py-2 transition-colors ${
                    isActive ? 'text-gold-400 font-bold' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wider text-neutral-400 flex items-center space-x-1"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Admin Access</span>
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-black bg-gold-400 rounded-sm"
            >
              Hire Me
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
