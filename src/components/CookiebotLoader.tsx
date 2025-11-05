'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Cookiebot?: {
      consent?: {
        method?: string;
      };
      [key: string]: unknown;
    };
  }
}

export default function CookiebotLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load Cookiebot after initial page load and a short delay
    // This prevents it from blocking initial interactions
    const loadCookiebot = () => {
      if (window.Cookiebot || isLoaded) return;

      const script = document.createElement('script');
      script.id = 'Cookiebot';
      script.src = 'https://consent.cookiebot.com/uc.js?cbid=YOUR_COOKIEBOT_CBID'; // Replace YOUR_COOKIEBOT_CBID with your actual Cookiebot ID
      script.type = 'text/javascript';
      script.async = true;

      // Set cookiebot settings
      window.Cookiebot = {
        ...(window.Cookiebot || {}),
        consent: {
          method: 'automatic'
        }
      };

      script.onload = () => {
        setIsLoaded(true);
        console.log('Cookiebot loaded successfully');
      };

      script.onerror = () => {
        console.error('Failed to load Cookiebot');
      };

      document.head.appendChild(script);
    };

    // Load after 3 seconds OR on first user interaction (whichever comes first)
    const timer = setTimeout(loadCookiebot, 3000);

    const loadOnInteraction = () => {
      clearTimeout(timer);
      loadCookiebot();
      // Remove listeners after first interaction
      window.removeEventListener('click', loadOnInteraction);
      window.removeEventListener('scroll', loadOnInteraction);
      window.removeEventListener('keydown', loadOnInteraction);
    };

    // Load on first user interaction to avoid blocking
    window.addEventListener('click', loadOnInteraction, { once: true });
    window.addEventListener('scroll', loadOnInteraction, { once: true });
    window.addEventListener('keydown', loadOnInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', loadOnInteraction);
      window.removeEventListener('scroll', loadOnInteraction);
      window.removeEventListener('keydown', loadOnInteraction);
    };
  }, [isLoaded]);

  return null; // This component doesn't render anything
}