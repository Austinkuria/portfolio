'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaCheck, FaExclamationTriangle, FaLinkedin, FaPaperPlane, FaWhatsapp, FaGithub, FaTwitter, FaPhone, FaChevronDown, FaCode, FaMobile, FaPalette } from 'react-icons/fa';
import { MotionDiv, MotionP } from '@/lib/motion';
import Image from 'next/image';

export default function Contact() {  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    file: null as File | null, // Added file property
    phone: '', // Added phone property
    preferredContactMethod: '', // Added preferred contact method property
    budgetRange: '', // New field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // FAQ Data
  const faqData = [
    {
      question: "What types of projects do you work on?",
      answer: "I specialize in web development (React, Next.js), mobile app development (React Native), UI/UX design, API development, and technical consultation. I work on everything from simple landing pages to complex full-stack applications."
    },
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary based on complexity: Simple websites (1-2 weeks), Complex web applications (4-8 weeks), Mobile apps (6-12 weeks), API development (2-4 weeks). I always provide detailed timelines during our initial consultation."
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

  // Featured Projects Data
  const featuredProjects = [
    {
      id: 1,
      title: 'Clinique Beauty E-Commerce',
      description: 'Modern e-commerce platform with responsive design and streamlined shopping experience',
      image: '/images/clinique-beauty.png',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      category: 'Web Development',
      icon: <FaCode className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'QR Attendance System',
      description: 'Mobile-first attendance tracking system using QR codes for schools and events',
      image: '/images/attendance-system.png',
      technologies: ['React Native', 'Node.js', 'PostgreSQL'],
      category: 'Mobile App',
      icon: <FaMobile className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'UI/UX Design Portfolio',
      description: 'Creative designs for various digital products and user experiences',
      image: '/images/am-logo.jpg',
      technologies: ['Figma', 'Adobe XD', 'Sketch'],
      category: 'UI/UX Design',
      icon: <FaPalette className="w-5 h-5" />
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
  });
  const [fieldTouched, setFieldTouched] = useState({
    name: false,
    email: false,
    subject: false,
    category: false,
    message: false,
    phone: false, // Added phone touched state
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

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    // Check for suspicious domains
    const emailDomain = email.split('@')[1]?.toLowerCase();
    const suspiciousDomains = [
      '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
      'throwaway.email', 'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com'
    ];
    if (emailDomain && suspiciousDomains.includes(emailDomain)) {
      return 'Please use a valid email address';
    }
    
    return '';
  };
  const validateSubject = (subject: string): string => {
    if (!subject.trim()) return 'Subject is required';
    if (subject.length < 3) return 'Subject must be at least 3 characters';
    if (subject.length > 100) return 'Subject must be less than 100 characters';
    
    // Basic spam check for subject
    const lowerSubject = subject.toLowerCase();
    const spamWords = ['urgent!!', 'click here', 'free money', 'winner!'];
    for (const word of spamWords) {
      if (lowerSubject.includes(word)) {
        return 'Subject contains inappropriate content';
      }
    }
    
    return '';
  };

  const validateCategory = (category: string): string => {
    if (!category.trim()) return 'Please select a project category';
    const validCategories = [
      'web-development', 'mobile-app', 'consultation', 'maintenance', 
      'ui-ux-design', 'api-development', 'other'
    ];
    if (!validCategories.includes(category)) {
      return 'Please select a valid category';
    }
    return '';
  };

  const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Message is required';
    if (message.length < 10) return 'Message must be at least 10 characters';
    if (message.length > 2000) return 'Message must be less than 2000 characters';
    
    // Basic spam detection for real-time feedback
    const lowerMessage = message.toLowerCase();
    const quickSpamCheck = [
      'viagra', 'casino', 'lottery', 'bitcoin investment', 'get rich quick',
      'nigerian prince', 'click here now', 'free money'
    ];
    
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
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    if (!phoneRegex.test(phone)) return 'Please enter a valid international phone number';
    return '';
  };

  const validatePreferredContactMethod = (method: string): string => {
    if (!method.trim()) return 'Preferred contact method is required';
    const validMethods = ['email', 'phone', 'whatsapp'];
    if (!validMethods.includes(method)) return 'Please select a valid contact method';
    return '';
  };

  const validateBudgetRange = (budget: string): string => {
    if (!budget.trim()) return 'Please select a budget range';
    const validRanges = [
      'under-500', '500-1000', '1000-2500', '2500-5000', 'over-5000',
    ];
    if (!validRanges.includes(budget)) return 'Please select a valid budget range';
    return '';
  };  // Check if form is valid for submission
  const isFormValid = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           formData.subject.trim() &&
           formData.category.trim() &&
           formData.message.trim() &&
           formData.phone.trim() &&
           formData.preferredContactMethod.trim() &&
           formData.budgetRange.trim() &&
           !validationErrors.name && 
           !validationErrors.email && 
           !validationErrors.subject &&
           !validationErrors.category &&
           !validationErrors.message &&
           !validationErrors.phone &&
           !validationErrors.preferredContactMethod &&
           !validationErrors.budgetRange;
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
        error = validatePhone(value);
        break;
      case 'preferredContactMethod':
        error = validatePreferredContactMethod(value);
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
    e.preventDefault();    // Mark all fields as touched to show validation errors
    setFieldTouched({ name: true, email: true, subject: true, category: true, message: true, phone: true, preferredContactMethod: true, budgetRange: true });
    
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const subjectError = validateSubject(formData.subject);
    const categoryError = validateCategory(formData.category);
    const messageError = validateMessage(formData.message);
    const phoneError = validatePhone(formData.phone);
    const preferredContactMethodError = validatePreferredContactMethod(formData.preferredContactMethod);
    const budgetRangeError = validateBudgetRange(formData.budgetRange);
    
    setValidationErrors({
      name: nameError,
      email: emailError,
      subject: subjectError,
      category: categoryError,
      message: messageError,
      phone: phoneError,
      preferredContactMethod: preferredContactMethodError,
      budgetRange: budgetRangeError,
    });
    
    // If there are validation errors, don't submit
    if (
      nameError || 
      emailError || 
      subjectError || 
      categoryError || 
      messageError || 
      phoneError || 
      preferredContactMethodError || 
      budgetRangeError
    ) {
      // Scroll to first error field
      const firstErrorField = 
        nameError ? 'name' : 
        emailError ? 'email' : 
        subjectError ? 'subject' : 
        categoryError ? 'category' : 
        messageError ? 'message' : 
        phoneError ? 'phone' : 
        budgetRangeError ? 'budgetRange' : 
        'preferredContactMethod';
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
          throw new Error('Too many requests. Please wait 15 minutes before sending another message.');        } else if (result.code === 'SPAM_DETECTED') {
          // Handle spam detection with new reference ID system
          const errorMsg = result.error || 'Your message was flagged by our security filters.';
          
          // Store WhatsApp URL if available
          if (result.alternativeContact?.whatsappUrl) {
            setWhatsappUrl(result.alternativeContact.whatsappUrl);
          }
          
          throw new Error(errorMsg);
        }else if (result.code === 'INVALID_EMAIL') {
          throw new Error('Please enter a valid email address.');
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      }      // Reset form on success
      setFormData({ name: '', email: '', subject: '', category: '', message: '', file: null, phone: '', preferredContactMethod: '', budgetRange: '' });
      setFieldTouched({ name: false, email: false, subject: false, category: false, message: false, phone: false, preferredContactMethod: false, budgetRange: false });
      setValidationErrors({ name: '', email: '', subject: '', category: '', message: '', phone: '', preferredContactMethod: '', budgetRange: '' });
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
        setWhatsappUrl(null);
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <m.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-1 bg-primary mb-2 mx-auto"
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
              className="h-1 bg-primary mt-2 mx-auto"
              style={{ width: 60 }}
            />
          </div>
          
          <m.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </m.p>
            <div className="flex justify-center space-x-2 mt-6">
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
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 border border-primary/20 shadow-lg relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-primary/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12 bg-primary/5 rounded-full"></div>
            
            <div className="relative z-10 text-center">
              <m.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6"
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
                  href="https://wa.me/254797561978?text=Hi%20Austin!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you."
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
                  <strong>Available for new projects</strong> • Currently accepting web development and consultation work
                </p>
              </div>

              {/* Response Time Information */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Response Time
                </h4>
                <p className="text-sm text-muted-foreground">
                  I typically respond to messages within <strong>24-48 hours</strong> during business days. 
                  For urgent inquiries, WhatsApp is the fastest way to reach me.
                </p>
              </div>

              {/* Business Hours */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Business Hours (EAT)
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Weekends:</strong> Limited availability for urgent projects</p>
                  <p><strong>Holidays:</strong> Emergency support only</p>
                </div>
              </div>
                {/* Contact Information Grid */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-foreground">Get in Touch</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start group transition-all">
                    <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-3 flex-shrink-0">
                      <FaMapMarkerAlt className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-base">Location</h5>
                      <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start group transition-all">
                    <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-3 flex-shrink-0">
                      <FaEnvelope className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-base">Email</h5>
                      <a 
                        href="mailto:kuriaaustin125@gmail.com" 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                      >
                        Send Email
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start group transition-all">
                    <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-3 flex-shrink-0">
                      <FaWhatsapp className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-base">WhatsApp</h5>
                      <a 
                        href="https://wa.me/254797561978?text=Hi%20Austin!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20with%20you." 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                      >
                        Message on WhatsApp
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start group transition-all">
                    <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-3 flex-shrink-0">
                      <FaLinkedin className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-base">LinkedIn</h5>
                      <a 
                        href="https://linkedin.com/in/austin-maina" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                      >
                        Connect on LinkedIn
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start group transition-all">
                    <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-3 flex-shrink-0">
                      <FaGithub className="text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-base">GitHub</h5>
                      <a 
                        href="https://github.com/Austinkuria" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                      >
                        View Projects & Code
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start group transition-all">
                    {/* <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 mr-3 flex-shrink-0">
                      <FaTwitter className="text-lg" />
                    </div> */}
                    {/* <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-base">Twitter / X</h5>
                      <a 
                        href="https://twitter.com/AustinMaina_" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                      >
                        Follow on X
                      </a>
                    </div> */}
                  </div>                </div>
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
              
              <h3 className="text-2xl font-bold mb-6 flex items-center relative z-10">
                <span className="inline-block w-8 h-1 bg-primary mr-3"></span>
                Send Me a Message
              </h3>
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Your Name
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
                      placeholder="Austin Maina"
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
                
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Your Email
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
                      placeholder="austinexample@gmail.com"
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
                  <div className="group">
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Subject
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
                      <option value="mobile-app">Mobile App Development</option>
                      <option value="ui-ux-design">UI/UX Design</option>
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
                
                <div className="group">
                  <label htmlFor="message" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Your Message
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
                      className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all resize-none pl-10 ${
                        validationErrors.message && fieldTouched.message
                          ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                          : validationErrors.message === '' && formData.message && fieldTouched.message
                          ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                          : 'border-border focus:ring-primary/30 focus:border-primary'
                      }`}
                      placeholder="Hello! I'd like to talk about..."
                    ></textarea>
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
                  <div className="group">
                  <label htmlFor="file" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Upload File (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFormData((prev) => ({ ...prev, file: file || null }));
                      }}
                      className="w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all cursor-pointer"
                    />
                  </div>
                  {formData.file && (
                    <p className="text-sm text-muted-foreground mt-1">Selected file: {formData.file.name}</p>
                  )}
                </div>
                  <div className="group">
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                        validationErrors.phone ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., +254712345678"
                    />
                    {/* Validation indicator */}
                    {fieldTouched.phone && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {validationErrors.phone ? (
                          <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                        ) : formData.phone ? (
                          <FaCheck className="text-green-500 w-4 h-4" />
                        ) : null}
                      </span>
                    )}
                  </div>
                  {fieldTouched.phone && validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FaExclamationTriangle className="w-3 h-3 mr-1" />
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
                  <div className="group">
                  <label htmlFor="preferredContactMethod" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Preferred Contact Method
                  </label>
                  <div className="relative">
                    <select
                      id="preferredContactMethod"
                      name="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all pl-10 appearance-none cursor-pointer ${
                        validationErrors.preferredContactMethod && fieldTouched.preferredContactMethod
                          ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                          : validationErrors.preferredContactMethod === '' && formData.preferredContactMethod && fieldTouched.preferredContactMethod
                          ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                          : 'border-border focus:ring-primary/30 focus:border-primary'
                      }`}
                    >
                      <option value="">Select a method...</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                      validationErrors.preferredContactMethod && fieldTouched.preferredContactMethod
                        ? 'text-red-500'
                        : validationErrors.preferredContactMethod === '' && formData.preferredContactMethod && fieldTouched.preferredContactMethod
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
                    {fieldTouched.preferredContactMethod && (
                      <span className="absolute right-10 top-1/2 -translate-y-1/2">
                        {validationErrors.preferredContactMethod ? (
                          <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                        ) : formData.preferredContactMethod ? (
                          <FaCheck className="text-green-500 w-4 h-4" />
                        ) : null}
                      </span>
                    )}
                  </div>
                  {validationErrors.preferredContactMethod && fieldTouched.preferredContactMethod && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FaExclamationTriangle className="w-3 h-3 mr-1" />
                      {validationErrors.preferredContactMethod}
                    </p>
                  )}
                </div>
                  <div className="group">
                  <label htmlFor="budgetRange" className="block text-sm font-medium mb-2 group-focus-within:text-primary transition-colors">
                    Budget Range
                    <span className="ml-1 text-muted-foreground cursor-pointer" title="Select your estimated project budget. This helps me tailor my proposal.">
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full px-4 py-3 rounded-lg border bg-background/80 focus:outline-none focus:ring-2 transition-all pl-10 appearance-none cursor-pointer ${
                        validationErrors.budgetRange && fieldTouched.budgetRange
                          ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                          : validationErrors.budgetRange === '' && formData.budgetRange && fieldTouched.budgetRange
                          ? 'border-green-500 focus:ring-green-500/30 focus:border-green-500'
                          : 'border-border focus:ring-primary/30 focus:border-primary'
                      }`}
                    >
                      <option value="">Select a budget range...</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="over-5000">Over $5,000</option>
                    </select>
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                      validationErrors.budgetRange && fieldTouched.budgetRange
                        ? 'text-red-500'
                        : validationErrors.budgetRange === '' && formData.budgetRange && fieldTouched.budgetRange
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /></svg>
                    </span>
                    {/* Dropdown arrow */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                    {/* Validation indicator */}
                    {fieldTouched.budgetRange && (
                      <span className="absolute right-8 top-1/2 -translate-y-1/2">
                        {validationErrors.budgetRange ? (
                          <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                        ) : formData.budgetRange ? (
                          <FaCheck className="text-green-500 w-4 h-4" />
                        ) : null}
                      </span>
                    )}
                  </div>
                  {validationErrors.budgetRange && fieldTouched.budgetRange && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <FaExclamationTriangle className="w-3 h-3 mr-1" />
                      {validationErrors.budgetRange}
                    </p>
                  )}
                  {/* Real-time feedback for valid input */}
                  {!validationErrors.budgetRange && formData.budgetRange && fieldTouched.budgetRange && (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <FaCheck className="w-3 h-3 mr-1" /> Looks good!
                    </p>
                  )}
                </div>
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
                </m.button>                {/* Form validation summary */}
                {!isFormValid() && (fieldTouched.name || fieldTouched.email || fieldTouched.subject || fieldTouched.category || fieldTouched.message || fieldTouched.phone || fieldTouched.preferredContactMethod || fieldTouched.budgetRange) && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Please complete the following:</p>
                    <ul className="space-y-1">
                      {!formData.name.trim() && <li>• Enter your name</li>}
                      {!formData.email.trim() && <li>• Enter your email address</li>}
                      {!formData.subject.trim() && <li>• Enter a subject</li>}
                      {!formData.category.trim() && <li>• Select a project category</li>}
                      {!formData.message.trim() && <li>• Write your message</li>}
                      {!formData.phone.trim() && <li>• Enter your phone number</li>}
                      {!formData.preferredContactMethod.trim() && <li>• Select a preferred contact method</li>}
                      {!formData.budgetRange.trim() && <li>• Select a budget range</li>}
                      {validationErrors.name && <li>• Fix name validation errors</li>}
                      {validationErrors.email && <li>• Fix email validation errors</li>}
                      {validationErrors.subject && <li>• Fix subject validation errors</li>}
                      {validationErrors.category && <li>• Fix category validation errors</li>}
                      {validationErrors.message && <li>• Fix message validation errors</li>}
                      {validationErrors.phone && <li>• Fix phone validation errors</li>}
                      {validationErrors.preferredContactMethod && <li>• Fix preferred contact method validation errors</li>}
                      {validationErrors.budgetRange && <li>• Fix budget range validation errors</li>}
                    </ul>
                  </div>
                )}
                
                {submitStatus !== 'idle' && (
                  <MotionDiv
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`mt-4 p-3 rounded-lg ${
                      submitStatus === 'success' 
                        ? 'bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400' 
                        : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
                    } flex items-center`}
                  >                    {submitStatus === 'success' ? (
                      <>
                        <FaCheck className="mr-2 flex-shrink-0" />
                        <span>Thank you! Your message has been sent successfully. You'll receive a confirmation email, and I'll get back to you soon.</span>
                      </>                    ) : (
                      <>
                        <FaExclamationTriangle className="mr-2 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="whitespace-pre-line">
                            {errorMessage || 'Something went wrong. Please try again or contact me directly at kuriaaustin125@gmail.com'}
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
            </div>          </m.div>
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

        {/* Portfolio Highlights Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Recent Work Highlights</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A showcase of my latest projects demonstrating various skills and technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredProjects.map((project, index) => (
              <m.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-primary/90 rounded-full p-3">
                      {project.icon}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h4>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </m.div>
            ))}
          </div>

          <div className="text-center">
            <m.a
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              View All Projects
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </m.a>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
