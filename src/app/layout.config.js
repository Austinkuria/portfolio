// Configuration file for Next.js app router root layout
// This must be a separate file from page.ts or layout.ts files

// Import configuration
const { personalInfo, seoConfig } = require('@/config');

// Metadata 
export const metadata = {
    title: {
        template: seoConfig.titleTemplate,
        default: seoConfig.defaultTitle,
    },
    description: personalInfo.description,
};

// App router configuration
export const dynamicParams = true;
export const revalidate = false; // No revalidation needed for static content
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
