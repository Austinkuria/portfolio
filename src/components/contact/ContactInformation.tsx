'use client';

import React from 'react';
import { m } from 'framer-motion';
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaLinkedin 
} from 'react-icons/fa';
import { personalInfo, socialLinks } from '@/config';

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
          Feel free to reach out through the contact form or via the contact details below. 
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        
        {/* Contact Information Grid */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-foreground">Get in Touch</h4>
          <div className="space-y-4">
            <div className="flex items-start group transition-all w-full p-3 rounded-lg hover:bg-primary/5 border border-border/40">
              <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-4 flex-shrink-0">
                <FaEnvelope className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-semibold text-base mb-1">Email</h5>
                <a 
                  href={socialLinks.email}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                >
                  Send me an email
                </a>
              </div>
            </div>
            
            <div className="flex items-start group transition-all w-full p-3 rounded-lg hover:bg-primary/5 border border-border/40">
              <div className="bg-primary/10 p-3 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-4 flex-shrink-0">
                <FaLinkedin className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-semibold text-base mb-1">Professional Profile</h5>
                <a 
                  href={socialLinks.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
            
            <div className="flex items-start group transition-all w-full p-3 rounded-lg border border-border/40">
              <div className="bg-primary/10 p-3 rounded-lg text-primary mr-4 flex-shrink-0">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-semibold text-base mb-1">Location</h5>
                <p className="text-sm text-muted-foreground">{personalInfo.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Status Section */}
        <div className="mt-6 pt-4 border-t border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Open to opportunities
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Typically respond within 24hrs</span>
          </div>
        </div>
      </div>
    </m.div>
  );
}
