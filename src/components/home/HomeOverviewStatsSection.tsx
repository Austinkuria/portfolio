'use client';

import useRevealOnScroll from '@/hooks/useRevealOnScroll';
import AnimatedCounter from '@/components/common/AnimatedCounter';

interface StatItem {
  numericValue: number;
  suffix?: string;
  decimals?: number;
  label: string;
  subtext: string;
}

const stats: StatItem[] = [
  {
    numericValue: 6,
    suffix: '+',
    label: 'Systems Delivered',
    subtext: 'Robust production web platforms, automated backends, and cloud architectures.',
  },
  {
    numericValue: 10,
    suffix: '+',
    label: 'Production Deploys',
    subtext: 'High-availability services, web apps, and data systems deployed to production.',
  },
  {
    numericValue: 99,
    suffix: '%',
    label: 'Production Uptime',
    subtext: 'Engineered for resilience, fault-tolerant failovers, and continuous monitoring.',
  },
];

export default function HomeOverviewStatsSection() {
  const sectionRef = useRevealOnScroll<HTMLElement>({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
    once: false,
  });

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full py-8 sm:py-12 bg-background transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        
        {/* Overview Box directly below Hero */}
        <div className="reveal-left rounded-[2.5rem] bg-card border border-border/80 shadow-lg p-6 sm:p-10 lg:p-12 mb-8 sm:mb-10 relative overflow-hidden">
          {/* Subtle ambient light gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
              AM<span className="text-primary">LABS</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">AMLABS</strong> is a software engineering studio focused on delivering dependable digital systems and payment integrations for modern organizations and businesses. We design, build, and scale secure software solutions that optimize operations, improve decision-making, and drive measurable value.
            </p>
          </div>
        </div>

        {/* 3 Grounded Stats with Animated Numbers & Scroll Slides */}
        <div className="rounded-[2.5rem] bg-card/95 backdrop-blur-md border border-border/80 shadow-md p-7 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border/60">
            {stats.map((stat, idx) => {
              const revealClass =
                idx === 0
                  ? 'reveal-left stagger-1'
                  : idx === 1
                  ? 'reveal-up stagger-2'
                  : 'reveal-right stagger-3';

              return (
                <div
                  key={stat.label}
                  className={`${revealClass} ${
                    idx > 0 ? 'pt-6 md:pt-0 md:pl-8 lg:pl-10' : ''
                  } flex flex-col justify-between`}
                >
                  <div>
                    <div className="mb-2 flex items-baseline">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-mono">
                        <AnimatedCounter
                          value={stat.numericValue}
                          suffix={stat.suffix}
                          decimals={stat.decimals}
                          duration={2.2}
                        />
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 leading-snug">
                      {stat.label}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {stat.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
