import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { personalInfo, socialLinks, contactConfig, siteConfig, emailConfig, appConfig } from '@/config';

// Initialize Resend for notification emails
const resend = new Resend(emailConfig.apiKey);

// Initialize Gmail SMTP transporter for auto-reply emails
const gmailTransporter = nodemailer.createTransport({
  service: emailConfig.gmail.service,
  host: emailConfig.gmail.host,
  port: emailConfig.gmail.port,
  secure: emailConfig.gmail.secure,
  auth: {
    user: emailConfig.gmail.user,
    pass: emailConfig.gmail.password,
  },
});

// Simple in-memory rate limiter (for basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Input sanitization
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 2000); // Limit length
}

// Refined spam detection function
function detectSpam(name: string, email: string, subject: string, message: string, category?: string, phone?: string, preferredContactMethod?: string, budgetRange?: string): { isSpam: boolean; reason: string } {
  const combinedText = `${name} ${email} ${subject} ${message} ${category || ''} ${phone || ''} ${preferredContactMethod || ''} ${budgetRange || ''}`.toLowerCase();

  // Use spam keywords from configuration
  const spamKeywords = contactConfig.spamKeywords;

  // Simplified suspicious patterns
  const suspiciousPatterns = [
    /<script[^>]*>/gi,
    /javascript:/gi,
    /eval\s*\(/gi,
    /union\s+select/gi,
    /drop\s+table/gi
  ];

  // Check for spam keywords
  for (const keyword of spamKeywords) {
    if (combinedText.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combinedText)) {
      return { isSpam: true, reason: `Suspicious pattern detected: ${pattern.source}` };
    }
  }

  // Check for excessive capitalization
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  if (message.length > 20 && capsRatio > 0.7) {
    return { isSpam: true, reason: 'Excessive capitalization detected' };
  }

  // Check for excessive URLs
  const urlMatches = message.match(/https?:\/\/[^\s]+/g) || [];
  if (urlMatches.length > 3) {
    return { isSpam: true, reason: 'Too many URLs detected' };
  }

  return { isSpam: false, reason: '' };
}

// Get personalized project information based on category
function getPersonalizedProjectInfo(category?: string): string {
  const categoryInfo: { [key: string]: { timeline: string; features: string[]; samples: string[] } } = {
    'web-development': {
      timeline: '3-6 weeks for full websites',
      features: ['Mobile-responsive design', 'Fast loading speeds', 'Search engine optimized', 'User-friendly interface'],
      samples: ['Portfolio websites', 'Business websites', 'Landing pages']
    },
    'ecommerce': {
      timeline: '4-8 weeks for e-commerce platforms',
      features: ['Secure payment processing', 'Inventory management', 'Mobile shopping experience', 'Customer accounts'],
      samples: ['Online stores', 'Product catalogs', 'Booking systems']
    },
    'backend-development': {
      timeline: '2-5 weeks for backend systems',
      features: ['Secure data storage', 'Fast performance', 'Reliable uptime', 'Scalable architecture'],
      samples: ['Database systems', 'User authentication', 'Data processing']
    },
    'ui-ux-design': {
      timeline: '2-4 weeks for design work',
      features: ['User-centered design', 'Professional appearance', 'Easy navigation', 'Brand consistency'],
      samples: ['Website designs', 'App interfaces', 'Brand guidelines']
    },
    'api-development': {
      timeline: '1-4 weeks for system integration',
      features: ['Secure data exchange', 'Automated processes', 'Third-party integrations', 'Real-time updates'],
      samples: ['Payment systems', 'Social media integration', 'Email automation']
    }
  };

  const info = categoryInfo[category || 'web-development'];

  return `
    <div style="margin-bottom: 15px;">
      <strong style="color: #1e293b;">⏱️ Estimated Timeline:</strong>
      <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">${info?.timeline || 'Varies by project scope'}</p>
    </div>
    <div style="margin-bottom: 0;">
      <strong style="color: #1e293b;">✨ What You'll Get:</strong>
      <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">${info?.features.join(', ') || 'Custom features based on your needs'}</p>
    </div>
    ${info?.samples ? `
    <div style="margin-top: 15px;">
      <strong style="color: #1e293b;">📋 Similar Projects:</strong>
      <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">${info.samples.join(', ')}</p>
    </div>
    ` : ''}
  `;
}

