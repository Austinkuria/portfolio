// Page-specific metadata for the homepage
export const homeMetadata = {
  title: 'Austin Maina | Full Stack Developer',
  description: 'Building scalable solutions with code & creativity. Portfolio, projects, and contact for Austin Maina, a full stack developer based in Nairobi.',
  alternates: {
    canonical: 'https://austinmaina.vercel.app'
  },
  openGraph: {
    title: 'Austin Maina | Full Stack Developer',
    description: 'Building scalable solutions with code & creativity',
    images: [
      {
        url: '/images/am-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Austin Maina',
      },
    ],
  },
  other: {
    'application-name': 'Austin Maina Portfolio',
    'theme-color': '#ffffff',
  },
};

// Page-specific rendering configurations
export const pageConfig = {
  dynamic: 'force-static',
  revalidate: 3600, // Revalidate at most every hour
};
