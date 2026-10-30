'use client';

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

const services = [
  {
    number: '01',
    title: 'Websites & Web Applications',
    description:
      'We design and engineer fast, mobile-first, and conversion-focused web platforms, portals, and custom web applications built with modern frameworks and resilient architectures.',
    result: 'The result: sub-second load times, higher conversion rates, and effortless user experiences.',
    href: '/services',
  },
  {
    number: '02',
    title: 'Systems Integration & API Development',
    description:
      'We connect your existing tools, legacy platforms, and third-party services into one seamless ecosystem covering APIs, payments (M-Pesa, Stripe), CRMs, ERPs, and more.',
    result: 'The result: less friction, fewer data silos, and seamless consistency.',
    href: '/services',
  },
  {
    number: '03',
    title: 'AI & Intelligent Automation',
    description:
      'We help organizations automate processes, improve accuracy, and make smarter decisions through predictive analytics, AI assistants, intelligent reporting, and risk monitoring.',
    result: 'The result: lower operating costs and faster, data-driven action.',
    href: '/services',
  },
];

export default function HomeWhatWeBuildSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="w-full py-10 sm:py-14 bg-[#faf8f5] dark:bg-card/40 transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 reveal-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4">
            Engineering Practice
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            What We Build.
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Purpose-built for organizations that cannot afford failure. Every system we deliver is designed for resilience, compliance, and long-term maintainability.
          </p>
        </div>

        {/* 3 Core Services Cards (Left / Up / Right Sliding Scroll Transitions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {services.map((service, idx) => {
            // Card 0 slides from left, 1 from bottom, 2 from right (Overflow-college style)
            const revealClass =
              idx === 0
                ? 'reveal-left stagger-1'
                : idx === 1
                ? 'reveal-up stagger-2'
                : 'reveal-right stagger-3';

            return (
              <div
                key={service.title}
                className={`${revealClass} rounded-[2.5rem] bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/40 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block font-mono">
                    {service.number}
                  </span>

                  <h3 className="text-xl sm:text-[22px] font-bold text-foreground mb-4 tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Highlighted Result Callout & Service Link */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm font-semibold text-primary">
                    {service.result}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Services Button - Explicitly Linking to /services */}
        <div className="text-center reveal-up stagger-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Explore All Services & Engineering Offerings</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

      </div>
    </section>
  );
}
