'use client';

import React from 'react';
import { m } from 'framer-motion';
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaLinkedin, 
  FaWhatsapp, 
  FaGithub, 
  FaPhone 
} from 'react-icons/fa';
import { personalInfo, socialLinks, contactConfig } from '@/config';

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

        {/* Availability Status */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
            Current Availability
          </h4>
          <p className="text-sm text-muted-foreground">
            <strong>{contactConfig.availability.statusMessage}</strong> • {contactConfig.availability.currentWork}
          </p>
        </div>

        {/* Response Time Information */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Response Time
          </h4>
          <p className="text-sm text-muted-foreground">
            I typically respond to messages within <strong>{contactConfig.responseTime}</strong>. 
            For urgent inquiries, WhatsApp is the fastest way to reach me.
          </p>
        </div>
        
        {/* Contact Information Grid */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 text-foreground">Get in Touch</h4>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4 auto-rows-fr w-full">
            <div className="flex items-start group transition-all w-full p-1 sm:p-2 rounded-lg hover:bg-primary/5">
              <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-2 sm:mr-3 flex-shrink-0">
                <FaMapMarkerAlt className="text-base sm:text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-sm sm:text-base">Location</h5>
                <p className="text-xs sm:text-sm text-muted-foreground">{personalInfo.location}</p>
              </div>
            </div>
            
            <div className="flex items-start group transition-all w-full p-1 sm:p-2 rounded-lg hover:bg-primary/5">
              <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-2 sm:mr-3 flex-shrink-0">
                <FaEnvelope className="text-base sm:text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-sm sm:text-base">Email</h5>
                <a 
                  href={socialLinks.email}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                >
                  Send Email
                </a>
              </div>
            </div>
            
            <div className="flex items-start group transition-all w-full p-1 sm:p-2 rounded-lg hover:bg-primary/5">
              <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-2 sm:mr-3 flex-shrink-0">
                <FaWhatsapp className="text-base sm:text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-sm sm:text-base">WhatsApp</h5>
                <a 
                  href={socialLinks.whatsapp}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>
            
            <div className="flex items-start group transition-all w-full p-1 sm:p-2 rounded-lg hover:bg-primary/5">
              <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-2 sm:mr-3 flex-shrink-0">
                <FaPhone className="text-base sm:text-lg scale-x-[-1]" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-sm sm:text-base">Phone</h5>
                <a 
                  href={socialLinks.phone}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                >
                  Call Now
                </a>
              </div>
            </div>
            
            <div className="flex items-start group transition-all w-full p-1 sm:p-2 rounded-lg hover:bg-primary/5">
              <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-2 sm:mr-3 flex-shrink-0">
                <FaLinkedin className="text-base sm:text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-sm sm:text-base">LinkedIn</h5>
                <a 
                  href={socialLinks.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
            
            <div className="flex items-start group transition-all w-full p-1 sm:p-2 rounded-lg hover:bg-primary/5">
              <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-2 sm:mr-3 flex-shrink-0">
                <FaGithub className="text-base sm:text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-sm sm:text-base">GitHub</h5>
                <a 
                  href={socialLinks.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                >
                  View Projects & Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}
