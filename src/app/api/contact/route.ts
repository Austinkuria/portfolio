import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { personalInfo, socialLinks, contactConfig, siteConfig, emailConfig, appConfig } from '@/config';

// Helper to build prefilled Calendly URL
function buildPrefilledSchedulingUrl(name?: string, email?: string, subject?: string): string {
  const schedulingBase = socialLinks.calendly || '';
  if (!schedulingBase) return '#';

  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (email) params.set('email', email);
  if (subject) params.set('a1', subject); // Calendly custom answer field

  return `${schedulingBase}${schedulingBase.includes('?') ? '&' : '?'}${params.toString()}`;
}

// Portfolio color scheme for consistent email branding
const emailTheme = {
  // Primary colors matching portfolio
  primary: 'hsl(221.2, 83.2%, 53.3%)',      // Portfolio blue
  primaryLight: 'hsl(221.2, 83.2%, 97%)',   // Very light blue bg
  primaryDark: 'hsl(221.2, 83.2%, 40%)',    // Darker blue for hover

  // Accent colors
  success: '#10b981',        // Green
  warning: '#f59e0b',        // Orange
  danger: '#ef4444',         // Red
  purple: '#8b5cf6',         // Purple

  // Neutral colors
  background: '#ffffff',
  backgroundAlt: '#f8fafc',
  backgroundDark: '#1e293b',

  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textLight: '#94a3b8',

  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
};

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
function detectSpam(name: string, email: string, subject: string, message: string, category?: string): { isSpam: boolean; reason: string } {
  const combinedText = `${name} ${email} ${subject} ${message} ${category || ''}`.toLowerCase();

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
    let { name, email, subject, category, message, recaptchaToken } = body;

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
    const spamDetectionResult = detectSpam(name, email, subject, message, category);
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
      });

      const linkedinMessage = encodeURIComponent(
        `Hi ${personalInfo.name.first}! I tried to send a message through your portfolio contact form but it was flagged by your security filters.\n\nMy email: ${email}\nReference ID: ${referenceId}\n\nCould you please help me resolve this issue? Thank you!`
      );
      const linkedinUrl = `${socialLinks.linkedin}?message=${linkedinMessage}`;

      const userMessage = `Your message couldn't be sent due to our automated security filters.

If you believe this is an error, please contact me via email directly:

Email: ${personalInfo.email}
LinkedIn: <a href='${linkedinUrl}' target='_blank' rel='noopener noreferrer'>Click here to send me a message on LinkedIn</a>

Reference ID: ${referenceId}`;

      return NextResponse.json(
        {
          error: userMessage,
          code: 'SPAM_DETECTED',
          referenceId: referenceId,
          alternativeContact: {
            email: personalInfo.email,
            linkedin: socialLinks.linkedin
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

    // Email to you (notification) - Enhanced
    const notificationEmail = {
      from: emailConfig.from.notification,
      to: emailConfig.to.default,
      subject: urgencyScore === 'HIGH' ? `[URGENT] New Project Inquiry - ${name}` : `New Project Inquiry - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${emailTheme.backgroundAlt};">
          <div style="max-width: 600px; margin: 0 auto; background: ${emailTheme.background};">
            
            <!-- Header -->
            <div style="background: ${emailTheme.primary}; padding: 40px 32px; text-align: center;">
              ${urgencyScore === 'HIGH' ? `<div style="background: ${emailTheme.danger}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-block; margin-bottom: 12px; letter-spacing: 0.5px;">URGENT</div>` : ''}
              <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">New Inquiry</h1>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px;">From ${name}</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              
              <!-- Stats Bar -->
              <div style="display: flex; gap: 12px; margin-bottom: 32px; padding: 20px; background: ${emailTheme.primaryLight}; border-radius: 8px; border: 1px solid ${emailTheme.border};">
                <div style="flex: 1; text-align: center;">
                  <div style="font-size: 24px; font-weight: 600; color: ${emailTheme.textPrimary};">${messageWordCount}</div>
                  <div style="font-size: 13px; color: ${emailTheme.textMuted}; margin-top: 4px;">Words</div>
                </div>
                <div style="flex: 1; text-align: center; border-left: 1px solid ${emailTheme.border}; border-right: 1px solid ${emailTheme.border};">
                  <div style="font-size: 24px; font-weight: 600; color: ${urgencyScore === 'HIGH' ? emailTheme.danger : emailTheme.success};">${urgencyScore === 'HIGH' ? 'High' : 'Normal'}</div>
                  <div style="font-size: 13px; color: ${emailTheme.textMuted}; margin-top: 4px;">Priority</div>
                </div>
                <div style="flex: 1; text-align: center;">
                  <div style="font-size: 24px; font-weight: 600; color: ${emailTheme.textPrimary};">Now</div>
                  <div style="font-size: 13px; color: ${emailTheme.textMuted}; margin-top: 4px;">Received</div>
                </div>
              </div>

              <!-- Contact Info -->
              <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: ${emailTheme.textPrimary}; text-transform: uppercase; letter-spacing: 0.5px;">Contact</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${emailTheme.borderLight};">
                      <div style="font-size: 13px; color: ${emailTheme.textMuted};">Name</div>
                      <div style="font-size: 15px; color: ${emailTheme.textPrimary}; font-weight: 500; margin-top: 4px;">${name}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${emailTheme.borderLight};">
                      <div style="font-size: 13px; color: ${emailTheme.textMuted};">Email</div>
                      <div style="font-size: 15px; color: ${emailTheme.textPrimary}; font-weight: 500; margin-top: 4px;">${email}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid ${emailTheme.borderLight};">
                      <div style="font-size: 13px; color: ${emailTheme.textMuted};">Subject</div>
                      <div style="font-size: 15px; color: ${emailTheme.textPrimary}; font-weight: 500; margin-top: 4px;">${subject}</div>
                    </td>
                  </tr>
                  ${category ? `
                  <tr>
                    <td style="padding: 12px 0;">
                      <div style="font-size: 13px; color: ${emailTheme.textMuted};">Category</div>
                      <div style="font-size: 15px; color: ${emailTheme.textPrimary}; font-weight: 500; margin-top: 4px;">${category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Message -->
              <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: ${emailTheme.textPrimary}; text-transform: uppercase; letter-spacing: 0.5px;">Message</h2>
                <div style="padding: 20px; background: ${emailTheme.backgroundAlt}; border-left: 4px solid ${emailTheme.primary}; border-radius: 4px;">
                  <p style="margin: 0; color: ${emailTheme.textSecondary}; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${message}</p>
                </div>
              </div>

              <!-- Actions -->
              <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: ${emailTheme.textPrimary}; text-transform: uppercase; letter-spacing: 0.5px;">Quick Actions</h2>
                <div style="display: flex; gap: 12px;">
                  <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}" 
                     style="flex: 1; background: ${emailTheme.primary}; color: white; padding: 14px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; text-align: center; display: block;">
                    Reply
                  </a>
                  <a href="${socialLinks.calendly}" target="_blank"
                     style="flex: 1; background: ${emailTheme.success}; color: white; padding: 14px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; text-align: center; display: block;">
                    Schedule
                  </a>
                </div>
              </div>

              <!-- Recommendation -->
              <div style="padding: 16px; background: #fef3c7; border-left: 4px solid ${emailTheme.warning}; border-radius: 4px;">
                <div style="font-size: 13px; font-weight: 600; color: #92400e; margin-bottom: 4px;">RECOMMENDATION</div>
                <div style="font-size: 14px; color: #78350f; line-height: 1.5;">
                  ${urgencyScore === 'HIGH' ? 'Respond within 12 hours - marked as high priority' : 'Respond within 24-48 hours'}
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="background: ${emailTheme.backgroundAlt}; padding: 24px; border-top: 1px solid ${emailTheme.border}; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: ${emailTheme.textMuted};">
                ${timestamp} • ${siteConfig.siteName}
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    };

    // Function to determine if client needs simple or detailed email template
    function isSimpleClientRequest(category: string | undefined, message: string): boolean {
      // Simple clients: basic website requests, short messages, or general inquiries
      const simpleCategories = ['basic-website', 'simple-website', 'landing-page', 'portfolio-website'];
      const isSimpleCategory = category && simpleCategories.includes(category.toLowerCase());

      // Simple if message is short (under 100 characters) or contains simple keywords
      const isShortMessage = message.length < 100;
      const simpleKeywords = ['simple', 'basic', 'small', 'just need', 'looking for', 'want a'];
      const hasSimpleKeywords = simpleKeywords.some(keyword =>
        message.toLowerCase().includes(keyword)
      );

      // Technical clients get detailed template
      const technicalKeywords = ['api', 'database', 'backend', 'frontend', 'react', 'node', 'typescript', 'custom', 'complex', 'integration'];
      const isTechnical = technicalKeywords.some(keyword =>
        message.toLowerCase().includes(keyword)
      );

      return (isSimpleCategory || isShortMessage || hasSimpleKeywords) && !isTechnical;
    }

    // Auto-reply email to the sender (for nodemailer/Gmail)
    const isSimpleClient = isSimpleClientRequest(category, message);
    const autoReplyEmailGmail = {
      from: `${personalInfo.name.full} <${emailConfig.gmail.user}>`,
      to: email,
      subject: `Thanks for your message, ${name}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${emailTheme.backgroundAlt};">
          <div style="max-width: 600px; margin: 0 auto; background: ${emailTheme.background};">
            
            <!-- Header -->
            <div style="background: ${emailTheme.primary}; padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: white; font-weight: 600;">Message Received</h1>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px;">I'll get back to you soon</p>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              
              <!-- Greeting -->
              <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: ${emailTheme.textPrimary};">Hi ${name}!</h2>
                <p style="margin: 0; color: ${emailTheme.textSecondary}; line-height: 1.6; font-size: 15px;">
                  Thanks for reaching out about "${subject}". I received your message and will review it carefully.
                </p>
              </div>

              <!-- What I Received -->
              <div style="margin-bottom: 32px; padding: 20px; background: ${emailTheme.primaryLight}; border-radius: 8px; border: 1px solid ${emailTheme.border};">
                <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">Your Inquiry</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: ${emailTheme.textMuted};">Subject:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: ${emailTheme.textPrimary}; font-weight: 500; text-align: right;">${subject}</td>
                  </tr>
                  ${category ? `
                  <tr>
                    <td style="padding: 8px 0; border-top: 1px solid ${emailTheme.border}; font-size: 13px; color: ${emailTheme.textMuted};">Project Type:</td>
                    <td style="padding: 8px 0; border-top: 1px solid ${emailTheme.border}; font-size: 14px; color: ${emailTheme.textPrimary}; font-weight: 500; text-align: right;">${category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</td>
                  </tr>
                  ` : ''}
                </table>
                ${message.length > 50 ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid ${emailTheme.border};">
                  <p style="margin: 0; color: ${emailTheme.textMuted}; font-size: 13px; font-style: italic; line-height: 1.5;">
                    "${message.substring(0, 120)}${message.length > 120 ? '...' : ''}"
                  </p>
                </div>
                ` : ''}
              </div>

              <!-- Next Steps -->
              <div style="margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: ${emailTheme.textPrimary};">What's Next</h3>
                <div style="display: grid; gap: 12px;">
                  <div style="padding: 16px; background: ${emailTheme.backgroundAlt}; border-left: 4px solid ${emailTheme.primary}; border-radius: 4px;">
                    <div style="font-size: 14px; font-weight: 600; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">1. I'll read your message</div>
                    <div style="font-size: 13px; color: ${emailTheme.textMuted}; line-height: 1.5;">Usually get to messages within a day or two</div>
                  </div>
                  <div style="padding: 16px; background: ${emailTheme.backgroundAlt}; border-left: 4px solid ${emailTheme.success}; border-radius: 4px;">
                    <div style="font-size: 14px; font-weight: 600; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">2. We'll set up a meeting</div>
                    <div style="font-size: 13px; color: ${emailTheme.textMuted}; line-height: 1.5;">Quick 15-30 min call to discuss your project and answer questions</div>
                  </div>
                  <div style="padding: 16px; background: ${emailTheme.backgroundAlt}; border-left: 4px solid ${emailTheme.warning}; border-radius: 4px;">
                    <div style="font-size: 14px; font-weight: 600; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">3. I'll send you a proposal</div>
                    <div style="font-size: 13px; color: ${emailTheme.textMuted}; line-height: 1.5;">What we'll build, timeline, and cost - all written down clearly</div>
                  </div>
                  ${!isSimpleClient ? `
                  <div style="padding: 16px; background: ${emailTheme.backgroundAlt}; border-left: 4px solid ${emailTheme.purple}; border-radius: 4px;">
                    <div style="font-size: 14px; font-weight: 600; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">4. Start building</div>
                    <div style="font-size: 13px; color: ${emailTheme.textMuted}; line-height: 1.5;">Once you approve the proposal, I get to work on your project</div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <!-- Schedule Meeting CTA -->
              <div style="margin-bottom: 32px; padding: 24px; background: linear-gradient(135deg, ${emailTheme.primaryLight} 0%, #dbeafe 100%); border-radius: 8px; border: 1px solid ${emailTheme.primary};">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: ${emailTheme.textPrimary};">Want to talk now?</h3>
                <p style="margin: 0 0 16px 0; color: ${emailTheme.textSecondary}; font-size: 14px; line-height: 1.6;">
                  If you'd like a quick 15-30 minute meeting to discuss your project, pick a time that works for you. The scheduler will ask how you prefer to meet (video call or phone).
                </p>
                <a href="${buildPrefilledSchedulingUrl(name, email, subject)}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; background: ${emailTheme.primary}; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  Schedule a Meeting
                </a>
                <p style="margin: 12px 0 0 0; color: ${emailTheme.textMuted}; font-size: 13px;">
                  Prefer a phone call? Just reply to this email with your number and best time.
                </p>
              </div>

              <!-- While You Wait -->
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: ${emailTheme.textPrimary};">While You Wait</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                  <a href="${siteConfig.url}/projects" style="padding: 16px; background: ${emailTheme.backgroundAlt}; border-radius: 8px; text-decoration: none; text-align: center; border: 1px solid ${emailTheme.border};">
                    <div style="font-size: 13px; font-weight: 600; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">Projects</div>
                    <div style="font-size: 12px; color: ${emailTheme.textMuted};">View my work</div>
                  </a>
                  <a href="${siteConfig.url}/about" style="padding: 16px; background: ${emailTheme.backgroundAlt}; border-radius: 8px; text-decoration: none; text-align: center; border: 1px solid ${emailTheme.border};">
                    <div style="font-size: 13px; font-weight: 600; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">About</div>
                    <div style="font-size: 12px; color: ${emailTheme.textMuted};">Learn about me</div>
                  </a>
                  <a href="${socialLinks.linkedin}" target="_blank" style="padding: 16px; background: ${emailTheme.backgroundAlt}; border-radius: 8px; text-decoration: none; text-align: center; border: 1px solid ${emailTheme.border};">
                    <div style="font-size: 13px; font-weight: 600; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">LinkedIn</div>
                    <div style="font-size: 12px; color: ${emailTheme.textMuted};">Connect</div>
                  </a>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="background: ${emailTheme.backgroundDark}; padding: 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: ${emailTheme.textLight}; font-size: 13px;">Best regards,</p>
              <p style="margin: 0; color: white; font-size: 18px; font-weight: 600;">${personalInfo.name.full}</p>
              <p style="margin: 12px 0 0 0; font-size: 12px;">
                <a href="mailto:${personalInfo.email}" style="color: ${emailTheme.primary}; text-decoration: none;">${personalInfo.email}</a>
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    };

    // Send emails asynchronously (fire and forget) to speed up response time
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