// Test endpoint to verify API routes are working
export async function GET() {
  return NextResponse.json({
    message: 'Contact API endpoint is active',
    timestamp: new Date().toISOString(),
    environment: {
      hasResendKey: !!emailConfig.apiKey,
      fromEmail: emailConfig.from.default ? 'configured' : 'missing',
      toEmail: emailConfig.to.default ? 'configured' : 'missing'
    }
  });
}

export async function POST(request: NextRequest) {
  // Add debugging for production
  console.log('Contact API called at:', new Date().toISOString());
  console.log('Environment check:', {
    hasResendKey: !!emailConfig.apiKey,
    notificationFromEmail: emailConfig.from.notification,
    autoReplyFromEmail: emailConfig.gmail.user + ' (via Gmail SMTP)',
    hasGmailPassword: !!emailConfig.gmail.password,
    toEmail: emailConfig.to.default
  });

  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Apply rate limiting (5 requests per 15 minutes per IP)
    if (!rateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait 15 minutes before sending another message.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 });
    }

    const body = await request.json();
    let { name, email, subject, category, message, phone, preferredContactMethod, budgetRange, recaptchaToken } = body;

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json(
        {
          error: 'reCAPTCHA verification failed. Please refresh the page and try again.',
          code: 'RECAPTCHA_MISSING'
        },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA with Google
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    // Log reCAPTCHA score for monitoring
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('reCAPTCHA Score:', recaptchaData.score);
    console.log('Success:', recaptchaData.success);
    console.log('Action:', recaptchaData.action);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Check if reCAPTCHA verification was successful
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.log('reCAPTCHA verification failed:', {
        success: recaptchaData.success,
        score: recaptchaData.score,
        errorCodes: recaptchaData['error-codes']
      });

      return NextResponse.json(
        {
          error: 'Security verification failed. You may be identified as a bot. Please try again or contact us directly.',
          code: 'RECAPTCHA_FAILED',
          score: recaptchaData.score
        },
        { status: 403 }
      );
    }

    console.log(' reCAPTCHA verification successful - User appears human!');

    // Validate required fields (only essential fields are required now)
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: 'Required fields are missing. Please complete all required fields.',
          code: 'MISSING_FIELDS'
        },
        { status: 400 });
    }

    // Sanitize inputs (essential fields)
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    subject = sanitizeInput(subject);
    message = sanitizeInput(message);

    // Sanitize optional fields if provided
    category = category ? sanitizeInput(category) : '';
    phone = phone ? sanitizeInput(phone) : '';
    preferredContactMethod = preferredContactMethod ? sanitizeInput(preferredContactMethod) : '';
    budgetRange = budgetRange ? sanitizeInput(budgetRange) : '';

    // Validate field lengths
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters.' },
        { status: 400 }
      );
    }

    if (subject.length < 3 || subject.length > 100) {
      return NextResponse.json(
        { error: 'Subject must be between 3 and 100 characters.' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters.' },
        { status: 400 }
      );
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'Please enter a valid email address.',
          code: 'INVALID_EMAIL'
        },
        { status: 400 });
    }

    // Enhanced spam detection system
    const spamDetectionResult = detectSpam(name, email, subject, message, category, phone, preferredContactMethod, budgetRange);
    if (spamDetectionResult.isSpam) {
      console.log('Spam detected:', spamDetectionResult.reason);

      // Generate a unique reference ID for this detection
      const referenceId = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Log the reference ID with details for manual review
      console.log(`Spam detection reference ${referenceId}:`, {
        name,
        email,
        message: message.substring(0, 100),
        reason: spamDetectionResult.reason,
        timestamp: new Date().toISOString(),
        ip
      });      // Create WhatsApp message with user email and reference ID
      const whatsappMessage = encodeURIComponent(
        `Hi ${personalInfo.name.first}! I tried to send a message through your portfolio contact form but it was flagged by your security filters.\n\nMy email: ${email}\nReference ID: ${referenceId}\n\nCould you please help me resolve this issue? Thank you!`
      );
      const whatsappUrl = `${socialLinks.whatsapp}?text=${whatsappMessage}`;

      const linkedinMessage = encodeURIComponent(
        `Hi ${personalInfo.name.first}! I tried to send a message through your portfolio contact form but it was flagged by your security filters.\n\nMy email: ${email}\nReference ID: ${referenceId}\n\nCould you please help me resolve this issue? Thank you!`
      );
      const linkedinUrl = `${socialLinks.linkedin}?message=${linkedinMessage}`;

      const userMessage = `Your message couldn't be sent due to our automated security filters.

If you believe this is an error, please contact me directly:

📧 Email: ${personalInfo.email}
💼 LinkedIn: <a href='${linkedinUrl}' target='_blank' rel='noopener noreferrer'>Click here to send me a message on LinkedIn</a>

Reference ID: ${referenceId}

You can also click the WhatsApp button below to send me a quick message with your details.`;

      return NextResponse.json(
        {
          error: userMessage,
          code: 'SPAM_DETECTED',
          referenceId: referenceId,
          alternativeContact: {
            email: personalInfo.email,
            linkedin: socialLinks.linkedin,
            whatsappUrl: whatsappUrl,
            whatsappDisplay: 'Contact via WhatsApp'
          },
          details: appConfig.isDevelopment ? spamDetectionResult.reason : undefined
        },
        { status: 400 });
    }

    // Enhanced email templates with better branding
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Message analytics
    const messageWordCount = message.trim().split(/\s+/).length;
    const urgencyScore = message.toLowerCase().includes('urgent') || message.toLowerCase().includes('asap') || message.toLowerCase().includes('immediate') ? 'HIGH' : 'NORMAL';

    // Get additional request info  
    const referer = request.headers.get('referer') || 'Direct visit';

    // Email to you (notification) - Enhanced
    // Prepare email with attachments if file is provided
    let attachments = [];
    if (body.fileData && body.fileName) {
      try {
        // Make sure the data is a valid data URL
        if (body.fileData.startsWith('data:')) {
          // Extract the base64 data part from the data URL (removing the prefix like "data:application/pdf;base64,")
          const base64Data = body.fileData.split(',')[1];

          if (base64Data) {
            // Get the file extension and set content type
            let contentType = body.fileType || 'application/octet-stream';
            const fileExt = body.fileName.split('.').pop()?.toLowerCase();

            // Ensure we have a proper content type based on extension
            if (!contentType || contentType === 'unknown/unknown') {
              if (fileExt === 'pdf') contentType = 'application/pdf';
              else if (fileExt === 'doc' || fileExt === 'docx') contentType = 'application/msword';
              else if (fileExt === 'png') contentType = 'image/png';
              else if (fileExt === 'jpg' || fileExt === 'jpeg') contentType = 'image/jpeg';
            }

            attachments.push({
              filename: body.fileName,
              content: base64Data,
              encoding: 'base64',
              contentType: contentType
            });
            console.log(`Attachment prepared: ${body.fileName} (${contentType})`);
          } else {
            console.error('Invalid file data format: Could not extract base64 content');
          }
        } else {
          console.error('Invalid file data format: Not a data URL');
        }
      } catch (error) {
        console.error('Failed to process file attachment:', error);
      }
    }

    const notificationEmail = {
      from: emailConfig.from.notification, // Use onboarding@resend.dev for notifications
      to: emailConfig.to.default,
      subject: `${urgencyScore === 'HIGH' ? '🚨 URGENT' : '🚀'} New Portfolio Contact: ${name} - ${subject}`,
      attachments: attachments,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; position: relative;">
            ${urgencyScore === 'HIGH' ? '<div style="position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">URGENT</div>' : ''}
            <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 700;">💼 New Business Inquiry</h1>
            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Someone is interested in your services!</p>
          </div>
          
          <div style="padding: 30px 20px; background: white;">
            <!-- Quick Actions Bar -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">⚡ Quick Actions</h3>
              <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry&body=Hi%20${name},%0D%0A%0D%0AThank%20you%20for%20reaching%20out!" 
                   style="background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: 500;">📧 Reply</a>
                <a href="${socialLinks.calendly}" target="_blank"
                   style="background: #22c55e; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: 500;">📅 Schedule Call</a>
                <a href="${socialLinks.linkedin}" target="_blank"
                   style="background: #0077b5; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: 500;">💼 LinkedIn</a>              </div>
            </div>
            
            <!-- Message Analytics -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; border-left: 5px solid #0ea5e9; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; display: flex; align-items: center;">
                <span style="background: #0ea5e9; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">📊</span>
                Message Analytics
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
                <div style="text-align: center; background: white; padding: 10px; border-radius: 8px;">
                  <div style="font-size: 20px; font-weight: bold; color: #0ea5e9;">${messageWordCount}</div>
                  <div style="font-size: 12px; color: #64748b;">Words</div>
                </div>
                <div style="text-align: center; background: white; padding: 10px; border-radius: 8px;">
                  <div style="font-size: 20px; font-weight: bold; color: ${urgencyScore === 'HIGH' ? '#ef4444' : '#22c55e'};">${urgencyScore}</div>
                  <div style="font-size: 12px; color: #64748b;">Priority</div>
                </div>
                <div style="text-align: center; background: white; padding: 10px; border-radius: 8px;">
                  <div style="font-size: 20px; font-weight: bold; color: #8b5cf6;">${message.length}</div>
                  <div style="font-size: 12px; color: #64748b;">Characters</div>
                </div>
              </div>            </div>
              
              <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; border-left: 5px solid #667eea; margin-bottom: 25px;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
                <span style="background: #667eea; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 15px; line-height: 1; text-align: center; vertical-align: middle;">👤</span>
                Contact Information              </h2>
                <div style="display: grid; gap: 15px;">
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 18px; font-weight: 600;">${name}</p>
                </div>
                
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</strong>
                  <p style="margin: 5px 0 0 0;">
                    <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
                  </p>
                </div>
                  
                ${phone ? `
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${phone}</p>
                </div>
                ` : ''}
                  
                ${preferredContactMethod ? `
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Contact Method</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${preferredContactMethod.charAt(0).toUpperCase() + preferredContactMethod.slice(1)}</p>
                </div>
                ` : ''}

                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${subject}</p>
                </div>

                ${category ? `
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Project Category</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</p>
                </div>
                ` : ''}
                  
                ${budgetRange ? `
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Budget Range</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                    ${(() => {
            switch (budgetRange) {
              case 'under-500': return 'Under Ksh 15,000';
              case '500-1000': return 'Ksh 15,000 - Ksh 30,000';
              case '1000-2500': return 'Ksh 30,000 - Ksh 60,000';
              case '2500-5000': return 'Ksh 60,000 - Ksh 100,000';
              case 'over-5000': return 'Over Ksh 100,000';
              default: return 'Not specified';
            }
          })()}
                  </p>
                </div>
                ` : ''}
                  
                  ${body.fileData ? `
                <div style="background: #eef2ff; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #6366f1;">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">File Attachment</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                    <span style="display: inline-flex; align-items: center; gap: 6px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      File: ${body.fileName} (${(body.fileType || '').split('/')[1]})
                    </span>
                  </p>
                  <p style="margin: 10px 0 0 0; color: #4b5563; font-size: 14px;">
                    The file has been attached to this email.
                  </p>
                </div>
                ` : ''}
              </div>
            </div>
            
            <div style="background: #fefce8; padding: 20px; border-radius: 12px; border-left: 5px solid #eab308; margin-bottom: 25px;">
              <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                <span style="background: #eab308; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">💬</span>
                Message
              </h3>
              <div style="background: white; padding: 20px; border-radius: 8px; line-height: 1.6; color: #374151; font-size: 15px; border: 1px solid #e5e7eb;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry&body=Hi%20${name},%0D%0A%0D%0AThank%20you%20for%20reaching%20out!%20I%20received%20your%20message%20and%20I'm%20excited%20to%20discuss%20your%20project.%0D%0A%0D%0ALet's%20schedule%20a%20call%20to%20discuss%20your%20requirements%20in%20detail.%0D%0A%0D%0ABest%20regards,%0D%0A${personalInfo.name.full}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                📧 Reply to ${name}
              </a>
            </div>
          </div>
          
          <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
              <div>
                <strong style="color: #475569;">📅 Received:</strong><br>
                <span style="color: #64748b; font-size: 14px;">${timestamp}</span>
              </div>
              <div>
                <strong style="color: #475569;">🌐 Source:</strong><br>
                <span style="color: #64748b; font-size: 14px;">{siteConfig.siteName}</span>
              </div>
              <div>
                <strong style="color: #475569;">🔒 Client IP:</strong><br>
                <span style="color: #64748b; font-size: 14px;">${ip}</span>
              </div>
              <div>
                <strong style="color: #475569;">📱 Referrer:</strong><br>
                <span style="color: #64748b; font-size: 14px;">${referer.includes(siteConfig.domain) ? 'Portfolio Website' : 'External'}</span>
              </div>
            </div>
            <div style="border-top: 1px solid #e2e8f0; padding-top: 15px;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">
                💡 <strong>Tip:</strong> ${urgencyScore === 'HIGH' ? 'This message was marked as urgent - consider responding quickly!' : 'Take your time to craft a thoughtful response.'}
              </p>
            </div>
          </div>
        </div>
      `,
    };        // Enhanced auto-reply email to the sender (for nodemailer/Gmail)
    const autoReplyEmailGmail = {
      from: `${personalInfo.name.full} <${emailConfig.gmail.user}>`, // Your Gmail address
      to: email,
      subject: `✨ Thanks for reaching out, ${name}! - ${personalInfo.name.full}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -30px; right: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -20px; left: -20px; width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 36px;">👋</span>
            </div>
            <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600; position: relative; z-index: 1;">Hello ${name}!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9); position: relative; z-index: 1;">Your message has been received successfully</p>
          </div>
          
          <div style="padding: 30px 20px; background: #f8fafc;">
            <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
              
              <!-- Quick Status Card -->
              <div style="text-align: center; margin-bottom: 25px; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 20px; border-radius: 10px;">
                <div style="background: #22c55e; width: 50px; height: 50px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                  <span style="font-size: 20px; color: white;">✓</span>
                </div>
                <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Message Received!</h2>
                <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 500;">
                  I'll respond within ${urgencyScore === 'HIGH' ? '12 hours' : '24-48 hours'}
                </p>
              </div>
              
              <!-- Your Message Summary -->
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">📋 Your Message Summary</h3>
                <div style="background: white; padding: 15px; border-radius: 8px;">
                  <div style="display: grid; gap: 8px; margin-bottom: 12px;">
                    <div style="display: grid; grid-template-columns: 80px 1fr; gap: 10px; font-size: 14px;">
                      <span style="color: #6b7280; font-weight: 500;">Subject:</span>
                      <span style="color: #1e293b;">${subject}</span>
                    </div>
                    ${category ? `
                    <div style="display: grid; grid-template-columns: 80px 1fr; gap: 10px; font-size: 14px;">
                      <span style="color: #6b7280; font-weight: 500;">Category:</span>
                      <span style="color: #1e293b;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</span>
                    </div>
                    ` : ''}
                  </div>
                  <div style="border-top: 1px solid #f1f5f9; padding-top: 12px;">
                    <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.5; font-style: italic;">
                      "${message.substring(0, 120)}${message.length > 120 ? '...' : ''}"
                    </p>
                  </div>
                </div>
              </div>
              
              ${getPersonalizedProjectInfo(category)}
                
              <!-- What Happens Next -->
              <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #22c55e;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">⚡ What Happens Next</h3>
                <div style="display: grid; gap: 10px;">
                  <div style="display: flex; align-items: start; padding: 8px 0;">
                    <span style="background: #22c55e; color: white; min-width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold;">1</span>
                    <div>
                      <strong style="color: #1e293b; font-size: 14px;">Initial Review</strong>
                      <p style="margin: 2px 0 0 0; color: #374151; font-size: 13px;">I'll analyze your requirements (1-2 days)</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: start; padding: 8px 0;">
                    <span style="background: #22c55e; color: white; min-width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold;">2</span>
                    <div>
                      <strong style="color: #1e293b; font-size: 14px;">Custom Proposal</strong>
                      <p style="margin: 2px 0 0 0; color: #374151; font-size: 13px;">Detailed plan with timeline & pricing (2-3 days)</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: start; padding: 8px 0;">
                    <span style="background: #22c55e; color: white; min-width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold;">3</span>
                    <div>
                      <strong style="color: #1e293b; font-size: 14px;">Discovery Call</strong>
                      <p style="margin: 2px 0 0 0; color: #374151; font-size: 13px;">Discuss details and finalize scope (30-60 mins)</p>
                    </div>
                  </div>
                  <div style="display: flex; align-items: start; padding: 8px 0;">
                    <span style="background: #22c55e; color: white; min-width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 12px; font-weight: bold;">4</span>
                    <div>
                      <strong style="color: #1e293b; font-size: 14px;">Project Kickoff</strong>
                      <p style="margin: 2px 0 0 0; color: #374151; font-size: 13px;">Contract signing and development begins</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Top 3 FAQ -->
              <div style="background: #fef7f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f97316;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">❓ Quick Answers</h3>
                <div style="display: grid; gap: 12px;">
                  <div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #f97316;">
                    <strong style="color: #1e293b; font-size: 14px;">🤝 How do you work with clients?</strong>
                    <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px; line-height: 1.4;">Transparent collaboration with regular updates. You're always in the loop via email, WhatsApp, or calls.</p>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #f97316;">
                    <strong style="color: #1e293b; font-size: 14px;">📱 Mobile-responsive included?</strong>
                    <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px; line-height: 1.4;">Absolutely! All projects work perfectly on desktop, tablet, and mobile devices.</p>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #f97316;">
                    <strong style="color: #1e293b; font-size: 14px;">� What about revisions?</strong>
                    <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px; line-height: 1.4;">Reasonable revisions included. We'll discuss specifics during our initial call.</p>
                  </div>
                </div>
              </div>
              
              <!-- Action Center -->
              <div style="text-align: center; margin: 25px 0 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">🚀 While You Wait</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-bottom: 20px;">
                  <a href="${siteConfig.url}/projects" style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 13px; margin: 10px 10px;">🚀 View Projects</a>
                  <a href="${siteConfig.url}/skills" style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 13px; margin: 10px 10px;">💻 My Skills</a>
                  <a href="${siteConfig.url}/about" style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 15px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 13px; margin: 10px 10px;">👨‍💻 About Me</a>
                </div>
                
                <!-- Quick Contact -->
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                  <p style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; font-weight: 600;">📞 Need Urgent Help?</p>
                  <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                    <a href="${socialLinks.whatsapp}" target="_blank" style="color: #25d366; text-decoration: none; font-weight: 500; font-size: 13px;">� WhatsApp</a>
                    <a href="${socialLinks.linkedin}" target="_blank" style="color: #0077b5; text-decoration: none; font-weight: 500; font-size: 13px;">💼 LinkedIn</a>
                    <a href="${socialLinks.calendly}" target="_blank" style="color: #22c55e; text-decoration: none; font-weight: 500; font-size: 13px;">� Schedule Call</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: white; font-size: 16px; font-weight: 600;">Best regards,</p>
            <p style="margin: 0 0 12px 0; color: #667eea; font-size: 20px; font-weight: 700;">${personalInfo.name.full}</p>
            <p style="margin: 0 0 15px 0; color: #94a3b8; font-size: 13px;">Full-Stack Developer & Digital Solutions Expert</p>
            <div style="border-top: 1px solid #374151; padding-top: 15px;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                📧 ${personalInfo.email} | 🌐 <a href="${siteConfig.url}" style="color: #667eea; text-decoration: none;">Portfolio</a>
              </p>
              <p style="margin: 8px 0 0 0; color: #64748b; font-size: 11px;">
                This is an automated confirmation. I'll respond personally soon!
              </p>
            </div>
          </div>
        </div>
      `,
    };        // Send emails asynchronously (fire and forget) to speed up response time
    // Send response immediately without waiting for email delivery
    const response = NextResponse.json({
      success: true,
      message: 'Your message has been received! I\'ll get back to you soon.',
      data: {
        timestamp: new Date().toISOString(),
      }
    });

    // Send emails in background without blocking response
    Promise.allSettled([
      resend.emails.send(notificationEmail),
      gmailTransporter.sendMail(autoReplyEmailGmail),
    ]).then(([notificationResult, autoReplyResult]) => {
      // Log results for monitoring
      if (notificationResult.status === 'rejected') {
        console.error('Notification email failed:', notificationResult.reason);

        // Check if the error is related to the attachment
        const errorMsg = notificationResult.reason?.toString() || '';
        const isAttachmentError = errorMsg.toLowerCase().includes('attachment') ||
          errorMsg.toLowerCase().includes('file') ||
          errorMsg.toLowerCase().includes('base64');

        // If it's an attachment error, try again without the attachment
        if (isAttachmentError && body.fileData) {
          console.log('Attempting to send email without attachment due to attachment error');

          // Remove attachments and try again
          const notificationWithoutAttachment = {
            ...notificationEmail,
            attachments: [],
          };

          resend.emails.send(notificationWithoutAttachment).catch(err => {
            console.error('Retry without attachment also failed:', err);
          });
        }
      } else {
        console.log('Notification email sent successfully');
      }

      // Log auto-reply result
      if (autoReplyResult.status === 'rejected') {
        console.error('Auto-reply email failed:', autoReplyResult.reason);
      } else {
        console.log('Auto-reply email sent successfully');
      }
    }).catch(err => {
      console.error('Email sending error:', err);
    });

    return response;
  } catch (error) {
    console.error('Contact form error:', error);

    // Return appropriate error message
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid request format.',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    } return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR',
        details: appConfig.isDevelopment ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
