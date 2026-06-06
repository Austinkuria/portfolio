'use client';

import { FaArrowRight, FaBriefcase, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { MotionDiv } from '@/lib/motion';
import CustomLink from '@/components/CustomLink';
import { personalInfo, socialLinks } from '@/config';

export default function About() {
  return (
    <main id="about" className="py-20 w-full bg-muted/30">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">About</p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">A straight-talking studio page for clients and hiring managers.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This page keeps the personal side light and the proof visible. It should help someone decide quickly whether to hire me or reach out.
          </p>
        </MotionDiv>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border bg-card p-8 shadow-sm"
          >
            <h3 className="text-2xl font-semibold mb-4">I build the stuff that helps people trust a business faster.</h3>
            <p className="text-muted-foreground mb-6">
              I’m {personalInfo.name.full}, a developer based in {personalInfo.location}. The work here is focused on sites and apps that need to look polished, load fast, and make sense to the person seeing them for the first time.
            </p>
            <p className="text-muted-foreground mb-6">
              That usually means small-business sites, landing pages, product prototypes, payment flows, and cleanup work on existing builds. I prefer clear scope, direct communication, and shipping something that still feels easy to maintain after launch.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* <CustomLink
                href={socialLinks.resume}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                View resume <FaArrowRight className="h-4 w-4" />
              </CustomLink> */}
              <CustomLink
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Talk about a project
              </CustomLink>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-4 rounded-3xl border bg-card p-8 shadow-sm"
          >
            {[
              { icon: FaBriefcase, title: 'Client-ready output', text: 'The pages are written to win trust, not just show taste.' },
              { icon: FaCheckCircle, title: 'Portfolio-friendly proof', text: 'Projects and contact details stay visible for employers too.' },
              { icon: FaShieldAlt, title: 'Low-friction process', text: 'Short feedback loops, no heavy process theater.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </MotionDiv>
        </div>
      </div>
    </main>
  );
}