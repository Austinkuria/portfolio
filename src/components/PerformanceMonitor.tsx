'use client';

import { useEffect, memo } from 'react';

const PerformanceMonitor = memo(function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime.toFixed(2) + 'ms');
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // Fallback for browsers that don't support paint timing
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime.toFixed(2) + 'ms');
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers that don't support LCP
      }

      // Cumulative Layout Shift
      let cumulativeLayoutShiftScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShiftScore += entry.value;
          }
        }
        console.log('CLS:', cumulativeLayoutShiftScore.toFixed(4));
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Fallback for browsers that don't support CLS
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime + 'ms');
        }
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Fallback for browsers that don't support FID
      }

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        console.log('TTFB:', ttfb.toFixed(2) + 'ms');
      }

      // Resource loading performance
      const checkResourceTiming = () => {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources.filter((resource: any) => 
          resource.duration > 1000 && resource.name.includes(window.location.origin)
        );
        
        if (slowResources.length > 0) {
          console.warn('Slow loading resources detected:', slowResources);
        }
      };

      // Check after page load
      if (document.readyState === 'complete') {
        setTimeout(checkResourceTiming, 1000);
      } else {
        window.addEventListener('load', () => {
          setTimeout(checkResourceTiming, 1000);
        });
      }

      // Memory usage monitoring (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
        });
      }

      // Cleanup observers
      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
});

export default PerformanceMonitor;