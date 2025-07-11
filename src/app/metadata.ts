import type { Metadata } from 'next';
import { personalInfo, siteConfig, socialLinks, seoConfig } from '@/config';

export const siteMetadata: Metadata = {
  title: {
    template: seoConfig.titleTemplate,
    default: seoConfig.defaultTitle,
  },
  description: seoConfig.descriptions.home,
  creator: personalInfo.name.full,
  keywords: seoConfig.keywords,
  applicationName: siteConfig.applicationName,
  authors: [
    { name: personalInfo.name.full, url: siteConfig.url },
    { name: 'GitHub', url: socialLinks.github },
    { name: 'LinkedIn', url: socialLinks.linkedin }
  ],
  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.descriptions.home,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    images: [
      {
        url: seoConfig.openGraph.images.url,
        width: seoConfig.openGraph.images.width,
        height: seoConfig.openGraph.images.height,
        alt: seoConfig.openGraph.images.alt,
      },
    ],
    locale: seoConfig.openGraph.locale,
    type: seoConfig.openGraph.type,
  },
  twitter: {
    card: seoConfig.twitter.card,
    site: seoConfig.twitter.site,
    creator: seoConfig.twitter.creator,
    title: seoConfig.defaultTitle,
    description: seoConfig.descriptions.home,
    images: [seoConfig.openGraph.images.url],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  metadataBase: new URL(siteConfig.url),
  verification: {
    google: siteConfig.googleSiteVerification
  },
  robots: seoConfig.robots,
  // Additional meta tags for better SEO
  other: seoConfig.additionalMetaTags.reduce((acc, tag) => {
    acc[tag.name] = tag.content;
    return acc;
  }, {} as Record<string, string>),
};
