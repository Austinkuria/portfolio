'use client';

import { personalInfo } from '@/config';

export default function SimpleHero() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-4 pt-28">
      <div className="max-w-4xl mx-auto text-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Hi, I'm <span className="text-primary">{personalInfo.name.first}</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          {personalInfo.tagline}
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          {personalInfo.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/projects"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View My Work
          </a>
          <a
            href="/contact"
            className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
}
