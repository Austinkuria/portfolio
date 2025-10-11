import { siteConfig, seoConfig } from '@/config';

// Page-specific metadata for the homepage
export const homeMetadata = {
  title: 'Austin Maina - Software Engineer & Full Stack Developer | MERN & PERN Stack Expert',
  description: 'Austin Maina - Software Engineer & Full Stack Developer in Nairobi, Kenya. Expert in MERN Stack (MongoDB, Express, React, Node.js) and PERN Stack (PostgreSQL, Express, React, Node.js). Specializing in React, Next.js, TypeScript, Python & Django.',
  alternates: {
    canonical: siteConfig.url
  },
  keywords: [
    'Austin Maina',
    'Austin Maina Software Engineer',
    'Austin Maina Full Stack Developer',
    'Austin Maina MERN Stack',
    'Austin Maina PERN Stack',
    'Austin Maina MERN',
    'Austin Maina PERN',
    'Austin Maina Portfolio',
    'Austin Maina Developer',
    'MERN Stack Developer Kenya',
    'PERN Stack Developer Kenya',
    'Software Engineer Kenya',
    'Software Engineer Nairobi',
    'Full Stack Developer Kenya',
    'React Developer Kenya',
    'Next.js Developer',
    'Web Developer Kenya',
  ],
  openGraph: {
    title: 'Austin Maina - Software Engineer & Full Stack Developer | MERN & PERN Stack',
    description: 'Austin Maina - Software Engineer & Full Stack Developer in Nairobi, Kenya. Expert in MERN Stack and PERN Stack. Specializing in React, Next.js, Node.js, TypeScript, Python & Django.',
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
    title: 'Austin Maina - Software Engineer & Full Stack Developer | MERN & PERN Stack',
    description: 'Software Engineer & Full Stack Developer in Nairobi, Kenya. MERN & PERN Stack Expert',
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
