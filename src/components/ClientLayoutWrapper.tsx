'use client';

import { useState, useEffect, useCallback, Suspense, ReactNode } from 'react';
import LoadingIndicator from './LoadingIndicator';
import { initChunkErrorHandling } from '@/lib/chunkErrorHandler';
import dynamic from 'next/dynamic';

// Import NavigationEvents using dynamic() to properly handle clientside rendering
const NavigationEvents = dynamic(() => import('./NavigationEvents'), {
  ssr: false,
});

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  // Use memoized state to prevent unnecessary renders
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Create a memoized loading state setter
  const setLoadingWithDebounce = useCallback((loading: boolean) => {
    if (loading) {
      // Add a small delay before showing the loading indicator to prevent flashing
      const timer = setTimeout(() => {
        setIsLoading(true);
        setHasError(false);
      }, 180);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      return () => {};
    }
  }, []);
  // Preload key pages for better performance
  useEffect(() => {
    // Preload important routes in the background
    const pagesToPreload = ['/about', '/projects', '/skills', '/contact'];
    
    // Use requestIdleCallback for non-blocking preloading
    if ('requestIdleCallback' in window) {
      const requestIdleCallback = (window as Window & {
        requestIdleCallback: (callback: () => void) => void;
      }).requestIdleCallback;
        requestIdleCallback(() => {        pagesToPreload.forEach(page => {
          try {
            fetch(page, { cache: 'force-cache' }).catch(() => {});
          } catch {
            // Ignore fetch errors
          }
        });
      });
    }
  }, []);
  // Initialize chunk error handling
  useEffect(() => {
    // Use our specialized chunk error handler
    initChunkErrorHandling();
    
    // Set up local error state for UI feedback
    const handleError = () => {
      setHasError(true);
    };
    
    window.addEventListener('chunkError', handleError);
    
    return () => {
      window.removeEventListener('chunkError', handleError);
    };
  }, []);  return (
    <>      {/* Use NavigationEvents component to track route changes - wrapped in Suspense */}
      <Suspense fallback={null}>
        <NavigationEvents setLoading={setLoadingWithDebounce} />
      </Suspense>
      
      {/* Only show loading indicator when actually loading */}
      {isLoading && <LoadingIndicator />}
      
      {/* Show error UI when needed */}
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
        <Suspense fallback={<LoadingIndicator />}>
          {children}
        </Suspense>
      )}
    </>
  );
}

// You would then need to modify your Link components to dispatch this event:
// Example for a custom Link component:
/*
import NextLink, { LinkProps } from 'next/link';

const CustomLink = (props: LinkProps & { children: React.ReactNode; className?: string }) => {
  const handleClick = () => {
    window.dispatchEvent(new Event('navigationStart'));
  };
  return <NextLink {...props} onClick={handleClick}>{props.children}</NextLink>;
};
export default CustomLink;
*/
