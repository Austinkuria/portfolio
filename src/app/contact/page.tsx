'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { m } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaLinkedin, 
  FaGithub, 
  FaExclamationTriangle, 
  FaCheck, 
  FaCode,
  FaChevronDown
} from 'react-icons/fa';
import { MotionDiv } from '@/lib/motion';
import RouteOptimizer from '@/components/RouteOptimizer';
import { socialLinks, contactConfig, personalInfo } from '@/config';
import { ContactForm, ContactInformation, FAQComponent } from '@/components/contact';

export default function Contact() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    file: null as File | null, // File object for UI display
    fileData: null as string | null, // Base64 encoded file data
    fileName: null as string | null, // Original filename
    fileType: null as string | null, // File MIME type
    phone: '', // Added phone property
    preferredContactMethod: '', // Added preferred contact method property
    budgetRange: '', // New field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [attachmentWarning, setAttachmentWarning] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  // const [fileDragging, setFileDragging] = useState(false); // Commented out - file upload disabled

  // Loading effect with progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second loading time

    // Progress simulation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15; // Random progress increment
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  // FAQ Data
  const faqData = [
    {
      question: "What types of projects do you work on?",
      answer: "I create professional websites, online stores, mobile-responsive designs, and business automation solutions. I work on everything from simple business websites to complex custom applications that help grow your business."
    },
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary based on complexity: Simple websites (1-2 weeks), Online stores and custom applications (4-8 weeks), Design projects (2-3 weeks), System integrations (2-4 weeks). I always provide detailed timelines during our initial consultation."
    },
    {
      question: "Do you offer ongoing maintenance and support?",
      answer: "Yes! I provide ongoing maintenance packages including bug fixes, security updates, performance optimization, content updates, and feature enhancements. Maintenance plans are customized based on your specific needs."
    },
    {
      question: "What is your development process?",
      answer: "My process includes: 1) Discovery & Planning, 2) Design & Wireframing, 3) Development & Testing, 4) Review & Feedback, 5) Deployment & Launch, 6) Training & Handover. I maintain regular communication throughout each phase."
    },
    {
      question: "How do you handle project pricing?",
      answer: "I offer both fixed-price and hourly arrangements depending on project scope. For fixed-price projects, I provide detailed proposals after understanding your requirements. Hourly rates apply for ongoing maintenance and consultation work."
    },
    {
      question: "Do you work with international clients?",
      answer: "Absolutely! I work with clients globally and am experienced in remote collaboration. I'm based in Nairobi (EAT timezone) but accommodate different time zones for meetings and communication."
    }
  ];

  // Real-time validation states
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    phone: '', // Added phone validation error
    preferredContactMethod: '', // Added preferredContactMethod validation error
    budgetRange: '', // New field
    file: '', // Added file validation error
  });
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    subject: false,
    category: false,
    message: false,
    phone: false, // Added phone touched state
    file: false, // Added file touched state
    preferredContactMethod: false, // Added preferredContactMethod touched state
    budgetRange: false, // New field
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

  // Simplified email validation - pattern-based only
  const validateEmailPattern = useCallback((email: string): { valid: boolean; reason?: string } => {
    const emailLower = email.toLowerCase();
    const emailParts = emailLower.split('@');
    const localPart = emailParts[0] || '';
    
    // Block obvious fake patterns
    if (
      emailLower.includes('test@test.') ||
      emailLower.includes('fake@fake.') ||
      emailLower.includes('dummy@dummy.') ||
      emailLower.includes('sample@sample.') ||
      emailLower === 'test@test.com' ||
      emailLower === 'fake@fake.com' ||
      emailLower === 'admin@admin.com' ||
      /^(test|fake|dummy|sample)\d*@(test|fake|dummy|sample)\d*\.(com|org|net)$/.test(emailLower) ||
      
      // Block common test patterns that are clearly not real
      /^(user|student|admin|testuser)\d+@/.test(emailLower) || // user123@, student5@, admin1@, testuser2@
      /^(test|fake|dummy|sample)\d*@/.test(emailLower) // test@, test123@, fake2@, etc.
    ) {
      console.log('Email rejected due to obvious fake pattern:', email, 'localPart:', localPart);
      return { valid: false, reason: 'Please use your real email address' };
    }

    // All other emails are considered valid (pattern-based validation only)
    return { valid: true };
  }, []);

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    // Check for suspicious domains using configuration
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (
      emailDomain &&
      contactConfig.suspiciousEmailDomains.some((d: string) => d === emailDomain)
    ) {
      console.log('Email rejected due to suspicious domain:', emailDomain);
      return 'Please use a valid email address';
    }
    
    // Use pattern-based validation
    const patternResult = validateEmailPattern(email);
    if (!patternResult.valid) {
      return patternResult.reason || 'Please use your real email address';
    }
    
    console.log('Email validation passed for:', email);
    return '';
  };

  // Debounced email verification
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
    // Category is now optional, only validate if provided
    if (category.trim() && !Array.prototype.includes.call(contactConfig.validCategories, category)) {
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

  const validatePhone = (phone: string): string => {
    // Phone is required only if preferred contact method is 'phone' or 'whatsapp'
    if (formData.preferredContactMethod === 'phone' || formData.preferredContactMethod === 'whatsapp') {
      if (!phone.trim()) return 'Phone number is required for the selected contact method';
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
      if (!phoneRegex.test(phone)) return 'Please enter a valid international phone number (e.g. +254712345678)';
    }
    return '';
  };

  const validatePreferredContactMethod = (method: string): string => {
    if (!method.trim()) return 'Preferred contact method is required';
    if (!Array.prototype.includes.call(contactConfig.validContactMethods, method)) {
      return 'Please select a valid contact method';
    }
    return '';
  };

  const validateBudgetRange = (budget: string): string => {
    if (!budget.trim()) return 'Please select a budget range';
    if (!Array.prototype.includes.call(contactConfig.validBudgetRanges, budget)) {
      return 'Please select a valid budget range';
    }
    return '';
  };

  // Check if form is valid for submission (simplified - only essential fields, category is optional)
  const isFormValid = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           formData.subject.trim() &&
           formData.message.trim() &&
           !validationErrors.name && 
           !validationErrors.email && 
           !validationErrors.subject &&
           !validationErrors.category &&
           !validationErrors.message;
  };  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      case 'phone':
        // Re-validate phone when preferredContactMethod changes or phone field changes
        error = validatePhone(value);
        break;
      case 'preferredContactMethod':
        error = validatePreferredContactMethod(value);
        // If preferred contact method changes, re-validate phone
        setValidationErrors(prev => ({ ...prev, phone: validatePhone(formData.phone) }));
        break;
      case 'budgetRange':
        error = validateBudgetRange(value);
        break;
    }

    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
  };const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();
    
    // Mark essential fields as touched to show validation errors
    setFieldTouched({ 
      name: true, 
      email: true, 
      subject: true, 
      category: true, 
      message: true, 
      phone: false, // These fields are commented out
      preferredContactMethod: false, 
      budgetRange: false, 
      file: false 
    });
    
    // Validate essential fields only
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
      phone: '', // Not validating since commented out
      preferredContactMethod: '', // Not validating since commented out
      budgetRange: '', // Not validating since commented out
      file: '', // Not validating since commented out
    });
    
    // If there are validation errors, don't submit (category is optional)
    if (nameError || emailError || subjectError || messageError) {
      // Scroll to first error field
      const firstErrorField = 
        nameError ? 'name' : 
        emailError ? 'email' : 
        subjectError ? 'subject' : 
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
      });      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.code === 'RATE_LIMIT_EXCEEDED') {
          throw new Error('Too many requests. Please wait 15 minutes before sending another message.');
        } else if (result.code === 'SPAM_DETECTED') {
          // Handle spam detection with new reference ID system
          const errorMsg = result.error || 'Your message was flagged by our security filters.';
          
          // Store WhatsApp URL if available
          if (result.alternativeContact?.whatsappUrl) {
            setWhatsappUrl(result.alternativeContact.whatsappUrl);
          }
          
          throw new Error(errorMsg);
        } else if (result.code === 'INVALID_EMAIL') {
          throw new Error('Please enter a valid email address.');
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      }
      
      // Check for attachment issues
      if (result.success && result.data?.attachmentIssue && formData.file) {
        setAttachmentWarning("Your message was sent successfully, but we couldn't process your file attachment. Please consider sending your file through an alternative method.");
      }      // Reset form on success
      setFormData({ name: '', email: '', subject: '', category: '', message: '', file: null, fileData: null, fileName: null, fileType: null, phone: '', preferredContactMethod: '', budgetRange: '' });
      setFieldTouched({ name: false, email: false, subject: false, category: false, message: false, phone: false, preferredContactMethod: false, budgetRange: false, file: false });
      setValidationErrors({ name: '', email: '', subject: '', category: '', message: '', phone: '', preferredContactMethod: '', budgetRange: '', file: '' });
      setSubmitStatus('success');
        // Reset status after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setAttachmentWarning(null);
      }, 10000);
    } catch (error) {
      // console.error('Error sending message:', error);
      setSubmitStatus('error');
      
      // Store error message for display
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');      // Reset status after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
        setWhatsappUrl(null);
        setAttachmentWarning(null);
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag handlers commented out - file upload disabled
  /*
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileDragging(false);
    const files = e.dataTransfer.files;
    // Create a synthetic event-like object for the file handler
    const syntheticEvent = {
      target: { files }
    } as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(syntheticEvent);
  };
  */

  // File change handler commented out - file upload disabled
  /*
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
      ];
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors((prev) => ({ ...prev, file: 'Unsupported file type.' }));
        setFormData((prev) => ({ ...prev, file: null, fileData: null, fileName: null, fileType: null }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setValidationErrors((prev) => ({ ...prev, file: 'File size exceeds 10MB.' }));
        setFormData((prev) => ({ ...prev, file: null, fileData: null, fileName: null, fileType: null }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({
          ...prev,
          file,
          fileData: ev.target?.result as string,
          fileName: file.name,
          fileType: file.type,
        }));
        setValidationErrors((prev) => ({ ...prev, file: '' }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, file: null, fileData: null, fileName: null, fileType: null }));
      setValidationErrors((prev) => ({ ...prev, file: '' }));
    }
  };
  */

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
          className="text-center mb-8 relative"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <div className="text-9xl font-bold text-primary">Contact</div>
          </div>
          
          <div className="inline-block mb-2">
            <m.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-1 bg-primary mx-auto"
              style={{ width: 60 }}
            />
            <h2 className="text-3xl md:text-4xl font-bold relative">
              Get In Touch
              <m.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute -right-4 text-primary"
              >
                .
              </m.span>
            </h2>
            <m.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-1 bg-primary mx-auto"
              style={{ width: 60 }}
            />
          </div>
            <div className="flex justify-center space-x-2 mt-2">
            {[0, 1, 2].map((i) => (
              <m.div
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
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 md:p-6 border-2 border-red-500 shadow-lg relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-primary/5 rounded-full"></div>
            
            <div className="relative z-10 text-center">
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-0"
              >
                <FaPaperPlane className="text-primary text-2xl" />
              </m.div>
              
              <m.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold mb-4"
              >
                Ready to Work Together?
              </m.h3>
              
              <m.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto"
              >
                I'm currently available for freelance work and selective full-time positions. 
                If you have a project that matches my skills, let's discuss how we can bring your vision to life!
              </m.p>
              
              <m.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <m.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('message')?.focus()}
                >
                  <FaPaperPlane className="mr-2" />
                  Start a Conversation
                </m.button>
                
                <a
                  href={`https://wa.me/${personalInfo.whatsappNumber}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold inline-flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaWhatsapp className="mr-2" />
                  Quick WhatsApp
                </a>
              </m.div>
            </div>
          </div>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                        href={`mailto:${personalInfo.email}?subject=${encodeURIComponent(`Project Inquiry from ${personalInfo.name.full} Portfolio`)}&body=${encodeURIComponent(`Hi ${personalInfo.name.first},\n\nI found your portfolio and would like to discuss a project with you.\n\nBest regards,`)}`}
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
                        href={`https://wa.me/${personalInfo.whatsappNumber}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`}
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
          
          <m.div
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
                <div className="group">                  <label htmlFor="name" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
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
                      // optional
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
                
                <div className="group">                  <label htmlFor="email" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
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
                  <div className="group">                  <label htmlFor="subject" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
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

                <div className="group">
                  <label htmlFor="category" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Project Category <span className="text-muted-foreground text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      // optional
                      className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all pl-10 appearance-none cursor-pointer ${
                        validationErrors.category && fieldTouched.category
                          ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                          : validationErrors.category === '' && formData.category && fieldTouched.category
                          ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                          : 'border-border focus:ring-primary/30 focus:border-primary'
                      }`}
                    >
                      <option value="">Select a category...</option>
                      <option value="web-development">Website Development</option>
                      <option value="ui-ux-design">Website Design</option>
                      <option value="ecommerce">Online Store</option>
                      <option value="backend-development">Custom Systems</option>
                      <option value="api-development">System Integration</option>
                      <option value="consultation">Project Consultation</option>
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
                      <FaCode className="w-5 h-5" />
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
                
                {/* Benefits for Selected Category */}
                {formData.category && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-medium text-primary mb-3 flex items-center">
                      <FaCheck className="w-4 h-4 mr-2" />
                      What You'll Get with {formData.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(() => {
                        const benefitsMap = {
                          'web-development': ['Mobile-responsive design', 'Fast loading speed', 'Search engine optimized', 'Professional appearance', 'Easy to update', 'Secure & reliable'],
                          'ui-ux-design': ['User-friendly interface', 'Professional branding', 'Easy navigation', 'Mobile-responsive', 'Modern design', 'Brand consistency'],
                          'api-development': ['Automated processes', 'Real-time updates', 'Third-party integrations', 'Data synchronization', 'Secure connections', 'Payment processing'],
                          'ecommerce': ['Secure online payments', 'Inventory management', 'Customer accounts', 'Mobile shopping', 'Order tracking', 'Sales reporting'],
                          'backend-development': ['Custom functionality', 'Data management', 'User authentication', 'Automated workflows', 'Scalable solutions', 'Secure storage'],
                          'consultation': ['Expert guidance', 'Cost-effective solutions', 'Risk assessment', 'Project planning', 'Best practices', 'Growth strategies'],
                          'maintenance': ['Regular updates', 'Security monitoring', 'Performance optimization', 'Bug fixes', 'Backup services', 'Technical support'],
                          'other': ['Custom solutions', 'Problem solving', 'Business automation', 'Growth-focused features']
                        };
                        
                        const benefits = benefitsMap[formData.category as keyof typeof benefitsMap] || [];
                        return benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm bg-primary/10 px-2 py-1 rounded">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {benefit}
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="font-medium text-green-600">Strong Match</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="group">                  <label htmlFor="message" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Your Message
                    <span className="ml-1 text-muted-foreground cursor-pointer" title="Describe your project, specific features needed, and your ideal timeline.">
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </label><div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      // optional
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
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <m.button
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
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  </m.button>
                </MotionDiv>

                {/* Form validation summary - simplified for essential fields only */}
                {!isFormValid() && (fieldTouched.name || fieldTouched.email || fieldTouched.subject || fieldTouched.category || fieldTouched.message) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800 mb-1">Please complete the following:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {!formData.name.trim() && <li>• Enter your name</li>}
                          {!formData.email.trim() && <li>• Enter your email address</li>}
                          {!formData.subject.trim() && <li>• Enter a subject</li>}
                          {!formData.message.trim() && <li>• Write your message</li>}
                          {validationErrors.name && <li>• {validationErrors.name}</li>}
                          {validationErrors.email && <li>• {validationErrors.email}</li>}
                          {validationErrors.subject && <li>• {validationErrors.subject}</li>}
                          {validationErrors.category && <li>• {validationErrors.category}</li>}
                          {validationErrors.message && <li>• {validationErrors.message}</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {submitStatus !== 'idle' && (
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`mt-4 p-6 rounded-lg ${
                      submitStatus === 'success' 
                        ? 'bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400' 
                        : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
                    } flex items-center`}
                  >
                    {submitStatus === 'success' ? (
                      <div className="w-full">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative">
                            <svg className="w-16 h-16 animate-[successCheckmark_0.7s_cubic-bezier(0.65,0,0.45,1)_forwards]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                              <circle className="text-green-500" cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
                              <path className="text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                              <div className="w-16 h-16 border-2 border-green-500 rounded-full animate-[ripple_1s_cubic-bezier(0.65,0,0.45,1)_forwards]" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-semibold mb-2 animate-[fadeSlideUp_0.5s_0.5s_both]">Message Sent Successfully!</h4>
                          <p className="text-muted-foreground animate-[fadeSlideUp_0.5s_0.7s_both]">
                            Thank you for reaching out! I'll review your message and get back to you within 24-48 hours.
                          </p>
                          <p className="text-sm text-muted-foreground mt-4 animate-[fadeSlideUp_0.5s_0.9s_both]">
                            A confirmation email has been sent to your inbox.
                          </p>
                          {attachmentWarning && (
                            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg animate-[fadeSlideUp_0.5s_1.1s_both]">
                              <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-sm text-left">{attachmentWarning}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaExclamationTriangle className="mr-2 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="whitespace-pre-line">
                            {errorMessage}
                          </div>
                          {whatsappUrl && (
                            <div className="mt-3">
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                              >
                                <FaWhatsapp className="mr-2" />
                                Contact via WhatsApp
                              </a>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </MotionDiv>
                )}
              </form>
            </div>
          </m.div>
        </div>

        {/* FAQ Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about my services, process, and collaboration approach
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-card rounded-lg border border-border/30 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-card-foreground">{faq.question}</span>
                  <FaChevronDown 
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </m.div>
                )}
              </div>
            ))}
          </div>
        </MotionDiv>

      </div>
    </section>
    </>
  );
}
