import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { personalInfo, socialLinks, contactConfig, emailConfig, appConfig } from '@/config';
import {
  generateNotificationEmail,
  generateAutoReplyEmail,
  isSimpleClientRequest
} from './emailTemplates';
import { validateContactForm, hasValidationErrors, VALIDATION_RULES } from '@/lib/validation';

// Initialize Resend for notification emails
const resend = new Resend(emailConfig.apiKey);

// Initialize Gmail SMTP transporter for auto-reply emails
const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: emailConfig.gmail.user,
    pass: emailConfig.gmail.password,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 30000,
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

    // Verify reCAPTCHA with Google (with retry and timeout)
    let recaptchaData;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const recaptchaResponse = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      recaptchaData = await recaptchaResponse.json();
    } catch (fetchError) {
      console.error('reCAPTCHA verification network error:', fetchError);

      // In development, allow bypassing reCAPTCHA if network fails
      if (appConfig.isDevelopment) {
        console.warn('⚠️ Development mode: Bypassing reCAPTCHA due to network error');
        recaptchaData = { success: true, score: 0.9 };
      } else {
        return NextResponse.json(
          {
            error: 'Unable to verify security. Please check your internet connection and try again.',
            code: 'RECAPTCHA_NETWORK_ERROR'
          },
          { status: 503 }
        );
      }
    }

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

    // Validate all fields using shared validation module
    const validationErrors = validateContactForm({ name, email, subject, category, message });

    if (hasValidationErrors(validationErrors)) {
      const firstError = Object.values(validationErrors).find(err => err);
      return NextResponse.json(
        {
          error: firstError || 'Validation failed.',
          code: 'VALIDATION_ERROR',
          errors: validationErrors
        },
        { status: 400 }
      );
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

    // Generate notification email to devhubmailer about new lead
    const devhubNotificationEmail = {
      from: 'onboarding@resend.dev',
      to: emailConfig.to.devhub, // devhubmailer@gmail.com
      subject: urgencyScore === 'HIGH' ? `[URGENT] New Project Inquiry - ${name}` : `New Project Inquiry - ${name}`,
      html: generateNotificationEmail({
        name,
        email,
        subject,
        message,
        category,
        timestamp,
        messageWordCount,
        urgencyScore: urgencyScore as 'HIGH' | 'NORMAL',
      }).html,
    };

    // Generate auto-reply email from devhubmailer to client
    const isSimpleClient = isSimpleClientRequest(category, message);
    const autoReplyEmailGmail = generateAutoReplyEmail({
      name,
      email,
      subject,
      message,
      category,
      isSimpleClient,
    });

    // Send emails asynchronously (fire and forget) to speed up response time
    // Send response immediately without waiting for email delivery
    const response = NextResponse.json({
      success: true,
      message: 'Your message has been received! I\'ll get back to you soon.',
      data: {
        timestamp: new Date().toISOString(),
      }
    });

    // Send 2 emails and wait for them to complete
    await Promise.allSettled([
      resend.emails.send(devhubNotificationEmail),    // To devhubmailer (new lead notification)
      gmailTransporter.sendMail(autoReplyEmailGmail).catch(async (gmailError) => {
        // Gmail failed, immediately try Resend fallback
        console.error('⚠️ Gmail SMTP failed, using Resend fallback:', gmailError.message);

        const autoReplyViaResend = {
          from: 'onboarding@resend.dev',
          replyTo: emailConfig.gmail.user, // Reply goes to devhubmailer
          to: email,
          subject: autoReplyEmailGmail.subject,
          html: autoReplyEmailGmail.html,
        };

        return await resend.emails.send(autoReplyViaResend);
      }),
    ]).then(async ([devhubResult, autoReplyResult]) => {
      // Log results for monitoring
      if (devhubResult.status === 'rejected') {
        console.error('❌ Devhub notification email failed:', devhubResult.reason);
      } else {
        console.log('✅ Devhub notification email sent to devhubmailer@gmail.com');
      }

      // Log auto-reply result
      if (autoReplyResult.status === 'rejected') {
        console.error('❌ Auto-reply email failed completely:', autoReplyResult.reason);
      } else {
        console.log('✅ Auto-reply email sent to client');
      }
    }).catch(err => {
      console.error('❌ Email sending error:', err);
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
