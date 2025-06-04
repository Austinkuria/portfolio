'use client';

/**
 * This script preloads critical routes as soon as the page loads
 * to minimize navigational delays between pages
 */

export function setupInitialPreload() {
    if (typeof window === 'undefined') return;

    // Wait for the page to be fully loaded
    window.addEventListener('load', () => {
        // Use requestIdleCallback to avoid competing with important rendering work
        if ('requestIdleCallback' in window) {
            const requestIdleCallback = (window as Window & {
                requestIdleCallback: (callback: () => void) => void
            }).requestIdleCallback;

            requestIdleCallback(() => {
                preloadCriticalRoutes();
            });
        } else {
            // Fallback to setTimeout for browsers without requestIdleCallback
            setTimeout(preloadCriticalRoutes, 1000);
        }
    });
}

function preloadCriticalRoutes() {
    // List of routes to preload
    const routes = [
        '/about',
        '/projects',
        '/skills',
        '/contact'
    ];

    // Create a service worker to handle preloaded content in the background
    if ('serviceWorker' in navigator) {
        try {
            // Use the Cache API to store preloaded routes
            caches.open('route-cache').then(cache => {
                routes.forEach(route => {                    // Fetch the route with low priority
                    const request = new Request(route);
                    fetch(request, { cache: 'force-cache' })
                        .then(response => {
                            // Store the response in the cache
                            if (response.status === 200) {
                                cache.put(request, response);
                            }
                        })
                        .catch(() => {
                            // Ignore fetch errors
                        });
                });
            });
        } catch {
            // Fallback to simple fetch
            routes.forEach(route => {
                try {
                    fetch(route, { cache: 'force-cache' }).catch(() => { });
                } catch {
                    // Ignore fetch errors
                }
            });
        }
    } else {        // Fallback for browsers without service worker support
        routes.forEach(route => {
            try {
                fetch(route, { cache: 'force-cache' }).catch(() => { });
            } catch {
                // Ignore fetch errors
            }
        });
    }
}
