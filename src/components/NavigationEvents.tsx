'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function NavigationEvents({ setLoading }: { setLoading: (isLoading: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    // When pathname or searchParams changes, we know navigation is complete
    // Add a small delay to let the progress bar complete its animation
    const completeNavigation = () => {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    };
    
    completeNavigation();
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
      setLoading(false);
    };
    
    window.addEventListener('navigationStart', handleNavigationStart);
    
    // Add Next.js router events for better reliability
    document.addEventListener('nextjs:beforePageChange', handleBeforePageChange);
    document.addEventListener('nextjs:afterPageChange', handleAfterPageChange);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('navigationStart', handleNavigationStart);
      document.removeEventListener('nextjs:beforePageChange', handleBeforePageChange);
      document.removeEventListener('nextjs:afterPageChange', handleAfterPageChange);
    };
  }, [setLoading]);
  
  return null;
}
