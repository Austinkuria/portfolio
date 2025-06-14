'use client';

import { useState, useEffect } from 'react';

/**
 * Track rendering performance and issues
 */
const performanceMetrics = {
    hydrationAttempts: 0,
    rehydrations: 0,
    blankDetections: 0,
    navigationCompletions: 0,
    lastRoute: '',
};

/**
 * A utility hook to ensure that components are safely rendered only on client-side
 * This helps prevent hydration mismatches and blank screen issues
 */
export function useSafeRender() {
    const [isMounted, setIsMounted] = useState(false);
    const [renderAttempts, setRenderAttempts] = useState(0);

    useEffect(() => {
        // Mark component as mounted
        setIsMounted(true);
        performanceMetrics.hydrationAttempts++;

        // Safety mechanism for re-rendering if content doesn't appear
        const timeoutId = setTimeout(() => {
            setRenderAttempts(prev => {
                const newValue = prev + 1;
                if (newValue > 1) {
                    performanceMetrics.rehydrations++;
                    console.debug('[RenderSafety] Re-render attempt:', newValue, performanceMetrics);
                }
                return newValue;
            });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);

    return { isMounted, renderAttempts };
}

/**
 * A utility function to safely rehydrate the page if content is missing
 */
export function setupHydrationFallback() {
    if (typeof window === 'undefined') return;    // Track navigation pattern
    try {
        const currentPath = window.location.pathname; if (performanceMetrics.lastRoute !== currentPath) {
            performanceMetrics.lastRoute = currentPath;
            console.debug('[RenderSafety] Navigation to:', currentPath);
        }
    } catch {
        // Ignore any errors in tracking
    }

    // Safety timeout to check if content has rendered properly
    setTimeout(() => {
        const mainContent = document.querySelector('main');
        const hasVisibleChildren = mainContent &&
            Array.from(mainContent.children).some(
                child => (child as HTMLElement).offsetHeight > 10
            );

        // If no visible content after loading is complete, force a re-render
        if (!hasVisibleChildren) {
            performanceMetrics.blankDetections++;
            console.warn('[RenderSafety] Content missing after loading, triggering re-render',
                { path: window.location.pathname, metrics: performanceMetrics });            // Force reflow with more aggressive technique
            document.body.style.display = 'none';
            void document.body.offsetHeight; // Force reflow
            document.body.style.display = '';

            // Additional recovery - force React to rehydrate
            document.dispatchEvent(new Event('visibilitychange'));
            window.dispatchEvent(new Event('resize'));
        }
    }, 1000);

    // Listen for navigation completion events
    document.addEventListener('navigationComplete', () => {
        performanceMetrics.navigationCompletions++;
        console.debug('[RenderSafety] Navigation completed', performanceMetrics);
    });
}

/**
 * Fix for specific route issues - call this on problematic routes
 */
export function forceRouteRehydration() {
    if (typeof window === 'undefined') return;

    requestAnimationFrame(() => {
        // Force React to recalculate layout
        window.dispatchEvent(new Event('resize'));

        // Add a small delay then check for content
        setTimeout(() => {
            const main = document.querySelector('main');
            if (main && (!main.children.length || main.getBoundingClientRect().height < 20)) {
                console.warn('[RenderSafety] Empty main content detected, forcing rehydration');
                // Force reflow with strongest approach
                main.style.opacity = '0';
                void main.offsetHeight; // Force reflow
                main.style.opacity = '1';
                main.style.minHeight = '100vh';
            }
        }, 200);
    });
}
