'use client';

import { FaArrowRight } from 'react-icons/fa';
import CustomLink from '@/components/CustomLink';
import { MotionDiv } from '@/lib/motion';
import { personalInfo } from '@/config';

export default function HomeAboutSection() {
  return (
    <section id="home-about" className="pt-2 pb-20 w-full">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 rounded-3xl border bg-card p-8 md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Why clients work with me</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">Built for small teams that need a proper online front door.</h2>
            <p className="text-muted-foreground mb-6">
              {personalInfo.name.full} is a developer based in {personalInfo.location} who builds sites, landing pages, and lightweight web apps that feel credible, work fast, and are easy to hand off.
            </p>            <CustomLink
              href="/about"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Learn more about the approach
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </CustomLink>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-4"
          >
            {[
              'Clear scope before code starts',
              'Design and build that stay aligned',
              'Fast communication without the agency overhead',
              'Projects that are easy to maintain after launch',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-background/70 px-4 py-4 text-sm text-foreground shadow-sm">
                {item}
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
              This site still works as a portfolio: projects, contact details, and a real resume remain available for hiring managers and clients.
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
