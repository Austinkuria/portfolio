'use client';

import HomeProjectsSection from '@/components/sections/HomeProjectsSection';
import HomeSkillsSection from '@/components/sections/HomeSkillsSection';
import HomeAboutSection from '@/components/sections/HomeAboutSection';

export default function HomeContent() {
  return (
    <>
      <HomeProjectsSection />
      <HomeSkillsSection />
      <HomeAboutSection />
    </>
  );
}
