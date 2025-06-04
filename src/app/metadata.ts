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
};
