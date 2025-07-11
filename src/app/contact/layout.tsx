import { contactMetadata } from './page.metadata';
import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/structuredData';
import { siteConfig } from '@/config';

export { contactMetadata as metadata };

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Contact', url: `${siteConfig.url}/contact` }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      {children}
    </>
  );
}
