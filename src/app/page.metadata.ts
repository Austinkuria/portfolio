import { siteConfig, seoConfig } from '@/config';

// Page-specific metadata for the homepage
export const homeMetadata = {
  title: 'Austin Maina - Software Engineer & Full Stack Developer Portfolio',
  description: 'Austin Maina - Software Engineer & Full Stack Developer in Nairobi, Kenya. Specializing in React, Next.js, Node.js, TypeScript, Python & Django. Explore my portfolio of web applications and projects.',
  alternates: {
    canonical: siteConfig.url
  },
  keywords: [
    'Austin Maina',
    'Austin Maina Software Engineer',
    'Austin Maina Full Stack Developer',
    'Austin Maina Portfolio',
    'Austin Maina Developer',
    'Software Engineer Kenya',
    'Software Engineer Nairobi',
    'Full Stack Developer Kenya',
    'React Developer Kenya',
    'Next.js Developer',
    'Web Developer Kenya',
  ],
  openGraph: {
    title: 'Austin Maina - Software Engineer & Full Stack Developer',
    description: 'Austin Maina - Software Engineer & Full Stack Developer in Nairobi, Kenya. Specializing in React, Next.js, Node.js, TypeScript, Python & Django.',
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
    title: 'Austin Maina - Software Engineer & Full Stack Developer',
    description: 'Software Engineer & Full Stack Developer in Nairobi, Kenya',
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
