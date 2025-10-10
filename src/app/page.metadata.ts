import { personalInfo, siteConfig, seoConfig } from '@/config';

// Page-specific metadata for the homepage
export const homeMetadata = {
  title: seoConfig.defaultTitle,
  description: personalInfo.description,
  alternates: {
    canonical: siteConfig.url
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: personalInfo.description,
    images: [
      {
        url: seoConfig.openGraph.images.url,
        width: seoConfig.openGraph.images.width,
        height: seoConfig.openGraph.images.height,
        alt: personalInfo.name.full,
      },
    ],
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
