import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { personalInfo, socialLinks, contactConfig, siteConfig, emailConfig, appConfig } from '@/config';

// Initialize Resend
const resend = new Resend(emailConfig.apiKey);

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
function detectSpam(name: string, email: string, subject: string, category: string, message: string): { isSpam: boolean; reason: string } {
    const combinedText = `${name} ${email} ${subject} ${category} ${message}`.toLowerCase();

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
        if (combinedText.includes(keyword.toLowerCase())) {
            return { isSpam: true, reason: `Contains spam keyword: ${keyword}` };
        }
    }

    // Check for suspicious patterns
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(combinedText)) {
            return { isSpam: true, reason: 'Contains suspicious code patterns' };
        }
    }

    // Check for excessive repeated characters
    if (/(.)\1{10,}/.test(combinedText)) {
        return { isSpam: true, reason: 'Excessive repeated characters' };
    }

    // Check for excessive URLs
    const urlMatches = combinedText.match(/https?:\/\/[^\s]+/g) || [];
    if (urlMatches.length > 3) {
        return { isSpam: true, reason: 'Too many URLs' };
    }

    // Check for suspicious email domains
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain && contactConfig.suspiciousEmailDomains.includes(emailDomain as any)) {
        return { isSpam: true, reason: 'Suspicious email domain' };
    }

    // Check if the message is mostly uppercase
    const uppercaseRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (message.length > 20 && uppercaseRatio > 0.8) {
        return { isSpam: true, reason: 'Excessive use of uppercase letters' };
    }

    return { isSpam: false, reason: '' };
}

// Calculate urgency score based on content and keywords
function calculateUrgencyScore(name: string, email: string, subject: string, category: string, message: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'emergency', 'deadline', 'today', 'tomorrow'];
    const combinedText = `${subject} ${message}`.toLowerCase();

    let score = 0;

    // Check for urgent keywords
    urgentKeywords.forEach(keyword => {
        if (combinedText.includes(keyword)) {
            score += 2;
        }
    });

    // Business or high-value categories
    if (['ecommerce', 'api-development', 'consultation'].includes(category)) {
        score += 1;
    }

    // Email from business domains
    const businessDomains = ['.com', '.org', '.net', '.biz'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain && businessDomains.some(domain => emailDomain.endsWith(domain))) {
        score += 1;
    }

    // Message length (longer messages often indicate serious inquiries)
    if (message.length > 200) {
        score += 1;
    }

    if (score >= 4) return 'HIGH';
    if (score >= 2) return 'MEDIUM';
    return 'LOW';
}

