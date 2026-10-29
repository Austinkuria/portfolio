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
    numericValue: 50,
    suffix: '+',
    label: 'Enterprise Systems Delivered',
    subtext: 'Robust production web platforms, automated backends, and cloud architectures.',
  },
  {
    numericValue: 90,
    suffix: '+',
    label: 'Deployments & Builds Shipped',
    subtext: 'High-availability services, web apps, and data systems deployed at scale.',
  },
  {
    numericValue: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'Production Uptime & Reliability',
    subtext: 'Engineered for resilience, fault-tolerant failovers, and low latency.',
  },
  {
    numericValue: 4,
    suffix: '+',
    label: 'Years Delivering at Scale',
    subtext: 'Translating complex organizational logic into reliable software systems.',
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
      className="relative z-20 w-full py-16 sm:py-24 bg-background transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Overview Box directly below Hero - slides in from left on scroll */}
        <div className="reveal-left rounded-[2.5rem] bg-card border border-border/80 shadow-lg p-8 sm:p-12 lg:p-16 mb-12 sm:mb-16 relative overflow-hidden">
          {/* Subtle ambient light gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-5 leading-tight">
              AM Softwares <span className="text-primary">Ke</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">AM Softwares Ke</strong> is a technology engineering studio focused on delivering enterprise-grade digital systems for modern organizations. We design, build, and scale secure, high-impact software solutions that help businesses, startups, and institutions optimize operations, improve decision-making, and drive measurable value. Our strength lies in translating complex business requirements into reliable, scalable, and future-ready systems powered by modern technologies.
            </p>
          </div>
        </div>

        {/* 4 Big Enterprise Stats with Animated Numbers & Scroll Slides */}
        <div className="rounded-[2.5rem] bg-card/95 backdrop-blur-md border border-border/80 shadow-md p-7 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {stats.map((stat, idx) => {
              // Directional entrances modeled after Overflow-college:
              // 0 from left, 1 & 2 from below, 3 from right, with staggered delays
              const revealClass =
                idx === 0
                  ? 'reveal-left stagger-1'
                  : idx === 1
                  ? 'reveal-up stagger-2'
                  : idx === 2
                  ? 'reveal-up stagger-3'
                  : 'reveal-right stagger-4';

              return (
                <div
                  key={stat.label}
                  className={`${revealClass} ${
                    idx > 0 ? 'pt-6 sm:pt-0 sm:pl-6 lg:pl-8' : ''
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

                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-2 leading-snug">
                      {stat.label}
                    </h3>

                    <p className="text-xs sm:text-[13.5px] text-muted-foreground leading-relaxed">
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
