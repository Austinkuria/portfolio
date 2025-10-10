'use client';

import React, { useState, useCallback } from 'react';
import { m } from 'framer-motion';
import { 
  FaCheck, 
  FaExclamationTriangle, 
  FaPaperPlane, 
  FaWhatsapp, 
  FaCode 
} from 'react-icons/fa';
import { MotionDiv } from '@/lib/motion';
import { personalInfo, contactConfig, errorMessages } from '@/config';
import { FormData, ValidationErrors, FieldTouched, SubmitStatus } from './types';
import { 
  validateName, 
  validateEmail, 
  validateSubject, 
  validateCategory, 
  validateMessage, 
  validatePhone, 
  validatePreferredContactMethod, 
  validateBudgetRange,
  isFormValid 
} from './ValidationUtils';

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    file: null,
    fileData: null,
    fileName: null,
    fileType: null,
    phone: '',
    preferredContactMethod: '',
    budgetRange: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [attachmentWarning, setAttachmentWarning] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    phone: '',
    preferredContactMethod: '',
    budgetRange: '',
    file: '',
  });

  const [fieldTouched, setFieldTouched] = useState<FieldTouched>({
    name: false,
    email: false,
    subject: false,
    category: false,
    message: false,
    phone: false,
    file: false,
    preferredContactMethod: false,
    budgetRange: false,
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        error = validatePhone(value);
        break;
      case 'preferredContactMethod':
        error = validatePreferredContactMethod(value);
        setValidationErrors(prev => ({ ...prev, phone: validatePhone(formData.phone) }));
        break;
      case 'budgetRange':
        error = validateBudgetRange(value);
        break;
    }

    setValidationErrors(prev => ({ ...prev, [name]: error }));
  }, [formData.phone]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setFieldTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark essential fields as touched to show validation errors
    setFieldTouched({ 
      name: true, 
      email: true, 
      subject: true, 
      category: true, 
      message: true, 
      phone: false,
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
      phone: '',
      preferredContactMethod: '',
      budgetRange: '',
      file: '',
    });
    
    // If there are validation errors, don't submit
    if (nameError || emailError || subjectError || messageError) {
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
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === 'RATE_LIMIT_EXCEEDED') {
          throw new Error('Too many requests. Please wait 15 minutes before sending another message.');
        } else if (result.code === 'SPAM_DETECTED') {
          const errorMsg = result.error || 'Your message was flagged by our security filters.';
          
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
      
      if (result.success && result.data?.attachmentIssue && formData.file) {
        setAttachmentWarning("Your message was sent successfully, but we couldn't process your file attachment. Please consider sending your file through an alternative method.");
      }

      // Reset form on success
      setFormData({ 
        name: '', 
        email: '', 
        subject: '', 
        category: '', 
        message: '', 
        file: null, 
        fileData: null, 
        fileName: null, 
        fileType: null, 
        phone: '', 
        preferredContactMethod: '', 
        budgetRange: '' 
      });
      setFieldTouched({ 
        name: false, 
        email: false, 
        subject: false, 
        category: false, 
        message: false, 
        phone: false, 
        preferredContactMethod: false, 
        budgetRange: false, 
        file: false 
      });
      setValidationErrors({ 
        name: '', 
        email: '', 
        subject: '', 
        category: '', 
        message: '', 
        phone: '', 
        preferredContactMethod: '', 
        budgetRange: '', 
        file: '' 
      });
      setSubmitStatus('success');

      setTimeout(() => {
        setSubmitStatus('idle');
        setAttachmentWarning(null);
      }, 10000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');

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

  const isFormValidForSubmission = () => {
    return isFormValid(formData, validationErrors);
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={className}
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
              Project Category <span className="text-muted-foreground text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
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
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
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

          {/* Message Field */}
          <div className="group">
            <label htmlFor="message" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
              Your Message
              <span className="ml-1 text-muted-foreground cursor-pointer" title="Describe your project, specific features needed, and your ideal timeline.">
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isFormValidForSubmission()}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
              isSubmitting || !isFormValidForSubmission()
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                Sending Message...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                Send Message
              </>
            )}
          </button>

          {/* Form validation summary */}
          {!isFormValidForSubmission() && (fieldTouched.name || fieldTouched.email || fieldTouched.subject || fieldTouched.category || fieldTouched.message) && (
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
          
          {/* Status Messages */}
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
                      {errorMessage || errorMessages.generic}
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
  );
}