export async function POST(request: NextRequest) {
    try {
        const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Rate limiting
        if (!rateLimit(clientIp)) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please wait 15 minutes before sending another message.',
                    code: 'RATE_LIMIT_EXCEEDED'
                },
                { status: 429 });
        }

        const body = await request.json();
        let { name, email, subject, category, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !category || !message) {
            return NextResponse.json(
                {
                    error: 'Required fields are missing. Please complete all required fields.',
                    code: 'MISSING_FIELDS'
                },
                { status: 400 });
        }

        // Sanitize inputs
        name = sanitizeInput(name);
        email = sanitizeInput(email);
        subject = sanitizeInput(subject);
        category = sanitizeInput(category);
        message = sanitizeInput(message);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    error: 'Please enter a valid email address.',
                    code: 'INVALID_EMAIL'
                },
                { status: 400 });
        }

        // Enhanced spam detection
        const spamDetectionResult = detectSpam(name, email, subject, category, message);

        if (spamDetectionResult.isSpam) {
            return NextResponse.json(
                {
                    error: 'Your message was flagged by our security filters. Please ensure your message is professional and doesn\'t contain spam-like content.',
                    code: 'SPAM_DETECTED',
                    reason: spamDetectionResult.reason
                },
                { status: 400 });
        }

        // Calculate urgency and additional metrics
        const urgencyScore = calculateUrgencyScore(name, email, subject, category, message);
        const messageWordCount = message.split(/\s+/).length;

        // Get additional request info  
        const referer = request.headers.get('referer') || 'Direct visit';

        // Email to you (notification) - Enhanced
        const notificationEmailResponse = await resend.emails.send({
            from: emailConfig.fromEmail,
            to: emailConfig.toEmail,
            subject: `${urgencyScore === 'HIGH' ? '🚨 URGENT' : '🚀'} New Portfolio Contact: ${name} - ${subject}`,
            html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 700px; margin: 0 auto; background: #f8fafc; padding: 30px; border-radius: 16px;">
            <div style="position: relative; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; overflow: hidden;">
              ${urgencyScore === 'HIGH' ? '<div style="position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">🚨 URGENT</div>' : ''}
              
              <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">New Portfolio Contact</h1>
              <p style="margin: 0; opacity: 0.9; font-size: 16px;">You have received a new message from your portfolio website.</p>
              
              <div style="margin-top: 20px;">
                <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry&body=Hi%20${name},%0D%0A%0D%0AThank%20you%20for%20reaching%20out!"
                   style="display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; backdrop-filter: blur(10px);">
                   📧 Quick Reply
                </a>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px;">
              <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Word Count</div>
                <div style="font-size: 20px; font-weight: bold; color: #0ea5e9;">${messageWordCount}</div>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Priority</div>
                <div style="font-size: 20px; font-weight: bold; color: ${urgencyScore === 'HIGH' ? '#ef4444' : '#22c55e'};">${urgencyScore}</div>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Characters</div>
                <div style="font-size: 20px; font-weight: bold; color: #8b5cf6;">${message.length}</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
              <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Contact Name</strong>
                <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${name}</p>
              </div>
              
              <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</strong>
                <p style="margin: 5px 0 0 0;">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
                </p>
              </div>

              <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</strong>
                <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${subject}</p>
              </div>

              <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Project Category</strong>
                <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</p>
              </div>
            </div>

            <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; display: block;">Message Content</strong>
              <div style="color: #374151; font-size: 16px; line-height: 1.6; background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry&body=Hi%20${name},%0D%0A%0D%0AThank%20you%20for%20reaching%20out!%20I%20received%20your%20message%20and%20I'm%20excited%20to%20discuss%20your%20${category.replace('-', ' ')}%20project.%0D%0A%0D%0ALet's%20schedule%20a%20call%20to%20go%20over%20the%20details.%0D%0A%0D%0ABest%20regards,%0D%0A${personalInfo.name.full}"
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                 Reply to ${name}
              </a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                  <strong>Received:</strong><br>
                  ${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            })}
                </div>
                <div>
                  <strong>Client IP:</strong><br>
                  ${clientIp}
                </div>
                <div>
                  <strong>Source:</strong><br>
                  ${referer}
                </div>
              </div>
            </div>
          </div>
        `
        });

        // Auto-response email to sender
        const autoResponseEmail = await resend.emails.send({
            from: emailConfig.fromEmail,
            to: email,
            subject: `Thank you for contacting ${personalInfo.name.full} - Message Received`,
            html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">Message Received!</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Thank you for reaching out. I'll get back to you soon!</p>
          </div>

          <div style="padding: 40px 30px;">
            <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                <strong>Hi ${name},</strong>
              </p>
              <p style="margin: 0 0 15px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in my ${category.replace('-', ' ')} services! I've received your message about "<strong>${subject}</strong>" and I'm excited to learn more about your project.
              </p>
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                I typically respond to inquiries within ${contactConfig.responseTime}. I'll review your requirements and get back to you with some initial thoughts and questions.
              </p>
            </div>

            <div style="background: #eef2ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px 0; color: #4338ca; font-size: 18px;">Your Message Summary:</h3>
              <div style="display: grid; gap: 10px;">
                <div><strong style="color: #6b7280;">Category:</strong> <span style="color: #374151;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</span></div>
                <div><strong style="color: #6b7280;">Subject:</strong> <span style="color: #374151;">${subject}</span></div>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px;">Need to discuss something urgent?</p>
              <a href="${socialLinks.whatsapp}" 
                 style="display: inline-block; background: #25d366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600; margin-right: 10px;">
                 💬 WhatsApp
              </a>
              <a href="mailto:${personalInfo.email}" 
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600;">
                 📧 Email
              </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px 0;">
                This is an automated confirmation. Please don't reply to this email.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} ${personalInfo.name.full}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
        });

        let isAttachmentError = false;

        // Check if there were any errors
        if (notificationEmailResponse.error || autoResponseEmail.error) {
            console.error('Email sending errors:', {
                notification: notificationEmailResponse.error,
                autoResponse: autoResponseEmail.error
            });

            return NextResponse.json(
                {
                    error: 'Failed to send email notification. Please try again or contact me directly.',
                    code: 'EMAIL_SEND_FAILED'
                },
                { status: 500 });
        }

        // Success response
        const responseData: any = {
            success: true,
            message: 'Your message has been sent successfully! Thank you for reaching out.',
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error('Contact form error:', error);

        return NextResponse.json(
            {
                error: 'An unexpected error occurred. Please try again later or contact me directly.',
                code: 'INTERNAL_ERROR'
            },
            { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(
        {
            message: 'Contact API is running',
            timestamp: new Date().toISOString(),
            endpoints: {
                POST: 'Submit contact form',
            },
            rateLimit: {
                limit: 5,
                window: '15 minutes'
            }
        },
        { status: 200 }
    );
}
