// Configuration file for Next.js app router root layout
// This must be a separate file from page.ts or layout.ts files

// Metadata 
export const metadata = {
    title: {
        template: '%s | Austin Maina',
        default: 'Austin Maina | Full Stack Developer',
    },
    description: 'Building scalable solutions with code & creativity',
};

// App router configuration
export const dynamicParams = true;
export const revalidate = false; // No revalidation needed for static content
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
