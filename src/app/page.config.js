// Configuration file for Next.js app router
// This must be a separate file from page.ts or layout.ts files

// Import configuration
const { personalInfo, seoConfig } = require('@/config');

// From page.metadata.ts
export const metadata = {
    title: seoConfig.defaultTitle,
    description: personalInfo.tagline,
};

// SEO and performance settings
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate at most every hour

// App router configuration
export const dynamicParams = true;
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
