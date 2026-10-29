'use client';

import { useEffect } from 'react';

function triggerRehydration() {
  if (typeof window === 'undefined') return;

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));

    setTimeout(() => {
      const main = document.querySelector('main');
      if (main && (!main.children.length || main.getBoundingClientRect().height < 20)) {
        main.style.opacity = '0.99';
        void main.offsetHeight;
        main.style.opacity = '1';
      }
    }, 200);
  });
}

/**
 * A simple handler that ensures all pages load properly
 * without requiring complex edits to every page. This monitors for and fixes
 * blank page issues that occur on navigation in a Next.js app.
 */
export default function BlankPageFixer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Apply fixes on initial render
    triggerRehydration();

    // Create a MutationObserver to detect when the page content changes
    let observer: MutationObserver | null = null;
    try {
      observer = new MutationObserver((mutations) => {
        const hasContentChanges = mutations.some(
          (mutation) =>
            mutation.target.nodeName === 'MAIN' ||
            (mutation.target instanceof Element && mutation.target.closest('main')),
        );

        if (hasContentChanges) {
          setTimeout(() => {
            triggerRehydration();
          }, 200);
        }
      });

      if (document.body) {
        observer.observe(document.body, {
          subtree: true,
          childList: true,
        });
      }
    } catch {
      // Ignore if MutationObserver is restricted
    }

    // Listen for navigation events
    const handleNavigation = () => {
      setTimeout(() => {
        triggerRehydration();
      }, 100);
    };

    window.addEventListener('popstate', handleNavigation);
    document.addEventListener('nextjs:afterPageChange', handleNavigation);
    document.addEventListener('navigationComplete', handleNavigation);

    return () => {
      observer?.disconnect();
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('nextjs:afterPageChange', handleNavigation);
      document.removeEventListener('navigationComplete', handleNavigation);
    };
  }, []);

  return null;
}
