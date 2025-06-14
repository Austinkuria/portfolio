'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function NavigationEvents({ setLoading }: { setLoading: (isLoading: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // When pathname or searchParams changes, we know navigation is complete
  useEffect(() => {
    // Mark navigation as complete immediately to avoid the 95% hanging issue
    setLoading(false);
  }, [pathname, searchParams, setLoading]);
  
  // Listen for client-side navigation start
  useEffect(() => {
    // Start loading when navigation begins
    const handleNavigationStart = () => {
      setLoading(true);
    };

    // Handler functions for Next.js events
    const handleBeforePageChange = () => {
      setLoading(true);
    };

    const handleAfterPageChange = () => {
      // Complete navigation immediately
      setLoading(false);
    };
    
    // Handle forced completion from the LoadingIndicator
    const handleForcedCompletion = () => {
      setLoading(false);
      
      // Force refresh of content if needed
      setTimeout(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
          // Trigger a reflow to force content to appear
          mainContent.style.opacity = '0.99';
          setTimeout(() => {
            mainContent.style.opacity = '1';
          }, 10);
        }
      }, 50);
    };
    
    window.addEventListener('navigationStart', handleNavigationStart);
    document.addEventListener('navigationComplete', handleForcedCompletion);
    
    // Add Next.js router events for better reliability
    document.addEventListener('nextjs:beforePageChange', handleBeforePageChange);
    document.addEventListener('nextjs:afterPageChange', handleAfterPageChange);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('navigationStart', handleNavigationStart);
      document.removeEventListener('nextjs:beforePageChange', handleBeforePageChange);
      document.removeEventListener('nextjs:afterPageChange', handleAfterPageChange);
      document.removeEventListener('navigationComplete', handleForcedCompletion);
    };
  }, [setLoading]);
  
  return null;
}
