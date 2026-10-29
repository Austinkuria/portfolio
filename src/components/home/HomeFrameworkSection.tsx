'use client';

import Link from 'next/link';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import useRevealOnScroll from '@/hooks/useRevealOnScroll';

const phases = [
  {
    step: '01',
    phase: 'Steps 01 – 06',
    stageName: 'Discovery & Scoping',
    title: 'NDA, Requirements & Architecture',
    description:
      'We begin with a direct consultation, sign a mutual NDA to protect your IP, run a structured requirements workshop, and deliver a comprehensive architectural proposal before a single line of code is written.',
    highlights: [
      'Confidentiality & mutual NDA protection',
      'System scope & modern tech stack design',
      'Milestone timeline & transparent pricing',
    ],
  },
  {
    step: '02',
    phase: 'Steps 07 – 11',
    stageName: 'Planning & Execution',
    title: 'Sprints, Staging & Quality Assurance',
    description:
      'We map concrete deliverables, set up your private staging environment, and execute agile development sprints with bi-weekly live demos and thorough quality checks.',
    highlights: [
      'Milestone mapping & private staging server',
      'Bi-weekly progress walkthroughs & demos',
      'Functional, security & payment flow testing',
    ],
  },
  {
    step: '03',
    phase: 'Steps 12 – 13',
    stageName: 'Launch & Partnership',
    title: 'Handover & Technical Partnership',
    description:
      'We deploy to production and hand over 100% repository and source code ownership with zero lock-in, then remain your technical partner for continuous maintenance and scaling.',
    highlights: [
      '100% source code & repo ownership handover',
      'Zero vendor lock-in & full documentation',
      'Continuous uptime, security & feature updates',
    ],
  },
];

export default function HomeFrameworkSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-24 bg-[#faf8f5] dark:bg-card/40 transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">

        {/* Section Header Aligned to The Blueprint */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 reveal-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4">
            The Blueprint
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5">
            How We Build <span className="text-primary">Your Software</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A structured workflow aligned with our engineering blueprint—taking your project from initial concept to production without surprises.
          </p>
        </div>

        {/* 3 Blueprint Phases Grid with Directional Scroll Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {phases.map((item, idx) => {
            const revealClass =
              idx === 0
                ? 'reveal-left stagger-1'
                : idx === 1
                ? 'reveal-up stagger-2'
                : 'reveal-right stagger-3';

            return (
              <div
                key={item.title}
                className={`${revealClass} rounded-[2.5rem] bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/40 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {item.step}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {item.phase}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                      {item.stageName}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Key Blueprint Steps Included */}
                  <div className="pt-4 border-t border-border/60">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Blueprint Highlights
                    </h4>
                    <ul className="space-y-2">
                      {item.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-foreground font-medium">
                          <FaCheckCircle className="text-primary text-xs shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/40">
                  <Link
                    href="/process"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>See stages in Blueprint</span>
                    <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to Full Blueprint */}
        <div className="text-center reveal-up stagger-4">
          <Link
            href="/process"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Explore the Full 13-Stage Blueprint</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

      </div>
    </section>
  );
}
