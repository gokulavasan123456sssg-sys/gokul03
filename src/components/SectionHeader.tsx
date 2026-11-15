import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {badge && (
        <div className={`inline-flex items-center space-x-2 mb-3 ${centered ? 'justify-center' : ''}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400">
            {badge}
          </span>
          <span className="w-8 h-[1px] bg-gold-400/50" />
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
