'use client';

import { personalInfo } from '@/config';

/**
 * This script preloads critical routes as soon as the page loads
 * to minimize navigational delays between pages
 */

export function setupInitialPreload() {
    if (typeof window === 'undefined') return;

    // Wait until after initial page render is complete
    if (document.readyState === 'complete') {
        schedulePreload();
    } else {
        window.addEventListener('load', schedulePreload);
    }
}

function schedulePreload() {
    // Use requestIdleCallback with a timeout to ensure it runs
    if ('requestIdleCallback' in window) {
        const requestIdleCallback = (window as Window & {
            requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void
        }).requestIdleCallback;

        requestIdleCallback(() => {
            preloadCriticalRoutes();
        }, { timeout: 2000 });
    } else {
        // Fallback to setTimeout for browsers without requestIdleCallback
        setTimeout(preloadCriticalRoutes, 800);
    }
}

function preloadCriticalRoutes() {
    // Define critical routes that should be preloaded
    const criticalRoutes = [
        '/about',
        '/projects',
        '/skills',
        '/contact',
    ];

    // Preload routes in a staggered manner to avoid network congestion
    criticalRoutes.forEach((route, index) => {
        setTimeout(() => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            link.as = 'document';
            document.head.appendChild(link);

            // Also preload using fetch API for more immediate availability in Next.js cache
            fetch(route, {
                cache: 'force-cache'
            }).catch(() => {
                // Silent catch for fetch errors
            });
        }, index * 300); // Stagger preloads by 300ms each
    });

    // Preload key static assets
    preloadAssets();
}

function preloadAssets() {
    // Critical static assets (images, etc.)
    const criticalAssets = [
        personalInfo.image,
    ];

    criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = asset;
        link.as = asset.endsWith('.jpg') || asset.endsWith('.png') ? 'image' : 'fetch';
        document.head.appendChild(link);
    });
}
