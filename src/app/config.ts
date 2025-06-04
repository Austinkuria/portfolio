/**
 * Configuration constants for the application
 * These are separated from layout/page files to optimize Fast Refresh
 */

// Pages to prefetch for better navigation performance
export const PREFETCH_PAGES = ['/about', '/projects', '/skills', '/blog', '/contact'];

// NextJS build configuration options
export const DYNAMIC_PARAMS = true;
export const REVALIDATE = false; // No revalidation needed for static content
export const FETCH_CACHE = 'force-cache'; // Aggressively cache all fetches
export const RUNTIME = 'nodejs';
export const PREFERRED_REGION = 'auto';