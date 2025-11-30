/**
 * MediaPlaceholder Component
 * Smart placeholder system for images and videos
 * Optimized for mobile-first with aspect ratios
 */

import React from 'react';

export type MediaType = 'image' | 'video' | 'portrait-video' | 'landscape-video';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export interface MediaPlaceholderProps {
  /** Type of media */
  type: MediaType;
  
  /** Aspect ratio */
  aspectRatio: AspectRatio;
  
  /** Alt text for accessibility */
  alt?: string;
  
  /** Caption below media */
  caption?: string;
  
  /** Lazy load (default: true) */
  lazy?: boolean;
  
  /** Optional URL when ready to replace */
  src?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Priority (load above fold) */
  priority?: boolean;
  
  /** Custom class */
  className?: string;
}

export function MediaPlaceholder({
  type,
  aspectRatio,
  alt = 'Media placeholder',
  caption,
  lazy = true,
  src,
  loading = false,
  priority = false,
  className = '',
}: MediaPlaceholderProps) {
  
  // Map aspect ratios to Tailwind classes
  const aspectRatioClass = {
    '16:9': 'aspect-video',         // Landscape (common)
    '9:16': 'aspect-[9/16]',        // Portrait (Stories/Reels)
    '1:1': 'aspect-square',         // Square (Instagram)
    '4:3': 'aspect-[4/3]',          // Classic
    '21:9': 'aspect-[21/9]',        // Ultra-wide
  }[aspectRatio];

  // Icon per media type
  const getIcon = () => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'video':
      case 'landscape-video':
        return '🎥';
      case 'portrait-video':
        return '📱';
      default:
        return '📷';
    }
  };

  // Label per media type
  const getLabel = () => {
    switch (type) {
      case 'image':
        return 'תמונה';
      case 'video':
        return 'וידאו';
      case 'landscape-video':
        return 'וידאו לרוחב';
      case 'portrait-video':
        return 'וידאו אורך (Reel)';
      default:
        return 'מדיה';
    }
  };

  return (
    <div className={`media-placeholder-container ${className}`}>
      {/* Main container with aspect ratio */}
      <div 
        className={`
          relative w-full overflow-hidden rounded-xl
          ${aspectRatioClass}
          bg-white/5 border border-white/10
          ${loading ? 'animate-pulse' : ''}
        `}
        role="img"
        aria-label={alt}
      >
        {/* If src exists, show actual media */}
        {src ? (
          type.includes('video') ? (
            <video
              src={src}
              className="absolute inset-0 h-full w-full object-cover"
              controls
              playsInline
              preload={priority ? 'auto' : 'metadata'}
            />
          ) : (
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading={lazy && !priority ? 'lazy' : 'eager'}
            />
          )
        ) : (
          /* Placeholder UI */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white/40">
            {/* Icon */}
            <div className="mb-3 text-5xl">
              {getIcon()}
            </div>
            
            {/* Label */}
            <p className="text-sm font-medium text-white/60">
              {getLabel()}
            </p>
            
            {/* Meta info */}
            <p className="mt-1 text-xs text-white/40">
              {aspectRatio} • {type}
            </p>
            
            {/* Loading indicator */}
            {loading && (
              <div className="mt-4">
                <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/2 animate-pulse bg-brand-blue" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p className="mt-2 text-sm text-white/70">
          {caption}
        </p>
      )}
    </div>
  );
}

/**
 * Gallery Grid - responsive grid for media placeholders
 */
interface MediaGalleryProps {
  children: React.ReactNode;
  columns?: {
    mobile: 1 | 2;
    tablet: 2 | 3;
    desktop: 3 | 4;
  };
  gap?: 2 | 3 | 4 | 6;
}

export function MediaGallery({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
}: MediaGalleryProps) {
  const gapClass = `gap-${gap}`;
  const gridClass = `
    grid
    grid-cols-${columns.mobile}
    md:grid-cols-${columns.tablet}
    lg:grid-cols-${columns.desktop}
    ${gapClass}
  `;

  return (
    <div className={gridClass}>
      {children}
    </div>
  );
}

/**
 * Carousel Container - native scroll for mobile
 */
interface MediaCarouselProps {
  children: React.ReactNode;
  gap?: 2 | 3 | 4 | 6;
}

export function MediaCarousel({ children, gap = 4 }: MediaCarouselProps) {
  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className={`flex gap-${gap} snap-x snap-mandatory`}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className="snap-center shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw]">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
