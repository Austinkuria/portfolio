'use client';

import { useEffect } from 'react';
import { forceRouteRehydration } from '@/lib/renderSafety';

/**
 * A simple handler that ensures all pages load properly
 * without requiring complex edits to every page. This monitors for and fixes
 * blank page issues that occur on navigation in a Next.js app.
 */
export default function BlankPageFixer() {
  useEffect(() => {
    // Apply fixes on initial render
    forceRouteRehydration();
      // Create a MutationObserver to detect when the page content changes
    const observer = new MutationObserver((mutations) => {
      // Check if main content suddenly disappears or changes significantly
      const hasContentChanges = mutations.some(mutation => 
        mutation.target.nodeName === 'MAIN' || 
        (mutation.target instanceof Element && mutation.target.closest('main'))
      );
      
      if (hasContentChanges) {
        // Content changed - ensure it's properly displayed
        setTimeout(() => {
          forceRouteRehydration();
        }, 200);
      }
    });
    
    // Start observing the document body for content changes
    observer.observe(document.body, { 
      subtree: true, 
      childList: true
    });
    
    // Listen for navigation events
    const handleNavigation = () => {
      // Force page to render correctly after navigation
      setTimeout(() => {
        forceRouteRehydration();
      }, 100);
    };
    
    window.addEventListener('popstate', handleNavigation);
    document.addEventListener('nextjs:afterPageChange', handleNavigation);
    document.addEventListener('navigationComplete', handleNavigation);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('nextjs:afterPageChange', handleNavigation);
      document.removeEventListener('navigationComplete', handleNavigation);
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
}
