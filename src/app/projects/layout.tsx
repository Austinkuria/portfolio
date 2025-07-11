import { projectsMetadata } from './page.metadata';
import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/structuredData';
import { siteConfig } from '@/config';

export const metadata = projectsMetadata;

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Projects', url: `${siteConfig.url}/projects` }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      {children}
    </>
  );
}
