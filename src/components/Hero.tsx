'use client';

import { FaWhatsapp, FaComments, FaCalendarAlt, FaArrowRight, FaCode, FaRocket, FaShieldAlt, FaCogs } from 'react-icons/fa';
import CustomLink from '@/components/CustomLink';
import { MotionDiv } from '@/lib/motion';
import AnimatedGlobe from '@/components/AnimatedGlobe';
import { socialLinks } from '@/config';


export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-background pt-28 md:pt-36 lg:pt-32 pb-16 transition-colors duration-300">
      
      {/* 3D Global Node Background - Prominently showcased on right half, positioned below header */}
      <div className="absolute top-20 md:top-24 lg:top-28 inset-x-0 bottom-0 z-0 overflow-hidden pointer-events-none">
        <div className="w-full h-full lg:w-[60%] lg:ml-auto pointer-events-auto flex items-center justify-center translate-y-2 lg:translate-y-6">
          <AnimatedGlobe />
        </div>
        {/* Soft directional gradient restricted to left text column so the globe is 100% clear and vibrant */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none" />
        <div className="lg:hidden absolute inset-0 bg-background/60 pointer-events-none" />
      </div>

      <div className="w-full max-w-[1536px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10 select-text">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Original Agency Typography & CTAs */}
          <div className="lg:col-span-8 xl:col-span-7 flex flex-col items-start text-left z-10 select-text">

            {/* Original Agency Headline */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-foreground leading-[1.12] text-balance">
                Turning ambitious ideas into <span className="text-primary">high-performance</span> software.
              </h1>
            </MotionDiv>

            {/* Original Agency Subtitle */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground font-normal"
            >
              From custom web platforms and mobile apps to seamless payment workflows and intelligent automation, we build reliable technology engineered around how your business operates.
            </MotionDiv>


            {/* Agency CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
            >
              <CustomLink
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 active:scale-95 px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Explore Work</span>
                <FaArrowRight className="text-sm" />
              </CustomLink>

              <CustomLink
                href={socialLinks.calendly || '/contact'}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/30 hover:border-primary bg-card/60 backdrop-blur-sm px-7 py-3 text-base font-semibold text-foreground transition-all duration-200 hover:bg-primary/5 hover:-translate-y-0.5"
              >
                <FaCalendarAlt className="text-sm text-primary" />
                <span>Start a Project</span>
              </CustomLink>
            </MotionDiv>

          </div>

          {/* Right Column: Kept completely open/blank so the 3D Animated Globe is the hero showcase */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-5 h-[480px] pointer-events-none items-center justify-center">
            {/* Kept clear so the interactive 3D Animated Globe shines in full view */}
          </div>

        </div>
      </div>

      {/* Bottom Left Corner: Brand Arc with Floating WhatsApp Button */}
      <div className="absolute bottom-0 left-0 z-20 pointer-events-auto">
        <div className="relative">
          <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-tr from-primary to-accent rounded-tr-full shadow-lg opacity-75" />
          
          <a
            href="https://wa.me/?text=Hi%20AM%20LABS,%20we%20have%20a%20project%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with AM LABS on WhatsApp"
            className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>
        </div>
      </div>

      {/* Floating Bottom Right "We Are Here 👋" Live Chat Badge */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
        <div className="relative group cursor-pointer">
          <div className="mb-1 text-xs font-bold text-primary flex items-center gap-1 bg-card/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-border">
            <span>AM LABS</span>
            <span className="text-sm">👋</span>
          </div>
          <a
            href="/contact"
            aria-label="Contact AM LABS"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-background ml-auto"
          >
            <FaComments className="w-6 h-6" />
          </a>
        </div>
      </div>

    </section>
  );
}



