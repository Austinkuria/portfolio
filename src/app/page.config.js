// Configuration file for Next.js app router
// This must be a separate file from page.ts or layout.ts files

// From page.metadata.ts
export const metadata = {
    title: 'Austin Maina | Full Stack Developer',
    description: 'Building scalable solutions with code & creativity',
};

// SEO and performance settings
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate at most every hour

// App router configuration
export const dynamicParams = true;
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
