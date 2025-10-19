'use client';

import React from 'react';
import { m } from 'framer-motion';
import { 
  FaEnvelope, 
  FaLinkedin 
} from 'react-icons/fa';
import { socialLinks } from '@/config';

export default function ContactInformation() {
  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-full flex flex-col bg-card/50 rounded-xl p-8 shadow-sm border border-border/40">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <span className="inline-block w-8 h-1 bg-primary mr-3"></span>
          Contact Information
        </h3>
        
        <p className="text-muted-foreground mb-8">
          I'm available for new projects and collaborations. All inquiries are typically answered within 24-48 hours.
        </p>
        
        {/* Contact Methods */}
        <div className="space-y-4">
            <a 
              href="mailto:kuriaaustin02@gmail.com?subject=Project Inquiry from Portfolio&body=Hi Austin,%0D%0A%0D%0AI came across your portfolio and would like to discuss a project with you.%0D%0A%0D%0A"
              className="flex items-start group transition-all w-full p-3 rounded-lg hover:bg-primary/5 border border-border/40"
            >
              <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-4 flex-shrink-0">
                <FaEnvelope className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-semibold text-base mb-1">Email</h5>
                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  Send me a message
                </p>
              </div>
            </a>
            
            <a 
              href={socialLinks.linkedin}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start group transition-all w-full p-3 rounded-lg hover:bg-primary/5 border border-border/40"
            >
              <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-4 flex-shrink-0">
                <FaLinkedin className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-semibold text-base mb-1">LinkedIn</h5>
                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  View professional profile
                </p>
              </div>
            </a>
        </div>
      </div>
    </m.div>
  );
}
