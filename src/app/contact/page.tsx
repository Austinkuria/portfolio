'use client';

import { useState } from 'react';
import { FaPaperPlane, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { MotionDiv, MotionButton, MotionH3, MotionP, MotionSpan } from '@/lib/motion';
import { contactConfig, personalInfo, socialLinks } from '@/config';
import RouteOptimizer from '@/components/RouteOptimizer';

export default function Contact() {  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Real-time validation states
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    subject: false,
    category: false,
    message: false,
  });

  // Real-time validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';

    // Adjust regex to allow valid names with spaces and hyphens
    if (/[^a-zA-Z\s-]/.test(name)) {
      return 'Name should only contain letters, spaces, and hyphens';
    }

    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    // Check for suspicious domains using configuration
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain && (contactConfig.suspiciousEmailDomains as readonly string[]).includes(emailDomain)) {
      return 'Please use a valid email address';
    }
    
    return '';
  };
  
  const validateSubject = (subject: string): string => {
    if (!subject.trim()) return 'Subject is required';
    if (subject.length < 3) return 'Subject must be at least 3 characters';
    if (subject.length > 100) return 'Subject must be less than 100 characters';
    
    // Basic spam check for subject using configuration
    const lowerSubject = subject.toLowerCase();
    const spamWords = contactConfig.spamKeywords;
    for (const word of spamWords) {
      if (lowerSubject.includes(word)) {
        return 'Subject contains inappropriate content';
      }
    }
    
    return '';
  };

  const validateCategory = (category: string): string => {
    if (!category.trim()) return 'Please select a project category';
    if (!contactConfig.validCategories.includes(category as 'web-development' | 'ui-ux-design' | 'ecommerce' | 'backend-development' | 'api-development' | 'consultation' | 'maintenance' | 'other')) {
      return 'Please select a valid category';
    }
    return '';
  };

  const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Message is required';
    if (message.length < 10) return 'Message must be at least 10 characters';
    if (message.length > 2000) return 'Message must be less than 2000 characters';
    
    // Basic spam detection for real-time feedback using configuration
    const lowerMessage = message.toLowerCase();
    const quickSpamCheck = contactConfig.spamKeywords;
    
    for (const spam of quickSpamCheck) {
      if (lowerMessage.includes(spam)) {
        return 'Message contains suspicious content';
      }
    }
    
    // Check for excessive URLs
    const urlMatches = message.match(/https?:\/\/[^\s]+/g) || [];
    if (urlMatches.length > 2) {
      return 'Too many links in message';
    }
    
    // Check for excessive capitalization
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (message.length > 20 && capsRatio > 0.7) {
      return 'Please avoid excessive capitalization';
    }
    
    return '';
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           formData.subject.trim() &&
           formData.category.trim() &&
           formData.message.trim() &&
           !validationErrors.name && 
           !validationErrors.email && 
           !validationErrors.subject &&
           !validationErrors.category &&
           !validationErrors.message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Perform real-time validation
    let error = '';
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'subject':
        error = validateSubject(value);
        break;
      case 'category':
        error = validateCategory(value);
        break;
      case 'message':
        error = validateMessage(value);
        break;
    }

    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setFieldTouched({ name: true, email: true, subject: true, category: true, message: true });
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const subjectError = validateSubject(formData.subject);
    const categoryError = validateCategory(formData.category);
    const messageError = validateMessage(formData.message);
    
    setValidationErrors({
      name: nameError,
      email: emailError,
      subject: subjectError,
      category: categoryError,
      message: messageError,
    });
    
    // If there are validation errors, don't submit
    if (
      nameError || 
      emailError || 
      subjectError || 
      categoryError || 
      messageError
    ) {
      // Scroll to first error field
      const firstErrorField = 
        nameError ? 'name' : 
        emailError ? 'email' : 
        subjectError ? 'subject' : 
        categoryError ? 'category' : 
        'message';
      document.getElementById(firstErrorField)?.focus();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.code === 'RATE_LIMIT_EXCEEDED') {
          throw new Error('Too many requests. Please wait 15 minutes before sending another message.');
        } else if (result.code === 'SPAM_DETECTED') {
          throw new Error(result.error || 'Your message was flagged by our security filters.');
        } else if (result.code === 'INVALID_EMAIL') {
          throw new Error('Please enter a valid email address.');
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      }
      
      // Reset form on success
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      setFieldTouched({ name: false, email: false, subject: false, category: false, message: false });
      setValidationErrors({ name: '', email: '', subject: '', category: '', message: '' });
      setSubmitStatus('success');
      
      // Reset status after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 10000);
    } catch (error) {
      // console.error('Error sending message:', error);
      setSubmitStatus('error');
      
      // Store error message for display
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      // Reset status after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <RouteOptimizer pageName="contact" />
      <section id="contact" className="py-20 w-full">
        <div className="container mx-auto px-4">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 relative"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="text-9xl font-bold text-primary">Contact</div>
            </div>
            
            <div className="inline-block mb-4">
              <MotionDiv
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 bg-primary mb-2 mx-auto"
                style={{ width: 60 }}
              />
              <h2 className="text-3xl md:text-4xl font-bold relative">
                Get In Touch
                <MotionSpan
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="absolute -right-4 text-primary"
                >
                  .
                </MotionSpan>
              </h2>
              <MotionDiv
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 bg-primary mt-2 mx-auto"
                style={{ width: 60 }}
              />
            </div>
            
            <MotionP
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
            >
              Have a project in mind or want to collaborate? I'd love to hear from you.
            </MotionP>
            
            <div className="flex justify-center space-x-2 mt-6">
              {[0, 1, 2].map((i) => (
                <MotionDiv
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.7 + (i * 0.1) }}
                  className="w-2 h-2 rounded-full bg-primary/60"
                />
              ))}
            </div>
          </MotionDiv>

          {/* Call to Action Section */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 border border-primary/20 shadow-lg relative overflow-hidden max-w-4xl mx-auto">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/10 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-primary/5 rounded-full"></div>
              
              <div className="relative z-10 text-center">
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6"
                >
                  <FaPaperPlane className="text-primary text-2xl" />
                </MotionDiv>
                
                <MotionH3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl md:text-3xl font-bold mb-4"
                >
                  Ready to Work Together?
                </MotionH3>
                
                <MotionP
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto"
                >
                  I'm currently available for freelance work and selective full-time positions. 
                  If you have a project that matches my skills, let's discuss how we can bring your vision to life!
                </MotionP>
                
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <MotionButton 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => document.getElementById('message')?.focus()}
                  >
                    <FaPaperPlane className="mr-2" />
                    Start a Conversation
                  </MotionButton>
                  
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaWhatsapp className="mr-2" />
                    Quick WhatsApp
                  </a>
                </MotionDiv>
              </div>
            </div>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <MotionDiv
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
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Response Time & Timezone
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Typical Response:</strong> Within <strong>{contactConfig.responseTime}</strong>
                    </p>
                    <p>
                      <strong>My Timezone:</strong> East Africa Time (EAT, UTC+3)
                    </p>
                    <p>
                      <strong>Working Hours:</strong> Monday - Friday, 9 AM - 6 PM EAT
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-2">
                      For urgent inquiries, WhatsApp is the fastest way to reach me. I accommodate different timezones for meetings and calls.
                    </p>
                  </div>
                </div>

                {/* Project Brief Helper */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-8">
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Project Brief Template
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Including these details helps me provide better assistance:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Project type and main goals</li>
                      <li>Target audience and key features needed</li>
                      <li>Preferred timeline and any deadlines</li>
                      <li>Budget range or payment structure preference</li>
                      <li>Existing brand guidelines or design preferences</li>
                      <li>Technical requirements or integrations needed</li>
                    </ul>
                  </div>
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
            </MotionDiv>
            
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card rounded-xl p-8 shadow-lg h-full border border-border/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mt-20 -mr-20 z-0"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full -mb-16 -ml-16 z-0"></div>
                
                <h3 id="contact-form" className="text-2xl font-bold mb-6 flex items-center relative z-10">
                  <span className="inline-block w-8 h-1 bg-primary mr-3"></span>
                  Send Me a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {/* Name Field */}
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                      Your Name
                      <span className="ml-1 text-muted-foreground cursor-pointer" title="Please enter your full name as you'd like to be addressed">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all peer pl-10 ${
                          validationErrors.name && fieldTouched.name
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : validationErrors.name === '' && formData.name && fieldTouched.name
                            ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                            : 'border-border focus:ring-primary/30 focus:border-primary'
                        }`}
                        placeholder={personalInfo.name.full}
                      />
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                        validationErrors.name && fieldTouched.name
                          ? 'text-red-500'
                          : validationErrors.name === '' && formData.name && fieldTouched.name
                          ? 'text-green-500'
                          : 'text-muted-foreground peer-focus:text-primary'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      {/* Validation indicator */}
                      {fieldTouched.name && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationErrors.name ? (
                            <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                          ) : formData.name ? (
                            <FaCheck className="text-green-500 w-4 h-4" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    {validationErrors.name && fieldTouched.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaExclamationTriangle className="w-3 h-3 mr-1" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                      Your Email
                      <span className="ml-1 text-muted-foreground cursor-pointer" title="Enter a valid email address for communication. This will be used for project updates and correspondence.">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all peer pl-10 ${
                          validationErrors.email && fieldTouched.email
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : validationErrors.email === '' && formData.email && fieldTouched.email
                            ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                            : 'border-border focus:ring-primary/30 focus:border-primary'
                        }`}
                        placeholder={contactConfig.emailPlaceholder}
                      />
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                        validationErrors.email && fieldTouched.email
                          ? 'text-red-500'
                          : validationErrors.email === '' && formData.email && fieldTouched.email
                          ? 'text-green-500'
                          : 'text-muted-foreground peer-focus:text-primary'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      {/* Validation indicator */}
                      {fieldTouched.email && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationErrors.email ? (
                            <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                          ) : formData.email ? (
                            <FaCheck className="text-green-500 w-4 h-4" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    {validationErrors.email && fieldTouched.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaExclamationTriangle className="w-3 h-3 mr-1" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                  
                  {/* Subject Field */}
                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                      Subject
                      <span className="ml-1 text-muted-foreground cursor-pointer" title="Brief description of your project or inquiry. Be specific to help me understand your needs better.">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all peer pl-10 ${
                          validationErrors.subject && fieldTouched.subject
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : validationErrors.subject === '' && formData.subject && fieldTouched.subject
                            ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                            : 'border-border focus:ring-primary/30 focus:border-primary'
                        }`}
                        placeholder="Project Inquiry"
                      />
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                        validationErrors.subject && fieldTouched.subject
                          ? 'text-red-500'
                          : validationErrors.subject === '' && formData.subject && fieldTouched.subject
                          ? 'text-green-500'
                          : 'text-muted-foreground peer-focus:text-primary'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
                        </svg>
                      </span>
                      {/* Validation indicator */}
                      {fieldTouched.subject && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationErrors.subject ? (
                            <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                          ) : formData.subject ? (
                            <FaCheck className="text-green-500 w-4 h-4" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    {validationErrors.subject && fieldTouched.subject && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaExclamationTriangle className="w-3 h-3 mr-1" />
                        {validationErrors.subject}
                      </p>
                    )}
                  </div>

                  {/* Category Field */}
                  <div className="group">
                    <label htmlFor="category" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                      Project Category
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all pl-10 appearance-none cursor-pointer ${
                          validationErrors.category && fieldTouched.category
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : validationErrors.category === '' && formData.category && fieldTouched.category
                            ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                            : 'border-border focus:ring-primary/30 focus:border-primary'
                        }`}
                      >
                        <option value="">Select a category...</option>
                        <option value="web-development">Web Development</option>
                        <option value="ui-ux-design">UI/UX Design</option>
                        <option value="ecommerce">E-Commerce Development</option>
                        <option value="backend-development">Backend Development</option>
                        <option value="api-development">API Development</option>
                        <option value="consultation">Technical Consultation</option>
                        <option value="maintenance">Website Maintenance</option>
                        <option value="other">Other</option>
                      </select>
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                        validationErrors.category && fieldTouched.category
                          ? 'text-red-500'
                          : validationErrors.category === '' && formData.category && fieldTouched.category
                          ? 'text-green-500'
                          : 'text-muted-foreground'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </span>
                      {/* Dropdown arrow */}
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                      {/* Validation indicator */}
                      {fieldTouched.category && (
                        <span className="absolute right-10 top-1/2 -translate-y-1/2">
                          {validationErrors.category ? (
                            <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                          ) : formData.category ? (
                            <FaCheck className="text-green-500 w-4 h-4" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    {validationErrors.category && fieldTouched.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaExclamationTriangle className="w-3 h-3 mr-1" />
                        {validationErrors.category}
                      </p>
                    )}
                  </div>
                  
                  {/* Message Field */}
                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                      Your Message
                      <span className="ml-1 text-muted-foreground cursor-pointer" title="Describe your project, requirements, timeline, and any specific features you need. The more details you provide, the better I can understand your needs.">
                        <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        rows={5}
                        maxLength={2000}
                        className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all resize-y min-h-[120px] pl-10 ${
                          validationErrors.message && fieldTouched.message
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : validationErrors.message === '' && formData.message && fieldTouched.message
                            ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                            : 'border-border focus:ring-primary/30 focus:border-primary'
                        }`}
                        placeholder="Hello! I'd like to talk about..."
                      ></textarea>
                      {/* Character counter */}
                      <div className="absolute bottom-2 right-3 text-sm">
                        <span className={`${
                          formData.message.length > 1800 
                            ? 'text-red-500'
                            : formData.message.length > 1500
                            ? 'text-yellow-500'
                            : 'text-muted-foreground'
                        }`}>
                          {formData.message.length}/2000
                        </span>
                      </div>
                      <span className={`absolute left-3 top-6 transition-colors ${
                        validationErrors.message && fieldTouched.message
                          ? 'text-red-500'
                          : validationErrors.message === '' && formData.message && fieldTouched.message
                          ? 'text-green-500'
                          : 'text-muted-foreground peer-focus:text-primary'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </span>
                      {/* Validation indicator */}
                      {fieldTouched.message && (
                        <span className="absolute right-3 top-6">
                          {validationErrors.message ? (
                            <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                          ) : formData.message ? (
                            <FaCheck className="text-green-500 w-4 h-4" />
                          ) : null}
                        </span>
                      )}
                    </div>
                    {validationErrors.message && fieldTouched.message && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <FaExclamationTriangle className="w-3 h-3 mr-1" />
                        {validationErrors.message}
                      </p>
                    )}
                    {/* Character count */}
                    <div className="flex justify-between items-center mt-1">
                      <div></div>
                      <span className={`text-xs ${
                        formData.message.length > 1800 ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {formData.message.length} / 2000 characters
                      </span>
                    </div>
                  </div>
                
                  {/* Submit Button */}
                  <MotionButton
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    whileHover={!isSubmitting && isFormValid() ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && isFormValid() ? { scale: 0.98 } : {}}
                    className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all duration-300 shadow-md ${
                      isSubmitting || !isFormValid()
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </MotionButton>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                      <div className="flex items-center">
                        <FaCheck className="w-5 h-5 mr-2" />
                        <div>
                          <h4 className="font-medium">Message sent successfully!</h4>
                          <p className="text-sm">Thank you for reaching out. I'll get back to you soon.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      <div className="flex items-center">
                        <FaExclamationTriangle className="w-5 h-5 mr-2" />
                        <div>
                          <h4 className="font-medium">Failed to send message</h4>
                          <p className="text-sm">{errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>
    </>
  );
}
