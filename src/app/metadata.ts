import type { Metadata } from 'next';
import { personalInfo, siteConfig, socialLinks, seoConfig } from '@/config';

export const siteMetadata: Metadata = {
  title: {
    template: seoConfig.titleTemplate,
    default: seoConfig.defaultTitle,
  },
  description: personalInfo.description,
  creator: personalInfo.name.full,
  keywords: seoConfig.keywords,
  applicationName: siteConfig.applicationName,
  authors: [
    { name: personalInfo.name.full, url: siteConfig.url },
    { name: 'GitHub', url: socialLinks.github },
    { name: 'LinkedIn', url: socialLinks.linkedin }
  ], icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: `${personalInfo.title} specializing in scalable web applications built with React, Node.js, and modern cloud architecture.`,
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
  alternates: {
    canonical: siteConfig.url,
  },
  metadataBase: new URL(siteConfig.url),
  verification: {
    google: siteConfig.googleSiteVerification
  },
  robots: seoConfig.robots,
};
