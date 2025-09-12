'use client';

import { personalInfo, socialLinks } from '@/config';
import { FaGithub, FaLinkedin, FaArrowDown } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import CustomLink from '@/components/CustomLink';
import { useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { MotionDiv, MotionH1, MotionP } from '@/lib/motion';

// Pre-generate random values outside of render
const circles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  width: Math.random() * 300 + 50,
  height: Math.random() * 300 + 50,
  left: Math.random() * 100,
  top: Math.random() * 100,
  scale: Math.random() * 0.5 + 0.5,
  x: Math.random() * 100 - 50,
  y: Math.random() * 100 - 50,
  duration: Math.random() * 10 + 10,
}));

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNextSection = () => {
    const homeProjectsSection = document.getElementById('home-projects');
    if (homeProjectsSection) {
      homeProjectsSection.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionRef.current) {
      const nextSection = sectionRef.current.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section ref={sectionRef} className="w-full min-h-screen flex flex-col justify-center items-center relative overflow-hidden px-4 pt-28">
      <div className="absolute inset-0 -z-10">
        <MotionDiv 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        {circles.map((circle) => (
          <MotionDiv
            key={circle.id}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
            style={{
              width: circle.width,
              height: circle.height,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              opacity: 1,
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: circle.scale,
              x: circle.x,
              y: circle.y,
            }}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto max-w-6xl z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div>
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium inline-block">{personalInfo.title}</span>
            </MotionDiv>
            <MotionH1 
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {personalInfo.tagline.split(' ').slice(0, 3).join(' ')} with{' '}
              <span className="relative">
                <span className="text-primary inline-block relative z-10" style={{ minWidth: '180px' }}>
                  <TypeAnimation
                    sequence={[
                      'Code', 2000,
                      'Creativity', 2000,
                      'Passion', 2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-0"></span>
              </span>         
            </MotionH1>
            <MotionP 
              className="text-xl text-muted-foreground mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              I craft modern web applications with a focus on performance, 
              accessibility, and exceptional user experience.
            </MotionP>
            <MotionDiv 
              className="flex flex-col sm:flex-row gap-4 mb-10 md:justify-start justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <CustomLink 
                href="/projects" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-all duration-300 text-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1"
              >
                View Projects
              </CustomLink>
              <CustomLink 
                href={socialLinks.resume} 
                target="_blank"
                className="bg-background text-foreground hover:bg-secondary/20 border border-border px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                <HiDownload className="h-5 w-5" />
                Resume
              </CustomLink>
            </MotionDiv>
            <MotionDiv 
              className="flex gap-4 md:justify-start justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a 
                href={socialLinks.github}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-white hover:bg-[#24292e] transition-all p-3 rounded-full border border-border hover:border-[#24292e]"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a 
                href={socialLinks.linkedin}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-white hover:bg-[#0a66c2] transition-all p-3 rounded-full border border-border hover:border-[#0a66c2]"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </MotionDiv>
          </div>
          <MotionDiv 
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg animate-pulse-slow"></div>
              <div className="absolute inset-4 rounded-lg border border-primary/20 backdrop-blur-sm bg-background/50 overflow-auto">                
                <MotionDiv
                  className="p-4 font-mono text-xs md:text-sm text-foreground/70 h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="ml-2 text-xs text-foreground/60">DevPortfolio.tsx</span>
                  </div>                  
                  <TypeAnimation
                    sequence={[
                      `function Developer() {\n`, 120, 200,
                      `function Developer() {\n  // Skills I work with\n`, 110, 500,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n`, 100, 400,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n`, 120, 150,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n`, 110, 200,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n`, 115, 180,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n`, 120, 250,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n`, 110, 300,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n`, 90, 1200,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  // Create amazing web projects\n  const createProject = (idea) => {\n`, 80, 1200,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  const createProject = (idea) => {\n    return idea\n`, 70, 800,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  const createProject = (idea) => {\n    return idea\n      .plan()\n`, 38, 450,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  const createProject = (idea) => {\n    return idea\n      .plan()\n      .design()\n`, 38, 450,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  const createProject = (idea) => {\n    return idea\n      .plan()\n      .design()\n      .develop()\n`, 38, 450,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  const createProject = (idea) => {\n    return idea\n      .plan()\n      .design()\n      .develop()\n      .deploy();\n  };\n\n`, 40, 1800,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  // Create amazing web projects\n  const createProject = (idea) => {\n    return idea\n      .plan()\n      .design()\n      .develop()\n      .deploy();\n  };\n\n  return (\n`, 110, 700,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  // Create amazing web projects\n  const createProject = (idea) => {\n    return idea\n      .plan()\n      .design()\n      .develop()\n      .deploy();\n  };\n\n  return (\n    <Portfolio>\n`, 120, 550,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  // Create amazing web projects\n  const createProject = (idea) => {\n    return idea\n      .plan()\n      .design()\n      .develop()\n      .deploy();\n  };\n\n  return (\n    <Portfolio>\n      {skills.map(skill => <Technology name={skill} />)}\n`, 45, 600,
                      `function Developer() {\n  // Skills I work with\n  const skills = [\n    'React',\n    'Next.js',\n    'TypeScript',\n    'TailwindCSS',\n    'Node.js',\n  ];\n\n  // Create amazing web projects\n  const createProject = (idea) => {\n    return idea\n      .plan()\n      .design()\n      .develop()\n      .deploy();\n  };\n\n  return (\n    <Portfolio>\n      {skills.map(skill => <Technology name={skill} />)}\n      {createProject('Your Next Idea')}\n    </Portfolio>\n  );\n}`, 70, 6000,
                    ]}
                    wrapper="div"
                    cursor={true}
                    repeat={Infinity}
                    className="text-primary/80 whitespace-pre"
                    style={{
                      display: 'block',
                      minHeight: '320px'
                    }}
                  />
                </MotionDiv>
              </div>
              
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/10 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-secondary/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </MotionDiv>
        </div>
      </div>
      <MotionDiv 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <button 
          onClick={scrollToNextSection}
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
          aria-label="Scroll down"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <MotionDiv
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FaArrowDown className="h-4 w-4" />
          </MotionDiv>
        </button>
      </MotionDiv>
    </section>
  );
}