'use client';

import CustomLink from '@/components/CustomLink';
import { contactConfig, personalInfo, socialLinks } from '@/config';
import { MotionDiv } from '@/lib/motion';
import { FaArrowRight, FaCheckCircle, FaClock, FaLocationArrow } from 'react-icons/fa';

const offers = [
  'Websites that feel credible on first glance',
  'Landing pages that turn interest into calls',
  'MVPs and internal tools shipped without bloat',
  'Payments, fixes, and support when the site needs it',
];

const signals = [
  { label: 'Response time', value: contactConfig.responseTime },
  { label: 'Location', value: personalInfo.location },
  { label: 'Availability', value: contactConfig.availability.statusMessage },
];

export default function Hero() {
  const scrollToNextSection = () => {
    const homeAgencySection = document.getElementById('home-agency');
    if (homeAgencySection) {
      homeAgencySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden px-4 pb-20 pt-24 md:pb-28 md:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_30%),radial-gradient(circle_at_top_right,_hsl(var(--accent)/0.14),_transparent_24%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--muted)/0.22))]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="max-w-3xl">
            {/* <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Software E
              </span>
            </MotionDiv> */}

            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05 }}
              className="space-y-6"
            >
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.03]">
                Websites and web apps that make a business feel established before the first call.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                I help founders, solo operators, and small teams turn rough ideas, outdated sites, or half-finished builds into clear, credible experiences people trust enough to contact.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <CustomLink
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  See selected work <FaArrowRight className="h-4 w-4" />
                </CustomLink>
                <CustomLink
                  href={socialLinks.calendly}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  Book a call
                </CustomLink>
              </div>
            </MotionDiv>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {signals.map((signal) => (
                <div key={signal.label} className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{signal.label}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{signal.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {offers.map((offer) => (
                <span key={offer} className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-sm text-muted-foreground">
                  {offer}
                </span>
              ))}
            </div>
          </div>

          <MotionDiv
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <div className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_24px_80px_-40px_hsl(var(--primary)/0.55)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">What I build</p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">A short list, done properly</h2>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Nairobi</div>
              </div>

              <div className="mt-5 space-y-4">
                {offers.map((offer, index) => (
                  <div key={offer} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-foreground">{offer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><FaClock className="h-3.5 w-3.5 text-primary" /> {contactConfig.responseTime}</span>
                  <span className="inline-flex items-center gap-1.5"><FaLocationArrow className="h-3.5 w-3.5 text-primary" /> {personalInfo.location}</span>
                  <span className="inline-flex items-center gap-1.5"><FaCheckCircle className="h-3.5 w-3.5 text-primary" /> {contactConfig.availability.statusMessage}</span>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>

      <MotionDiv
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <button
          onClick={scrollToNextSection}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          aria-label="Scroll to services"
        >
          Scroll to services <FaArrowRight className="h-3.5 w-3.5 rotate-90" />
        </button>
      </MotionDiv>
    </section>
  );
}