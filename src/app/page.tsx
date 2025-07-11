import Hero from '@/components/Hero';
import HomeContent from '@/components/HomeContent';
import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbSchema } from '@/lib/structuredData';
import { siteConfig } from '@/config';
import { homeMetadata } from './page.metadata';

export const metadata = homeMetadata;

export default function Home() {
  const breadcrumbItems = [
    { name: 'Home', url: siteConfig.url }
  ];

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      <main className="flex min-h-screen flex-col items-center">
        <Hero />
        <HomeContent />
      </main>
    </>
  );
}