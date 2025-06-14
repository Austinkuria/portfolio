'use client';

import { useEffect, useState } from 'react';
import HomeProjectsSection from '@/components/sections/HomeProjectsSection';
import HomeSkillsSection from '@/components/sections/HomeSkillsSection';
import HomeAboutSection from '@/components/sections/HomeAboutSection';
import { useSafeRender, setupHydrationFallback, forceRouteRehydration } from '@/lib/renderSafety';

// Simple fallback component to show when content is loading
const SectionFallback = () => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-muted-foreground/20 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground">Loading content...</p>
    </div>
  );
};

export default function HomeContent() {
  const { isMounted, renderAttempts } = useSafeRender();
  const [forcedRender, setForcedRender] = useState(false);

  // Preload assets and setup safety checks
  useEffect(() => {
    // Preload key images to prevent layout shifts
    const imagesToPreload = [
      '/images/clinique-beauty.png',
      '/images/attendance-system.png',
      '/images/Passport_Photo_AustinMaina.jpg',
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Setup hydration failsafe
    setupHydrationFallback();
    
    // Force route rehydration for all pages to prevent blank content
    forceRouteRehydration();

    // Force a re-render after a delay if still not displaying content
    const timeoutId = setTimeout(() => {
      setForcedRender(true);
    }, 2000);
    
    // Set up a global listener to help fix blank pages after navigation
    const navigationHandler = () => {
      if (typeof window !== 'undefined') {
        // Force a reflow after navigation completes
        setTimeout(() => {
          forceRouteRehydration();
        }, 500);
      }
    };
    
    document.addEventListener('navigationComplete', navigationHandler);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('navigationComplete', navigationHandler);
    };
  }, []);

  // If not mounted yet on client-side, show minimal skeleton
  if (!isMounted) {
    return <SectionFallback />;
  }

  // Active key helps force re-render if needed
  const renderKey = `home-content-${renderAttempts}-${forcedRender ? 'forced' : 'normal'}`;

  return (
    <div key={renderKey} className="w-full">
      <HomeProjectsSection />
      <HomeSkillsSection />
      <HomeAboutSection />
    </div>
  );
}
