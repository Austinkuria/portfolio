'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { m } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaExclamationTriangle, 
  FaCheck, 
  FaCode,
  FaChevronDown,
  FaBriefcase,
  FaPalette,
  FaLightbulb,
  FaQuestion
} from 'react-icons/fa';
import { useReCaptcha } from 'next-recaptcha-v3';
import { MotionDiv } from '@/lib/motion';
import RouteOptimizer from '@/components/RouteOptimizer';
import { contactConfig, personalInfo, contactBenefits } from '@/config';
import { categoryDisplayNames } from '@/components/contact/ValidationUtils';
import ContactInformation from '@/components/contact/ContactInformation';

export default function Contact() {
  const { executeRecaptcha } = useReCaptcha();
  
  // Debounce timer refs for performance optimization
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedQuickIntent, setSelectedQuickIntent] = useState<string>('');

  // Cleanup debounce timers on unmount
  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, []);

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
  // Validation rule type
  type ValidationRule = {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string;
    messages: {
      required?: string;
      minLength?: string;
      maxLength?: string;
      pattern?: string;
    };
  };

  // Validation rules configuration
  const validationRules: Record<string, ValidationRule> = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s-]+$/,
      messages: {
        required: 'Name is required',
        minLength: 'Name must be at least 2 characters',
        maxLength: 'Name must be less than 50 characters',
        pattern: 'Name should only contain letters, spaces, and hyphens'
      }
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        const emailLower = value.toLowerCase();
        const emailDomain = value.split('@')[1]?.toLowerCase();
        
        // Block obvious fake patterns
        const fakePatterns = [
          'test@test.',
          'fake@fake.',
          'dummy@dummy.',
          'sample@sample.',
        ];
        
        const exactFakes = [
          'test@test.com',
          'fake@fake.com',
          'admin@admin.com'
        ];
        
        if (fakePatterns.some(pattern => emailLower.includes(pattern)) ||
            exactFakes.includes(emailLower) ||
            /^(test|fake|dummy|sample)\d*@(test|fake|dummy|sample)\d*\.(com|org|net)$/.test(emailLower) ||
            /^(user|student|admin|testuser)\d+@/.test(emailLower) ||
            /^(test|fake|dummy|sample)\d*@/.test(emailLower)) {
          return 'Please use your real email address';
        }
        
        // Check suspicious domains
        if (emailDomain && contactConfig.suspiciousEmailDomains.some((d: string) => d === emailDomain)) {
          return 'Please use a valid email address';
        }
        
        return '';
      },
      messages: {
        required: 'Email is required',
        pattern: 'Please enter a valid email address'
      }
    },
    subject: {
      required: true,
      minLength: 3,
      maxLength: 100,
      custom: (value: string) => {
        const lowerSubject = value.toLowerCase();
        for (const word of contactConfig.spamKeywords) {
          if (lowerSubject.includes(word)) {
            return 'Subject contains inappropriate content';
          }
        }
        return '';
      },
      messages: {
        required: 'Subject is required',
        minLength: 'Subject must be at least 3 characters',
        maxLength: 'Subject must be less than 100 characters'
      }
    },
    category: {
      required: false,
      custom: (value: string) => {
        if (value.trim() && !Array.prototype.includes.call(contactConfig.validCategories, value)) {
          return 'Please select a valid category';
        }
        return '';
      },
      messages: {}
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 2000,
      custom: (value: string) => {
        const lowerMessage = value.toLowerCase();
        
        // Spam keyword check
        for (const spam of contactConfig.spamKeywords) {
          if (lowerMessage.includes(spam)) {
            return 'Message contains suspicious content';
          }
        }
        
        // URL check
        const urlMatches = value.match(/https?:\/\/[^\s]+/g) || [];
        if (urlMatches.length > 2) {
          return 'Too many links in message';
        }
        
        // Capitalization check
        const capsRatio = (value.match(/[A-Z]/g) || []).length / value.length;
        if (value.length > 20 && capsRatio > 0.7) {
          return 'Please avoid excessive capitalization';
        }
        
        return '';
      },
      messages: {
        required: 'Message is required',
        minLength: 'Message must be at least 10 characters',
        maxLength: 'Message must be less than 2000 characters'
      }
    }
  };

  // Unified validation function (memoized for stable reference)
  const validateField = useCallback((fieldName: string, value: string): string => {
    const rules = validationRules[fieldName];
    if (!rules) return '';

    // Required check
    if (rules.required && !value.trim()) {
      return rules.messages.required || `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !rules.required) {
      return '';
    }

    // Min length check
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return rules.messages.minLength || `Must be at least ${rules.minLength} characters`;
    }

    // Max length check
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return rules.messages.maxLength || `Must be less than ${rules.maxLength} characters`;
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.messages.pattern || 'Invalid format';
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // validationRules is stable (defined above)

  // Individual validation functions (now using unified validator)
  const validateName = (name: string): string => validateField('name', name);
  const validateEmail = (email: string): string => validateField('email', email);
  const validateSubject = (subject: string): string => validateField('subject', subject);
  const validateMessage = (message: string): string => validateField('message', message);

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
  };

  // Debounced validation function for performance
  const debouncedValidate = useCallback((fieldName: string, value: string, delay: number = 300) => {
    // Clear existing timer for this field
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    // Set new timer
    debounceTimers.current[fieldName] = setTimeout(() => {
      // Directly use validateField instead of wrapper functions
      const error = validateField(fieldName, value);
      setValidationErrors(prev => ({ ...prev, [fieldName]: error }));
    }, delay);
  }, [validateField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Category is optional - never validate it
    if (name === 'category') {
      setValidationErrors(prev => ({ ...prev, category: '' }));
      return;
    }

    // Use different debounce delays based on field complexity
    // Message field has complex validation (spam, URLs, caps) - longer delay
    // Other fields have simpler validation - shorter delay
    const debounceDelay = name === 'message' ? 500 : name === 'email' ? 400 : 300;
    
    debouncedValidate(name, value, debounceDelay);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    
    e.preventDefault();
    
    // Mark essential fields as touched to show validation errors
    setFieldTouched({ 
      name: true, 
      email: true, 
      subject: true, 
      category: false, // Category is optional - never touched
      message: true,
    });
    
    // Validate essential fields only (category is optional - never validated)
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const subjectError = validateSubject(formData.subject);
    const messageError = validateMessage(formData.message);
    
    setValidationErrors({
      name: nameError,
      email: emailError,
      subject: subjectError,
      category: '', // Category is optional - never validated
      message: messageError,
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
      // Execute reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha('contact_form');
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken, // Include reCAPTCHA token
        }),
      });      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.code === 'RATE_LIMIT_EXCEEDED') {
          throw new Error('Too many requests. Please wait 15 minutes before sending another message.');
        } else if (result.code === 'SPAM_DETECTED') {
          // Handle spam detection
          const errorMsg = result.error || 'Your message was flagged by our security filters.';
          throw new Error(errorMsg);
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
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');      // Reset status after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
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
      <main id="contact" className="py-20 w-full">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 relative"
        >
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ContactInformation />
          
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
              
              {/* Quick Intent Buttons */}
              <div className="mb-6 space-y-2 relative z-10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">What brings you here?</p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: 'build-website', subject: 'New Website Project' }));
                      setFieldTouched(prev => ({ ...prev, category: true, subject: true }));
                      setSelectedQuickIntent('build-website');
                    }}
                    className={`text-xs px-2 py-1.5 rounded-lg border transition-all text-center font-medium flex flex-col items-center justify-center gap-0.5 ${
                      selectedQuickIntent === 'build-website'
                        ? 'bg-primary/20 border-primary text-primary font-semibold'
                        : 'border-primary/30 hover:bg-primary/10 hover:border-primary'
                    }`}
                    title="Need a new website or complete redesign"
                  >
                    <FaBriefcase className="w-3 h-3" />
                    <span>New Site</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: 'design-redesign', subject: 'Design & UX Improvement' }));
                      setFieldTouched(prev => ({ ...prev, category: true, subject: true }));
                      setSelectedQuickIntent('design-redesign');
                    }}
                    className={`text-xs px-2 py-1.5 rounded-lg border transition-all text-center font-medium flex flex-col items-center justify-center gap-0.5 ${
                      selectedQuickIntent === 'design-redesign'
                        ? 'bg-primary/20 border-primary text-primary font-semibold'
                        : 'border-primary/30 hover:bg-primary/10 hover:border-primary'
                    }`}
                    title="Improve design, UX, or user experience"
                  >
                    <FaPalette className="w-3 h-3" />
                    <span>Improve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: 'developer-collaboration', subject: 'Developer Collaboration' }));
                      setFieldTouched(prev => ({ ...prev, category: true, subject: true }));
                      setSelectedQuickIntent('developer-collaboration');
                    }}
                    className={`text-xs px-2 py-1.5 rounded-lg border transition-all text-center font-medium flex flex-col items-center justify-center gap-0.5 ${
                      selectedQuickIntent === 'developer-collaboration'
                        ? 'bg-primary/20 border-primary text-primary font-semibold'
                        : 'border-primary/30 hover:bg-primary/10 hover:border-primary'
                    }`}
                    title="Developer partnerships, open-source, or joint projects"
                  >
                    <FaLightbulb className="w-3 h-3" />
                    <span>Collaborate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: 'other', subject: 'Project Inquiry' }));
                      setFieldTouched(prev => ({ ...prev, category: true, subject: true }));
                      setSelectedQuickIntent('other');
                    }}
                    className={`text-xs px-2 py-1.5 rounded-lg border transition-all text-center font-medium flex flex-col items-center justify-center gap-0.5 ${
                      selectedQuickIntent === 'other'
                        ? 'bg-primary/20 border-primary text-primary font-semibold'
                        : 'border-primary/30 hover:bg-primary/10 hover:border-primary'
                    }`}
                    title="Something different - tell me about it"
                  >
                    <FaQuestion className="w-3 h-3" />
                    <span>Other</span>
                  </button>
                </div>
              </div>
              
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
                      <option value="build-website">Build New Website (Startup or Redesign)</option>
                      <option value="design-redesign">Design & UX Improvement</option>
                      <option value="ecommerce">E-commerce / Online Store</option>
                      <option value="maintenance-support">Maintenance & Support</option>
                      <option value="developer-collaboration">Developer Collaboration</option>
                      <option value="other">Something Else (Tell me more)</option>
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
                      What You'll Get with {categoryDisplayNames[formData.category as keyof typeof categoryDisplayNames]}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(() => {
                        const benefits = contactBenefits[formData.category as keyof typeof contactBenefits] || [];
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
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaExclamationTriangle className="mr-2 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="whitespace-pre-line">
                            {errorMessage}
                          </div>
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
            {contactConfig.faq.map((faq, index) => (
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
    </main>
    </>
  );
}
