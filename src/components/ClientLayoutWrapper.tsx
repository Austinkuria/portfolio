'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import LoadingIndicator from './LoadingIndicator';
import { initChunkErrorHandling } from '@/lib/chunkErrorHandler';

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const pathname = usePathname();

  // Reset loading whenever pathname changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  // Activate page transition loader on route changes
  useEffect(() => {
    let safetyTimer: ReturnType<typeof setTimeout>;

    const startLoading = () => {
      setIsLoading(true);
      // Safety net: ensure loader doesn't get stuck if navigation cancels
      clearTimeout(safetyTimer);
      safetyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    };

    const stopLoading = () => {
      clearTimeout(safetyTimer);
      setIsLoading(false);
    };

    // Custom navigation events
    window.addEventListener('navigationStart', startLoading);
    window.addEventListener('navigationComplete', stopLoading);

    // Global click listener for internal navigation links
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore hash links, external links, telephone, mailto, downloads, and target="_blank"
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      // Check if it's an internal route that navigates away from current path
      try {
        const url = new URL(target.href, window.location.origin);
        if (
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname
        ) {
          startLoading();
        }
      } catch {
        // Ignore URL parse error
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('navigationStart', startLoading);
      window.removeEventListener('navigationComplete', stopLoading);
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, []);

  // Preload key pages for better performance
  useEffect(() => {
    const pagesToPreload = ['/about', '/projects', '/skills', '/contact', '/services', '/process'];
    
    if (typeof window === 'undefined') return;

    const doPreload = () => {
      pagesToPreload.forEach((page) => {
        try {
          fetch(page, { cache: 'force-cache' }).catch(() => {});
        } catch {
          // Ignore prefetch failures
        }
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(doPreload, { timeout: 2000 });
    } else {
      setTimeout(doPreload, 1000);
    }
  }, []);

  // Initialize chunk error handling
  useEffect(() => {
    initChunkErrorHandling();
    
    const handleError = () => {
      setHasError(true);
    };
    
    window.addEventListener('chunkError', handleError);
    return () => {
      window.removeEventListener('chunkError', handleError);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      
      {hasError ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex flex-col items-center p-6 bg-background rounded-lg shadow-lg border border-border max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-destructive mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="mb-4">We're having trouble loading this page. We'll try to reload automatically.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              Reload Now
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">
          {children}
        </div>
      )}
    </>
  );
}
