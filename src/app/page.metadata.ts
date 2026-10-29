import { siteConfig, seoConfig } from '@/config';

// Page-specific metadata for the homepage
export const homeMetadata = {
  title: 'AM LABS | Digital Systems & Software Engineering',
  description: 'Enterprise digital systems, full-stack web applications, AI automation, and payment infrastructure engineered by AM LABS.',
  alternates: {
    canonical: siteConfig.url
  },
  keywords: [
    'AM LABS',
    'Austin Maina',
    'Enterprise Software Engineering',
    'Full Stack Web Applications',
    'M-Pesa API Integration',
    'AI Workflow Automation',
    'Next.js Developer',
    'Scalable Cloud Architecture',
  ],
  openGraph: {
    title: 'AM LABS | Digital Systems & Software Engineering',
    description: 'Enterprise-grade digital systems, custom web applications, AI automation, and resilient payment infrastructure.',
    type: 'website',
    url: siteConfig.url,
    images: [
      {
        url: seoConfig.openGraph.images.url,
        width: seoConfig.openGraph.images.width,
        height: seoConfig.openGraph.images.height,
        alt: 'AM LABS - Enterprise Digital Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AM LABS | Digital Systems & Software Engineering',
    description: 'Enterprise-grade digital systems, AI automation, and payment infrastructure.',
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
