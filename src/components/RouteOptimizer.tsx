'use client';

import { useEffect } from 'react';
import { forceRouteRehydration } from '@/lib/renderSafety';

/**
 * Component that helps ensure critical routes are properly
 * hydrated and rendered, particularly when they have previously
 * encountered blank page issues.
 */
export default function RouteOptimizer({ pageName }: { pageName: string }) {
  useEffect(() => {
    // Apply our route-specific optimizations
    forceRouteRehydration();
    
    // Log metrics for this page
    console.debug(`[RouteOptimizer] Optimizing ${pageName} page rendering`);
    
    // Page-specific fixes
    if (pageName === 'contact') {
      // Form elements sometimes cause hydration issues
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.style.opacity = '0.99';
        setTimeout(() => {
          formElement.style.opacity = '1';
        }, 10);
      }
    }
    
    if (pageName === 'projects') {
      // Projects often have image galleries that can cause rendering issues
      const imageContainers = document.querySelectorAll('.relative.h-52.overflow-hidden');
      if (imageContainers.length > 0) {
        imageContainers.forEach(container => {
          (container as HTMLElement).style.minHeight = '208px';
        });
      }
    }
    
  }, [pageName]);
  
  // This component doesn't render anything visible
  return null;
}
