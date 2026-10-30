'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { socialLinks } from '@/config';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

export default function HomeCtaBanner() {
  const sectionRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="w-full py-10 sm:py-14 bg-background transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="reveal-up rounded-[2.5rem] bg-card border border-border/80 shadow-xl p-6 sm:p-10 lg:p-12 text-center max-w-5xl mx-auto relative overflow-hidden">
          {/* Subtle gradient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none rounded-t-[2.5rem]" />

          <span className="text-xs font-bold uppercase tracking-widest text-primary px-3.5 py-1 rounded-full bg-primary/10 mb-5 inline-block">
            Start a Conversation
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5 max-w-3xl mx-auto leading-tight">
            Ready to Build or Scale Your <span className="text-primary">Next Digital System?</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-9">
            Whether you are architecting a new web platform, automating complex business workflows, or scaling existing digital infrastructure, collaborate directly with dedicated software engineering leadership.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={socialLinks.calendly || '/contact'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:bg-primary/90 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <FaCalendarAlt className="text-xs" />
              <span>Book a Technical Consultation</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-muted text-foreground font-semibold text-sm border border-border/80 hover:bg-muted/80 transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <span>Send Project Inquiry</span>
              <FaArrowRight className="text-xs text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
