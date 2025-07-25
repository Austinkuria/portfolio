import Hero from '@/components/Hero';
import HomeContent from '@/components/HomeContent';
import { personalInfo, seoConfig } from '@/config';

export const metadata = {
  title: seoConfig.defaultTitle,
  description: `${personalInfo.tagline}. Portfolio, projects, and contact for ${personalInfo.name.full}, a ${personalInfo.title.toLowerCase()} based in ${personalInfo.location}.`,
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <HomeContent />
    </main>
  );
}