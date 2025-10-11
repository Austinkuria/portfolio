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

// Simple in-memory rate limiter
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
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 2000);
}

// Refined spam detection function
function detectSpam(name: string, email: string, subject: string, message: string, category?: string, phone?: string, preferredContactMethod?: string, budgetRange?: string): { isSpam: boolean; reason: string } {
  const combinedText = `${name} ${email} ${subject} ${message} ${category || ''} ${phone || ''} ${preferredContactMethod || ''} ${budgetRange || ''}`.toLowerCase();
  const spamKeywords = contactConfig.spamKeywords;
  const suspiciousPatterns = [
    /<script[^>]*>/gi,
    /javascript:/gi,
    /eval\s*\(/gi,
    /union\s+select/gi,
    /drop\s+table/gi
  ];

  for (const keyword of spamKeywords) {
    if (combinedText.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combinedText)) {
      return { isSpam: true, reason: `Suspicious pattern detected: ${pattern.source}` };
    }
  }

  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  if (message.length > 20 && capsRatio > 0.7) {
    return { isSpam: true, reason: 'Excessive capitalization detected' };
  }

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
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td>
          <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Project Details</h3>
          <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 6px;">
            <tr>
              <td style="padding: 10px;">
                <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Estimated Timeline</strong>
                <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 14px;">${info?.timeline || 'Varies by project scope'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px;">
                <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Features</strong>
                <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 14px;">${info?.features.join(', ') || 'Custom features based on your needs'}</p>
              </td>
            </tr>
            ${info?.samples ? `
            <tr>
              <td style="padding: 10px;">
                <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Sample Projects</strong>
                <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 14px;">${info.samples.join(', ')}</p>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>
  `;
}

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
  console.log('Contact API called at:', new Date().toISOString());
  console.log('Environment check:', {
    hasResendKey: !!emailConfig.apiKey,
    notificationFromEmail: emailConfig.from.notification,
    autoReplyFromEmail: emailConfig.gmail.user + ' (via Gmail SMTP)',
    hasGmailPassword: !!emailConfig.gmail.password,
    toEmail: emailConfig.to.default
  });

  try {
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait 15 minutes before sending another message.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 });
    }

    const body = await request.json();
    let { name, email, subject, category, message, phone, preferredContactMethod, budgetRange } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: 'Required fields are missing. Please complete all required fields.',
          code: 'MISSING_FIELDS'
        },
        { status: 400 });
    }

    name = sanitizeInput(name);
    email = sanitizeInput(email);
    subject = sanitizeInput(subject);
    message = sanitizeInput(message);
    category = category ? sanitizeInput(category) : '';
    phone = phone ? sanitizeInput(phone) : '';
    preferredContactMethod = preferredContactMethod ? sanitizeInput(preferredContactMethod) : '';
    budgetRange = budgetRange ? sanitizeInput(budgetRange) : '';

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

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'Please enter a valid email address.',
          code: 'INVALID_EMAIL'
        },
        { status: 400 });
    }

    const spamDetectionResult = detectSpam(name, email, subject, message, category, phone, preferredContactMethod, budgetRange);
    if (spamDetectionResult.isSpam) {
      console.log('Spam detected:', spamDetectionResult.reason);
      const referenceId = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      console.log(`Spam detection reference ${referenceId}:`, {
        name,
        email,
        message: message.substring(0, 100),
        reason: spamDetectionResult.reason,
        timestamp: new Date().toISOString(),
        ip
      });

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

Email: ${personalInfo.email}
LinkedIn: <a href='${linkedinUrl}' target='_blank' rel='noopener noreferrer'>Send a message on LinkedIn</a>

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

    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const messageWordCount = message.trim().split(/\s+/).length;
    const urgencyScore = message.toLowerCase().includes('urgent') || message.toLowerCase().includes('asap') || message.toLowerCase().includes('immediate') ? 'HIGH' : 'NORMAL';
    const referer = request.headers.get('referer') || 'Direct visit';

    let attachments = [];
    if (body.fileData && body.fileName) {
      try {
        if (body.fileData.startsWith('data:')) {
          const base64Data = body.fileData.split(',')[1];
          if (base64Data) {
            let contentType = body.fileType || 'application/octet-stream';
            const fileExt = body.fileName.split('.').pop()?.toLowerCase();
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
      from: emailConfig.from.notification,
      to: emailConfig.to.default,
      subject: `${urgencyScore === 'HIGH' ? '[URGENT]' : ''} New Portfolio Contact: ${name} - ${subject}`,
      attachments: attachments,
      html: `
        <table style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; width: 100%; border-collapse: collapse;">
          <tr>
            <td style="background: #667eea; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: white; font-weight: 600;">New Contact Form Submission</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Received from ${name}</p>
              ${urgencyScore === 'HIGH' ? '<p style="background: #ef4444; color: white; display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; margin: 8px 0 0 0;">Urgent</p>' : ''}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background: white;">
              <!-- Quick Actions -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="text-align: center;">
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Quick Actions</h3>
                    <table style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry&body=Hi%20${name},%0D%0AThank%20you%20for%20reaching%20out!" 
                             style="display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;" role="button">Reply</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.calendly}" target="_blank" rel="noopener noreferrer"
                             style="display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;" role="button">Schedule Call</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Analytics -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Message Analytics</h3>
                    <table style="width: 100%;">
                      <tr>
                        <td style="text-align: center; padding: 8px; background: white; border-radius: 6px;">
                          <div style="font-size: 18px; font-weight: 600; color: #1e293b;">${messageWordCount}</div>
                          <div style="font-size: 12px; color: #6b7280;">Words</div>
                        </td>
                        <td style="text-align: center; padding: 8px; background: white; border-radius: 6px;">
                          <div style="font-size: 18px; font-weight: 600; color: ${urgencyScore === 'HIGH' ? '#ef4444' : '#22c55e'};">${urgencyScore}</div>
                          <div style="font-size: 12px; color: #6b7280;">Priority</div>
                        </td>
                        <td style="text-align: center; padding: 8px; background: white; border-radius: 6px;">
                          <div style="font-size: 18px; font-weight: 600; color: #1e293b;">${message.length}</div>
                          <div style="font-size: 12px; color: #6b7280;">Characters</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Contact Information -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Contact Information</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Name</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Email</strong>
                          <p style="margin: 4px 0 0 0;">
                            <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
                          </p>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Phone</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${phone}</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${preferredContactMethod ? `
                      <tr>
                        <td style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Preferred Contact</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${preferredContactMethod.charAt(0).toUpperCase() + preferredContactMethod.slice(1)}</p>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Subject</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${subject}</p>
                        </td>
                      </tr>
                      ${category ? `
                      <tr>
                        <td style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Category</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</p>
                        </td>
                      </tr>
                      ` : ''}
                      ${budgetRange ? `
                      <tr>
                        <td style="padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Budget Range</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
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
                        </td>
                      </tr>
                      ` : ''}
                      ${body.fileData ? `
                      <tr>
                        <td style="padding: 10px; background: #eef2ff; border-radius: 6px; border-left: 4px solid #6366f1;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Attachment</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                            <span style="display: inline-flex; align-items: center; gap: 6px;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                              </svg>
                              ${body.fileName} (${(body.fileType || '').split('/')[1]})
                            </p>
                            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Attached to this email</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Message</h3>
                    <div style="background: white; padding: 15px; border-radius: 6px; line-height: 1.6; color: #374151; font-size: 14px;">
                      ${message.replace(/\n/g, '<br>')}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reply CTA -->
              <table style="width: 100%; text-align: center; margin: 20px 0;">
                <tr>
                  <td>
                    <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry&body=Hi%20${name},%0D%0AThank%20you%20for%20reaching%20out!%20I%20received%20your%20message%20and%20I'm%20excited%20to%20discuss%20your%20project.%0D%0ALet's%20schedule%20a%20call%20to%20discuss%20your%20requirements%20in%20detail.%0D%0ABest%20regards,%0D%0A${personalInfo.name.full}" 
                       style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;" role="button">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table style="width: 100%; background: #1e293b; padding: 15px; text-align: center; border-top: 1px solid #374151;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">
                      Received: ${timestamp} | Source: ${siteConfig.siteName} | Client IP: ${ip} | Referrer: ${referer.includes(siteConfig.domain) ? 'Portfolio Website' : 'External'}
                    </p>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      ${personalInfo.name.full} | <a href="${siteConfig.url}" style="color: #667eea; text-decoration: none;">Portfolio</a> | ${personalInfo.email}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    };

    const autoReplyEmailGmail = {
      from: `${personalInfo.name.full} <${emailConfig.gmail.user}>`,
      to: email,
      subject: `Thank You for Your Message, ${name}! - ${personalInfo.name.full}`,
      html: `
        <table style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; width: 100%; border-collapse: collapse;">
          <tr>
            <td style="background: #667eea; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: white; font-weight: 600;">Thank You, ${name}!</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your message has been received</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; background: white;">
              <!-- Confirmation -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="text-align: center;">
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Message Received</h3>
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                      I'll respond within ${urgencyScore === 'HIGH' ? '12 hours' : '24-48 hours'}.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message Summary -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Your Message Summary</h3>
                    <table style="width: 100%; background: white; padding: 10px; border-radius: 6px;">
                      <tr>
                        <td style="padding: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Subject</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 14px;">${subject}</p>
                        </td>
                      </tr>
                      ${category ? `
                      <tr>
                        <td style="padding: 8px;">
                          <strong style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Category</strong>
                          <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 14px;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</p>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0; color: #374151; font-size: 14px; font-style: italic;">
                            "${message.substring(0, 120)}${message.length > 120 ? '...' : ''}"
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${getPersonalizedProjectInfo(category)}

              <!-- Next Steps -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Next Steps</h3>
                    <table style="width: 100%;">
                      <tr>
                        <td style="padding: 8px;">
                          <strong style="color: #1e293b; font-size: 14px;">1. Initial Review</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">I'll analyze your requirements (1-2 days).</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px;">
                          <strong style="color: #1e293b; font-size: 14px;">2. Custom Proposal</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">Detailed plan with timeline & pricing (2-3 days).</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px;">
                          <strong style="color: #1e293b; font-size: 14px;">3. Discovery Call</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">Discuss details and finalize scope (30-60 mins).</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px;">
                          <strong style="color: #1e293b; font-size: 14px;">4. Project Kickoff</strong>
                          <p style="margin: 4px 0 0 0; color: #374151; font-size: 13px;">Contract signing and development begins.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Explore More -->
              <table style="width: 100%; text-align: center; margin-bottom: 20px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Explore More</h3>
                    <table style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="${siteConfig.url}/projects" style="display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;" role="button">View Projects</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${siteConfig.url}/skills" style="display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;" role="button">My Skills</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${siteConfig.url}/about" style="display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;" role="button">About Me</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Contact Options -->
              <table style="width: 100%; background: #f1f5f9; padding: 15px; border-radius: 8px;">
                <tr>
                  <td style="text-align: center;">
                    <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Need Immediate Assistance?</h3>
                    <table style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.whatsapp}" target="_blank" rel="noopener noreferrer" style="color: #1e293b; text-decoration: none; font-size: 14px; font-weight: 500;">WhatsApp</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" style="color: #1e293b; text-decoration: none; font-size: 14px; font-weight: 500;">LinkedIn</a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="${socialLinks.calendly}" target="_blank" rel="noopener noreferrer" style="color: #1e293b; text-decoration: none; font-size: 14px; font-weight: 500;">Schedule Call</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background: #1e293b; padding: 15px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">
                ${personalInfo.name.full} | Full-Stack Developer
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                <a href="${siteConfig.url}" style="color: #667eea; text-decoration: none;">Portfolio</a> | ${personalInfo.email}
              </p>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 11px;">
                This is an automated confirmation. I'll respond personally soon.
              </p>
            </td>
          </tr>
        </table>
      `,
    };

    try {
      console.log('Attempting to send emails...');
      console.log('Notification email to:', emailConfig.to.default, 'from:', emailConfig.from.notification);
      console.log('Auto-reply email to:', email, 'from:', emailConfig.gmail.user, '(via Gmail SMTP)');

      const [notificationResult, autoReplyResult] = await Promise.allSettled([
        resend.emails.send(notificationEmail),
        gmailTransporter.sendMail(autoReplyEmailGmail),
      ]);

      if (notificationResult.status === 'rejected') {
        console.error('Notification email failed:', notificationResult.reason);
        const errorMsg = notificationResult.reason?.toString() || '';
        const isAttachmentError = errorMsg.toLowerCase().includes('attachment') ||
          errorMsg.toLowerCase().includes('file') ||
          errorMsg.toLowerCase().includes('base64');

        if (isAttachmentError && body.fileData) {
          console.log('Attempting to send email without attachment due to attachment error');
          const notificationWithoutAttachment = {
            ...notificationEmail,
            attachments: [],
          };

          try {
            const retryResult = await resend.emails.send(notificationWithoutAttachment);
            if (retryResult.data?.id) {
              return NextResponse.json({
                success: true,
                message: 'Message sent successfully, but we could not include your attachment due to technical issues.',
                data: {
                  notificationId: retryResult.data.id,
                  timestamp: new Date().toISOString(),
                  attachmentIssue: true
                }
              });
            }
          } catch (retryError) {
            console.error('Retry without attachment also failed:', retryError);
          }
        }

        return NextResponse.json(
          {
            error: 'Failed to send notification email. Please try again.',
            code: 'NOTIFICATION_FAILED'
          },
          { status: 500 }
        );
      }

      if (autoReplyResult.status === 'rejected') {
        console.error('Auto-reply email (Gmail) failed:', autoReplyResult.reason);
        console.error('Auto-reply details:', {
          to: email,
          from: emailConfig.gmail.user,
          subject: autoReplyEmailGmail.subject,
          timestamp: new Date().toISOString()
        });
      } else {
        console.log('Auto-reply email sent successfully via Gmail:', autoReplyResult.value.messageId);
      }

      const responseData = {
        success: true,
        message: 'Message sent successfully! You should receive a confirmation email shortly.',
        data: {
          notificationId: notificationResult.status === 'fulfilled' ? (notificationResult.value.data?.id || null) : null,
          autoReplyId: autoReplyResult.status === 'fulfilled' ? (autoReplyResult.value.messageId || null) : null,
          timestamp: new Date().toISOString(),
          fileAttached: body.fileData && body.fileName ? true : undefined,
          attachmentIssue: notificationResult.status === 'fulfilled' && !notificationResult.value.data?.id ? true : undefined
        }
      };

      return NextResponse.json(responseData);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        {
          error: 'Failed to send emails. Please try again or contact me directly.',
          code: 'EMAIL_SERVICE_ERROR'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid request format.',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR',
        details: appConfig.isDevelopment ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}