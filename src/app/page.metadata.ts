import { personalInfo, siteConfig, seoConfig } from '@/config';

// Page-specific metadata for the homepage
export const homeMetadata = {
  title: 'Austin Maina - Full Stack Developer | Software Engineer Portfolio',
  description: 'Austin Maina - Professional Full Stack Developer & Software Engineer in Nairobi, Kenya. Specializing in React, Next.js, Node.js, TypeScript, Python & Django. Explore my portfolio of web applications and projects.',
  alternates: {
    canonical: siteConfig.url
  },
  keywords: [
    'Austin Maina',
    'Austin Maina Portfolio',
    'Austin Maina Developer',
    'Full Stack Developer Kenya',
    'Software Engineer Nairobi',
    'React Developer Kenya',
    'Next.js Developer',
    'Web Developer Kenya',
  ],
  openGraph: {
    title: 'Austin Maina - Full Stack Developer | Software Engineer Portfolio',
    description: 'Austin Maina - Professional Full Stack Developer & Software Engineer in Nairobi, Kenya. Specializing in React, Next.js, Node.js, TypeScript, Python & Django.',
    type: 'website',
    url: siteConfig.url,
    images: [
      {
        url: seoConfig.openGraph.images.url,
        width: seoConfig.openGraph.images.width,
        height: seoConfig.openGraph.images.height,
        alt: 'Austin Maina - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin Maina - Full Stack Developer',
    description: 'Professional Full Stack Developer & Software Engineer in Nairobi, Kenya',
  },
  other: {
    'application-name': siteConfig.applicationName,
    'theme-color': siteConfig.themeColor,
  },
};

// Page-specific rendering configurations
export const pageConfig = {
  dynamic: 'force-static',
  revalidate: 3600, // Revalidate at most every hour
};
