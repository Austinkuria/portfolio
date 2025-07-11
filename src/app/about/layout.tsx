import { aboutMetadata } from './page.metadata';
import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/structuredData';
import { siteConfig } from '@/config';

export const metadata = aboutMetadata;

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: siteConfig.url },
    { name: 'About', url: `${siteConfig.url}/about` }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      {children}
    </>
  );
}
