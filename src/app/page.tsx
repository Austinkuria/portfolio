import Hero from '@/components/Hero';
import HomeOverviewStatsSection from '@/components/home/HomeOverviewStatsSection';
import HomeWhatWeBuildSection from '@/components/home/HomeWhatWeBuildSection';
import HomeCapabilitiesSection from '@/components/home/HomeCapabilitiesSection';
import HomeCaseStudiesSection from '@/components/home/HomeCaseStudiesSection';
import HomeFrameworkSection from '@/components/home/HomeFrameworkSection';
import HomeCtaBanner from '@/components/home/HomeCtaBanner';

export const metadata = {
  title: 'AM LABS | Digital Systems & Software Engineering',
  description:
    'Engineering high-performance enterprise digital systems, custom web applications, AI automation, and resilient payment infrastructure.',
};

// Enable static generation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full overflow-x-hidden">
      <Hero />
      <HomeOverviewStatsSection />
      <HomeWhatWeBuildSection />
      <HomeCapabilitiesSection />
      <HomeCaseStudiesSection />
      <HomeFrameworkSection />
      <HomeCtaBanner />
    </main>
  );
}