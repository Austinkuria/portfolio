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
function detectSpam(name: string, email: string, subject: string, category: string, message: string, phone?: string, preferredContactMethod?: string, budgetRange?: string): { isSpam: boolean; reason: string } {
  const combinedText = `${name} ${email} ${subject} ${category} ${message} ${phone || ''} ${preferredContactMethod || ''} ${budgetRange || ''}`.toLowerCase();

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
    fromEmail: emailConfig.from.default,
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
    let { name, email, subject, category, message, phone, preferredContactMethod, budgetRange } = body;

    // Validate required fields
    if (!name || !email || !subject || !category || !message || !phone || !preferredContactMethod || !budgetRange) {
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
    phone = sanitizeInput(phone);
    preferredContactMethod = sanitizeInput(preferredContactMethod);
    budgetRange = sanitizeInput(budgetRange);

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
    const spamDetectionResult = detectSpam(name, email, subject, category, message, phone, preferredContactMethod, budgetRange);
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
      from: emailConfig.from.default,
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
                  
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${body.phone || 'Not provided'}</p>
                </div>
                  
                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Preferred Contact Method</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${body.preferredContactMethod ? body.preferredContactMethod.charAt(0).toUpperCase() + body.preferredContactMethod.slice(1) : 'Not specified'}</p>
                </div>

                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${subject}</p>
                </div>

                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Project Category</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</p>
                </div>
                  
                  <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Budget Range</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                    ${(() => {
          switch (body.budgetRange) {
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
    };        // Enhanced auto-reply email to the sender
    const autoReplyEmail = {
      from: emailConfig.from.default,
      to: email,
      subject: `✨ Thanks for reaching out, ${name}! - ${personalInfo.name.full}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
            <h1 style="margin: 0; font-size: 32px; color: white; font-weight: 700; position: relative; z-index: 1;">👋 Hello ${name}!</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; color: rgba(255,255,255,0.95); font-weight: 400; position: relative, z-index: 1;">Thank you for reaching out!</p>
          </div>
          
          <div style="padding: 40px 30px; background: #f8fafc;">
            <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                  <span style="font-size: 24px;">✅</span>
                </div>
                <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 600;">Message Received Successfully!</h2>
              </div>
              
              <!-- Personalized Response Time -->
              <div style="background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #f97316; margin: 25px 0; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px;">⏰ Expected Response Time</h3>
                <p style="margin: 0; color: #374151; font-size: 16px;">
                  ${urgencyScore === 'HIGH' ?
          '<strong style="color: #ef4444;">Within 12 hours</strong> - I understand this is urgent!' :
          '<strong style="color: #22c55e;">24-48 hours</strong> - I\'ll craft a thoughtful response'
        }
                </p>
              </div>
              
              <p style="color: #475569; line-height: 1.7; margin: 0 0 25px 0; font-size: 16px; text-align: center;">
                I've received your message and I'm excited to learn more about your project! I'll review your inquiry carefully and get back to you soon.
              </p>
              
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                  <span style="background: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">📋</span>
                  Your Message Summary
                </h3>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>From:</strong> ${name}</p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Project Category:</strong> ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Budget Range:</strong> 
                    ${(() => {
          switch (body.budgetRange) {
            case 'under-500': return 'Under Ksh 15,000';
            case '500-1000': return 'Ksh 15,000 - Ksh 30,000';
            case '1000-2500': return 'Ksh 30,000 - Ksh 60,000';
            case '2500-5000': return 'Ksh 60,000 - Ksh 100,000';
            case 'over-5000': return 'Over Ksh 100,000';
            default: return 'Not specified';
          }
        })()}
                  </p>
                  ${body.fileData ? `<p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>File:</strong> <span style="color: #4f46e5;">${body.fileName}</span></p>` : ''}
                  <p style="margin: 15px 0 0 0; color: #374151; font-style: italic; line-height: 1.5;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
                </div>
              </div>
              
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                  <span style="background: #f59e0b; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">❓</span>
                  Quick Answers While You Wait
                </h3>
                <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #1e293b;">💰 Project Budget:</strong>
                    <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">I work with budgets ranging from Ksh 15,000 to Ksh 150,000+ depending on project scope.</p>
                  </div>
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #1e293b;">⏱️ Timeline:</strong>
                    <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">Most projects take 2-8 weeks from start to completion.</p>
                  </div>
                  <div style="margin-bottom: 0;">
                    <strong style="color: #1e293b;">🔧 Technologies:</strong>
                    <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">React, Next.js, TypeScript, Node.js, PostgreSQL, AWS, and more.</p>
                  </div>
                </div>
              </div>
                
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #22c55e;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                  <span style="background: #22c55e; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">⚡</span>
                  What Happens Next?
                </h3>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center;">
                    <span style="color: #22c55e; margin-right: 10px; font-size: 18px;">1️⃣</span>
                    <span style="color: #374151;">I'll review your message and research your project needs</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="color: #22c55e; margin-right: 10px; font-size: 18px;">2️⃣</span>
                    <span style="color: #374151;">Personalized response with initial thoughts and questions</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="color: #22c55e; margin-right: 10px; font-size: 18px;">3️⃣</span>
                    <span style="color: #374151;">Schedule a discovery call to discuss details</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="color: #22c55e; margin-right: 10px; font-size: 18px;">4️⃣</span>
                    <span style="color: #374151;">Create a detailed proposal with timeline and pricing</span>
                  </div>
                </div>
              </div>
              
              <div style="background: linear-gradient(135deg, #f3e8ff 0%, #ddd6fe 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                  <span style="background: #8b5cf6; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">🌟</span>
                  Recent Success Story
                </h3>
                <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                  <p style="margin: 0; color: #374151; font-style: italic; line-height: 1.6;">
                    "Austin delivered an exceptional e-commerce platform that increased our online sales by 300%. His attention to detail and technical expertise made all the difference."
                  </p>
                  <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px; text-align: right;">
                    <strong>— Recent Client</strong>
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin: 30px 0 20px 0;">
                <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px;">In the meantime, feel free to explore my work or connect:</p>
                <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;">
                  <a href="${siteConfig.url}/projects" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 14px; margin: 5px;">🚀 My Projects</a>
                  <a href="${siteConfig.url}/skills" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 14px; margin: 5px;">💻 My Skills</a>
                  <a href="${siteConfig.url}/about" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 14px; margin: 5px;">👨‍💻 About Me</a>
                </div>
                
                <!-- Alternative Contact Methods -->
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                  <h4 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">📞 Other Ways to Reach Me</h4>
                  <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                    <a href="${socialLinks.linkedin}" target="_blank" style="color: #0077b5; text-decoration: none; font-weight: 500;">💼 LinkedIn</a>
                    <a href="${socialLinks.calendly}" target="_blank" style="color: #22c55e; text-decoration: none; font-weight: 500;">📅 Schedule Call</a>
                    <a href="${socialLinks.github}" target="_blank" style="color: #1f2937; text-decoration: none; font-weight: 500;">💻 GitHub</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #1e293b; padding: 30px 20px; text-align: center;">
            <p style="margin: 0 0 15px 0; color: white; font-size: 18px; font-weight: 600;">Best regards,</p>
            <p style="margin: 0 0 20px 0; color: #667eea; font-size: 24px; font-weight: 700;">${personalInfo.name.full}</p>
            <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; font-style: italic;">Full-Stack Developer & Digital Solutions Expert</p>
            <div style="border-top: 1px solid #374151; padding-top: 20px; margin-top: 20px;">
              <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                📧 <a href="mailto:${personalInfo.email}" style="color: #667eea; text-decoration: none;">${personalInfo.email}</a><br>
                🔗 <a href="${socialLinks.linkedin}" style="color: #667eea; text-decoration: none;">LinkedIn</a> | 
                🌐 <a href="${siteConfig.url}" style="color: #667eea; text-decoration: none;">Portfolio</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #64748b; font-size: 12px;">
                This is an automated response. Please don't reply to this email - I'll respond personally soon!
              </p>
            </div>
          </div>
        </div>
      `,
    };        // Send both emails with improved error handling
    try {
      const [notificationResult, autoReplyResult] = await Promise.allSettled([
        resend.emails.send(notificationEmail),
        resend.emails.send(autoReplyEmail),
      ]);      // Check if notification email failed
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

      // Check if auto-reply failed (less critical)
      if (autoReplyResult.status === 'rejected') {
        console.error('Auto-reply email failed:', autoReplyResult.reason);        // Still return success since notification was sent
      }

      // Build response data
      const responseData: {
        success: boolean;
        message: string;
        data: {
          notificationId: string | null;
          autoReplyId: string | null;
          timestamp: string;
          fileAttached?: boolean;
          attachmentIssue?: boolean;
        }
      } = {
        success: true,
        message: 'Message sent successfully! You should receive a confirmation email shortly.',
        data: {
          notificationId: notificationResult.status === 'fulfilled' ? (notificationResult.value.data?.id || null) : null,
          autoReplyId: autoReplyResult.status === 'fulfilled' ? (autoReplyResult.value.data?.id || null) : null,
          timestamp: new Date().toISOString(),
        }
      };

      // Add attachment status if there was an attachment
      if (body.fileData && body.fileName) {
        responseData.data.fileAttached = true;

        // If there was any issue with attachment processing, note it
        if (notificationResult.status === 'fulfilled' && !notificationResult.value.data?.id) {
          responseData.data.attachmentIssue = true;
        }
      }

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
