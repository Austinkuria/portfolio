'use client';

import Image from 'next/image';
import { useState, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate WebP and fallback paths
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already an optimized path, return as is
    if (originalSrc.includes('/optimized/')) {
      return originalSrc;
    }
    
    // Extract filename and extension
    const pathParts = originalSrc.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split('.')[0];
    
    // Return optimized WebP path
    return originalSrc.replace(filename, `optimized/${nameWithoutExt}.webp`);
  };

  const getFallbackSrc = (originalSrc: string) => {
    // If it's already an optimized path, return as is
    if (originalSrc.includes('/optimized/')) {
      return originalSrc;
    }
    
    // Extract filename and extension
    const pathParts = originalSrc.split('/');
    const filename = pathParts[pathParts.length - 1];
    const nameWithoutExt = filename.split('.')[0];
    const ext = filename.split('.')[1]?.toLowerCase();
    
    // Return optimized fallback path
    const fallbackExt = ext === 'png' ? 'png' : 'jpg';
    return originalSrc.replace(filename, `optimized/${nameWithoutExt}.${fallbackExt}`);
  };

  const optimizedSrc = getOptimizedSrc(src);
  const fallbackSrc = getFallbackSrc(src);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Generate a simple blur placeholder
  const generateBlurPlaceholder = (w: number, h: number) => {
    const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
    if (!canvas) return '';
    
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Create a simple gradient
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    return canvas.toDataURL();
  };

  const finalBlurDataURL = blurDataURL || (placeholder === 'blur' ? generateBlurPlaceholder(20, 20) : undefined);

  if (imageError) {
    // Fallback UI when image fails to load
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        />
      )}
      
      {/* Try optimized WebP first, fallback to optimized JPEG/PNG */}
      <picture>
        <source srcSet={optimizedSrc} type="image/webp" />
        <Image
          src={fallbackSrc}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          priority={priority}
          quality={quality}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={finalBlurDataURL}
          onError={handleError}
          onLoad={handleLoad}
          style={{ objectFit: 'cover' }}
        />
      </picture>
    </div>
  );
});

export default OptimizedImage;