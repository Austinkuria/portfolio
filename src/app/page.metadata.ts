import { personalInfo, siteConfig, seoConfig } from '@/config';

// Page-specific metadata for the homepage
export const homeMetadata = {
  title: seoConfig.defaultTitle,
  description: seoConfig.descriptions.home,
  alternates: {
    canonical: siteConfig.url
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.descriptions.home,
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/api/og?title=${encodeURIComponent(personalInfo.name.full)}&description=${encodeURIComponent(personalInfo.tagline)}&type=default`,
        width: seoConfig.openGraph.images.width,
        height: seoConfig.openGraph.images.height,
        alt: personalInfo.name.full,
      },
    ],
  },
  twitter: {
    card: seoConfig.twitter.card,
    title: seoConfig.defaultTitle,
    description: seoConfig.descriptions.home,
    images: [`${siteConfig.url}/api/og?title=${encodeURIComponent(personalInfo.name.full)}&description=${encodeURIComponent(personalInfo.tagline)}&type=default`],
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
