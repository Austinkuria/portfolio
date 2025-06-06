import type { Metadata } from 'next';

// Shared metadata for the entire application
export const siteMetadata: Metadata = {
  title: {
    template: '%s | Austin Maina',
    default: 'Austin Maina | Full Stack Developer',
  },
  description: 'Full Stack Developer with a passion for building scalable web applications that solve real-world problems',
  creator: 'Austin Maina',
  keywords: ['Full Stack Developer', 'Web Development', 'React', 'Node.js', 'TypeScript', 'Next.js'],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Austin Maina | Full Stack Developer',
    description: 'Full Stack Developer specializing in modern web applications',
    url: 'https://austinmaina.vercel.app', siteName: 'Austin Maina Portfolio',
    images: [
      {
        url: '/images/am-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Austin Maina - Full Stack Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Austin Maina | Full Stack Developer',
    description: 'Full Stack Developer specializing in modern web applications',
    creator: '@austinmaina', images: ['/images/am-logo.jpg'],
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
