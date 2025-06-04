import Hero from '@/components/Hero';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Hero />
      <HomeContent />
    </main>
  );
}