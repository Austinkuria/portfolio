'use client';

import Image from 'next/image';
import { FaCode, FaLaptopCode, FaMountain, FaBookReader, FaGamepad } from 'react-icons/fa';
import { MotionDiv } from '@/lib/motion';

export default function About() {
  return (
    <section id="about" className="py-20 w-full bg-muted/30">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get to know more about my background, interests, and what drives me as a developer
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <MotionDiv
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-80 w-full md:h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/Passport_Photo_AustinMaina.jpg"
                alt="Austin Maina"
                fill
                className="object-contain object-center bg-muted"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4">Full Stack Developer with a Passion for Innovation</h3>
            <p className="text-muted-foreground mb-6">
              I'm a Full Stack Developer with a B.Sc. in Software Engineering, passionate about building 
              scalable web applications that solve real-world problems. With several years of experience 
              in both frontend and backend development, I enjoy bringing ideas to life through clean code 
              and thoughtful design.
            </p>
            <p className="text-muted-foreground mb-6">
              My journey in software development has taken me from creating simple websites to 
              architecting complex systems. I thrive in collaborative environments where I can 
              contribute my technical expertise while learning from others.
            </p>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">When I'm Not Coding</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaMountain className="text-primary text-xl" />
                  <span>Hiking & Nature</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBookReader className="text-primary text-xl" />
                  <span>Reading Tech Books</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGamepad className="text-primary text-xl" />
                  <span>Gaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLaptopCode className="text-primary text-xl" />
                  <span>Side Projects</span>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}