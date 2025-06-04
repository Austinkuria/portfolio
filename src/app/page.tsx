import Hero from '@/components/Hero';
import HomeContent from '@/components/HomeContent';

export const metadata = {
  title: 'Austin Maina | Full Stack Developer',
  description:
    'Building scalable solutions with code & creativity. Portfolio, projects, and contact for Austin Maina, a full stack developer based in Nairobi.',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <HomeContent />
    </main>
  );
}