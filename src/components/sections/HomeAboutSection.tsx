'use client';

import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import CustomLink from '@/components/CustomLink';
import { MotionDiv } from '@/lib/motion';

export default function HomeAboutSection() {
  return (
    <section id="home-about" className="py-20 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/Passport_Photo_AustinMaina.jpg"
                alt="Austin Maina"
                fill
                priority
                loading="eager"
                className="object-contain bg-white dark:bg-background"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground mb-6">
              I'm a Full Stack Developer with a passion for building scalable web applications 
              that solve real-world problems. With experience in modern frontend and backend 
              technologies, I focus on creating seamless user experiences with clean, maintainable code.
            </p>            <CustomLink
              href="/about"
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Learn More About Me
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </CustomLink>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
