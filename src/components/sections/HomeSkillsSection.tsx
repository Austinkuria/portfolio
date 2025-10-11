'use client';

import { FaReact, FaNodeJs, FaDatabase, FaArrowRight } from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss } from 'react-icons/si';
import CustomLink from '@/components/CustomLink';
import { MotionDiv } from '@/lib/motion';

const skills = [
  { name: 'React', icon: <FaReact className="text-[#61DBFB]" size={40} /> },
  { name: 'TypeScript', icon: <SiTypescript className="text-[#3178C6]" size={40} /> },
  { name: 'Next.js', icon: <SiNextdotjs size={40} /> },
  { name: 'Node.js', icon: <FaNodeJs className="text-[#68a063]" size={40} /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-[#38B2AC]" size={40} /> },
  { name: 'Databases', icon: <FaDatabase className="text-[#336791]" size={40} /> },
];

export default function HomeSkillsSection() {
  return (

<section id="home-skills" className="pt-2 pb-20 w-full bg-muted/20">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A snapshot of the technologies and tools I work with on a daily basis
          </p>
        </MotionDiv>        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {skills.map((skill, index) => (
            <MotionDiv
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card p-6 rounded-lg flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-center mb-2">
                {skill.icon}
              </div>
              <h3 className="font-medium text-center">{skill.name}</h3>
            </MotionDiv>
          ))}
        </div>        <div className="text-center">
          <CustomLink
            href="/skills"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Explore All Skills
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </CustomLink>
        </div>
      </div>
    </section>
  );
}
