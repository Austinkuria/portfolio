import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/structuredData';
import { siteConfig } from '@/config';

export { metadata } from './metadata';

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbItems = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Skills', url: `${siteConfig.url}/skills` }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      {children}
    </>
  );
}
