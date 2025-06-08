import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: {
    template: '%s | Austin Maina',
    default: 'Austin Maina | Full Stack Developer',
  },
  description: 'Full Stack Developer with a passion for building scalable web applications that solve real-world problems',
  creator: 'Austin Maina',
  keywords: ['Full Stack Developer', 'Web Development', 'React', 'Node.js', 'TypeScript', 'Next.js', 'Software Engineer', 'Web Applications', 'Cloud Architecture', 'Backend Development', 'Frontend Development'],
  applicationName: 'Austin Maina Portfolio',
  authors: [
    { name: 'Austin Maina', url: 'https://austinmaina.vercel.app' },
    { name: 'GitHub', url: 'https://github.com/austinmaina' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/austin-maina/' }
  ], icons: {
    icon: '/images/am-logo.jpg',
    shortcut: '/images/am-logo.jpg',
    apple: '/images/am-logo.jpg',
  },
  openGraph: {
    title: 'Austin Maina | Full Stack Developer',
    description: 'Full Stack Developer specializing in scalable web applications built with React, Node.js, and modern cloud architecture.',
    url: 'https://austinmaina.vercel.app',
    siteName: 'Austin Maina Portfolio',
    images: [
      {
        url: '/images/am-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Austin Maina - Full Stack Developer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://austinmaina.vercel.app',
  },
  metadataBase: new URL('https://austinmaina.vercel.app'),
  verification: {
    google: 'google771005efe7b937ff'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};
