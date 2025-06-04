import type { Metadata } from 'next';

// Shared metadata for the entire application
export const siteMetadata: Metadata = {
  title: {
    template: '%s | Austin Maina',
    default: 'Austin Maina | Full Stack Developer',
  },
  description: 'Building scalable solutions with code & creativity',
  creator: 'Austin Maina',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Austin Maina | Full Stack Developer',
    description: 'Building scalable solutions with code & creativity',
    url: 'https://yourdomain.com', // Replace with your real domain
    siteName: 'Austin Maina Portfolio',
    images: [
      {
        url: '/images/Passport_Photo_AustinMaina.jpg',
        width: 800,
        height: 600,
        alt: 'Austin Maina',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin Maina | Full Stack Developer',
    description: 'Building scalable solutions with code & creativity',
    creator: '@yourtwitter', // Replace with your Twitter handle
    images: ['/images/Passport_Photo_AustinMaina.jpg'],
  },
  metadataBase: new URL('https://yourdomain.com'), // Replace with your real domain
};
