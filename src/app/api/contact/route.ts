import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

// Comprehensive spam detection system with enhanced malicious code injection detection
function detectSpam(name: string, email: string, subject: string, category: string, message: string): { isSpam: boolean; reason: string } {
  const combinedText = `${name} ${email} ${subject} ${category} ${message}`.toLowerCase();

  // 1. Enhanced spam keywords (more comprehensive)
  const spamKeywords = [
    // Financial scams
    'viagra', 'casino', 'lottery', 'winner!', 'congratulations!', 'free money',
    'nigerian prince', 'inheritance', 'bitcoin investment', 'crypto investment',
    'get rich quick', 'make money fast', 'investment opportunity', 'roi guarantee',
    'million dollars', 'unclaimed funds', 'beneficiary', 'transfer funds',
    'forex trading', 'binary options', 'cryptocurrency', 'tax refund',
    'loan approved', 'credit repair', 'debt consolidation', 'prize winner',

    // Phishing attempts
    'verify account', 'click here now', 'update payment', 'suspended account',
    'confirm identity', 'urgent action required', 'limited time offer',
    'act now', 'expires today', 'claim now', 'download attachment',
    'security alert', 'account compromised', 'unusual activity', 'verify now',

    // Adult content
    'adult content', 'xxx', 'porn', 'escort', 'dating site', 'hookup',
    'cam girl', 'adult webcam', 'sexy photos', 'nude pics',

    // SEO/Marketing spam
    'seo services', 'increase traffic', 'boost ranking', 'google ranking',
    'backlinks', 'website promotion', 'guaranteed results', 'top position',
    'cheap seo', 'rank higher', 'organic traffic', 'link building',

    // Pharmacy/Health spam
    'prescription drugs', 'pharmacy online', 'weight loss pills', 'male enhancement',
    'cheap medication', 'no prescription needed', 'generic drugs'
  ];    // 2. Enhanced suspicious patterns with comprehensive code injection detection
  const suspiciousPatterns = [
    // XSS and Script injection attempts
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /<applet[^>]*>/gi,
    /<meta[^>]*>/gi,
    /<link[^>]*>/gi,
    /<form[^>]*>/gi,
    /<input[^>]*>/gi,
    /<textarea[^>]*>/gi,
    /<select[^>]*>/gi,
    /<button[^>]*>/gi,
    /<svg[^>]*>/gi,
    /<style[^>]*>/gi,

    // JavaScript protocol and event handlers
    /javascript\s*:/gi,
    /vbscript\s*:/gi,
    /data\s*:/gi,
    /on\w+\s*=/gi, // onload, onclick, onerror, etc.
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /document\.(write|cookie|location)/gi,
    /window\.(location|open)/gi,
    /alert\s*\(/gi,
    /confirm\s*\(/gi,
    /prompt\s*\(/gi,

    // JSON/JavaScript code injection
    /(?:function\s*\([^)]*\)|=>\s*{|var\s+\w+\s*=|let\s+\w+\s*=|const\s+\w+\s*=)/gi,
    /(?:require\s*\(|import\s+.*from|export\s+.*)/gi,
    /(?:JSON\.parse|JSON\.stringify|btoa|atob)\s*\(/gi,
    /(?:localStorage|sessionStorage|indexedDB)\./gi,
    /(?:fetch\s*\(|XMLHttpRequest|WebSocket)/gi,
    // SQL injection patterns
    /union\s+select/gi,
    /drop\s+table/gi,
    /delete\s+from/gi,
    /insert\s+into/gi,
    /update\s+set/gi,
    /exec\s*\(/gi,
    /execute\s*\(/gi,
    /sp_\w+/gi,
    /xp_\w+/gi,
    /'\s*or\s*'1'\s*=\s*'1/gi,
    /'\s*or\s*1\s*=\s*1/gi,
    /--\s*$/gm,
    /\/\*[\s\S]*?\*\//g,

    // NoSQL injection patterns
    /\$where/gi,
    /\$ne/gi,
    /\$gt/gi,
    /\$lt/gi,
    /\$regex/gi,
    /\$or/gi,
    /\$and/gi,

    // Command injection patterns
    /;\s*(cat|ls|pwd|whoami|id|uname)/gi,
    /\|\s*(cat|ls|pwd|whoami|id|uname)/gi,
    /&&\s*(cat|ls|pwd|whoami|id|uname)/gi,
    /`[^`]*`/g, // Backticks for command execution
    /\$\([^)]*\)/g, // Command substitution

    // Path traversal attempts
    /\.\.\//g,
    /\.\.\\{1,2}/g,
    /%2e%2e%2f/gi,
    /%2e%2e\\{1,2}/gi,

    // Template injection patterns
    /\{\{[^}]*\}\}/g,
    /\{%[^%]*%\}/g,
    /\${[^}]*}/g,
    /#\{[^}]*\}/g,

    // LDAP injection
    /\(\|\(/gi,
    /\)&\(/gi,
    /\*\)\(/gi,

    // XML/XXE injection
    /<!ENTITY/gi,
    /<!DOCTYPE/gi,
    /SYSTEM\s+"/gi,

    // Advanced malicious patterns
    /\{[^}]*"[^"]*"\s*:\s*"[^"]*"[^}]*\}/gi, // JSON injection attempts
    /\{\{.*?\}\}/g, // Server-Side Template Injection (SSTI)
    /\{%.*?%\}/g,   // Template engine syntax
    /#\{.*?\}/g,    // Ruby/Java template injection

    // CSRF attempts
    /<form[^>]*action\s*=/gi,
    /<input[^>]*type\s*=\s*"hidden"/gi,

    // File inclusion attempts
    /include\s*\(/gi,
    /require\s*\(/gi,
    /file_get_contents\s*\(/gi,
    /readfile\s*\(/gi,
    /fopen\s*\(/gi,

    // Additional dangerous patterns
    // URL shorteners and suspicious domains
    /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|short\.link|rb\.gy|cutt\.ly/gi,    // Excessive special characters (potential obfuscation)
    /[!@#$%^&*()_+=[\]{}|;':",./<>?`~]{10,}/g,    // Base64 encoded content (potential payload)
    /[A-Za-z0-9+/]{50,}={0,2}/g,// Hex encoded content
    /(?:\\x[0-9a-fA-F]{2}){10,}/g,
    /(?:%[0-9a-fA-F]{2}){10,}/g,

    // Unicode escapes (potential bypass attempts)
    /(?:\\u[0-9a-fA-F]{4}){5,}/g,

    // Multiple emails in content (spam indicator)
    /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}){3,}/g,    // Excessive whitespace or control characters
    /\s{50,}/g,
    // Control characters (avoiding problematic chars in regex)

    // Programming language patterns (potential code injection)
    /(?:function|var|let|const|class|import|export|require)\s*\(/gi,
    /(?:print|echo|console\.log|System\.out)\s*\(/gi,
    /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b\s*/gi, // FIXED: Only match SQL keywords as whole words
    // Serialized objects
    /O:\d+:"[^"]*":\d+:\{/g, // PHP serialized objects
    /rO0[A-Za-z0-9+/]+=*/g, // Java serialized objects

    // Executable file extensions
    /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|app|deb|pkg|dmg)(?:\s|$)/gi,

    // Cryptocurrency addresses (scam indicator)
    /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/g, // Bitcoin
    /0x[a-fA-F0-9]{40}/g, // Ethereum

    // Additional advanced patterns
    // Python code injection
    /(?:import\s+|from\s+\w+\s+import|__import__|exec\s*\(|eval\s*\()/gi,

    // PHP code injection
    /(?:<\?php|<\?=|\$_GET|\$_POST|\$_REQUEST|\$_SESSION|\$_COOKIE)/gi,

    // Ruby code injection
    /(?:require\s+['"]|load\s+['"]|eval\s*\(|system\s*\(|`.*`)/gi,

    // Java code injection
    /(?:Runtime\.getRuntime|ProcessBuilder|Class\.forName)/gi,

    // C# code injection
    /(?:Process\.Start|Assembly\.Load|Type\.GetType)/gi,

    // PowerShell injection
    /(?:Invoke-Expression|IEX|powershell|cmd\.exe)/gi,

    // Linux/Unix commands
    /(?:rm\s+-rf|sudo\s+|chmod\s+|chown\s+|passwd\s+)/gi,

    // Network reconnaissance
    /(?:nmap\s+|netstat\s+|ss\s+|lsof\s+|tcpdump)/gi,

    // Data exfiltration patterns
    /(?:curl\s+.*\|.*sh|wget\s+.*\|.*sh|nc\s+-|netcat)/gi,

    // Malicious URLs and domains
    /(?:\.tk\b|\.ml\b|\.ga\b|\.cf\b|onion\b)/gi,

    // Social engineering keywords
    /(?:verify\s+your\s+account|suspended\s+account|click\s+here\s+immediately)/gi,

    // Cryptocurrency mining
    /(?:monero|mining\s+pool|hashrate|blockchain\s+wallet)/gi,

    // Ransomware indicators
    /(?:encrypt|decrypt|bitcoin\s+payment|ransom|restore\s+files)/gi
  ];

  // 3. Check for spam keywords
  for (const keyword of spamKeywords) {
    if (combinedText.includes(keyword)) {
      return { isSpam: true, reason: `Spam keyword detected: ${keyword}` };
    }
  }

  // 4. Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combinedText)) {
      return { isSpam: true, reason: `Suspicious pattern detected: ${pattern.source}` };
    }
  }

  // 5. Check for excessive repetition
  const words = message.split(/\s+/);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const repetitionRatio = uniqueWords.size / wordCount;

  if (wordCount > 10 && repetitionRatio < 0.3) {
    return { isSpam: true, reason: 'Excessive word repetition detected' };
  }

  // 6. Check for excessive capitalization
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  if (message.length > 20 && capsRatio > 0.7) {
    return { isSpam: true, reason: 'Excessive capitalization detected' };
  }

  // 7. Check for excessive URLs
  const urlMatches = message.match(/https?:\/\/[^\s]+/g) || [];
  if (urlMatches.length > 3) {
    return { isSpam: true, reason: 'Too many URLs detected' };
  }

  // 8. Check for suspicious email patterns in message
  const emailMatches = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
  if (emailMatches.length > 2) {
    return { isSpam: true, reason: 'Multiple email addresses in message' };
  }

  // 9. Check for phone number patterns (potential telemarketing)
  const phonePatterns = [
    /\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g
  ];

  let phoneCount = 0;
  for (const pattern of phonePatterns) {
    const matches = message.match(pattern) || [];
    phoneCount += matches.length;
  }

  if (phoneCount > 2) {
    return { isSpam: true, reason: 'Multiple phone numbers detected' };
  }

  // 10. Check for common scam phrases
  const scamPhrases = [
    'act now', 'limited time', 'expires soon', 'dont delay', 'order now',
    'what are you waiting for', 'call now', 'click below', 'click here',
    'get started now', 'increase sales', 'increase traffic', 'one time',
    'only $', 'order today', 'send now', 'sign up free', 'take action',
    'urgent response', 'while supplies last', 'winner', 'you have been selected',
    'dear friend', 'congratulations', 'you won', 'claim your', 'free trial'
  ];

  for (const phrase of scamPhrases) {
    if (combinedText.includes(phrase)) {
      return { isSpam: true, reason: `Scam phrase detected: ${phrase}` };
    }
  }

  // 11. Check name field for suspicious content
  if (name.length < 2 || name.length > 50) {
    return { isSpam: true, reason: 'Suspicious name length' };
  }
  // Check if name contains numbers or special characters (suspicious)
  if (/[0-9!@#$%^&*()_+=[\]{}|;':",./<>?`~]/.test(name)) {
    return { isSpam: true, reason: 'Name contains suspicious characters' };
  }

  // 12. Check email domain against known spam domains
  const emailDomain = email.split('@')[1]?.toLowerCase();
  const suspiciousDomains = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
    'throwaway.email', 'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com'
  ];

  if (emailDomain && suspiciousDomains.includes(emailDomain)) {
    return { isSpam: true, reason: `Suspicious email domain: ${emailDomain}` };
  }

  // 13. Check for emoji spam (excessive emoji usage)
  const emojiCount = (message.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []).length;
  if (emojiCount > 10) {
    return { isSpam: true, reason: 'Excessive emoji usage detected' };
  }

  return { isSpam: false, reason: '' };
}

// Test endpoint to verify API routes are working
export async function GET() {
  return NextResponse.json({
    message: 'Contact API endpoint is active',
    timestamp: new Date().toISOString(),
    environment: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      fromEmail: process.env.FROM_EMAIL ? 'configured' : 'missing',
      toEmail: process.env.TO_EMAIL ? 'configured' : 'missing'
    }
  });
}

export async function POST(request: NextRequest) {
  // Add debugging for production
  console.log('Contact API called at:', new Date().toISOString());
  console.log('Environment check:', {
    hasResendKey: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL,
    toEmail: process.env.TO_EMAIL
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
        { status: 429 }
      );
    } const body = await request.json();
    let { name, email, subject, category, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json(
        {
          error: 'All fields (name, email, subject, category, message) are required.',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    subject = sanitizeInput(subject);
    category = sanitizeInput(category);
    message = sanitizeInput(message);
    email = sanitizeInput(email);
    subject = sanitizeInput(subject);
    message = sanitizeInput(message);

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
        { status: 400 }
      );
    }    // Enhanced spam detection system
    const spamDetectionResult = detectSpam(name, email, subject, category, message);
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
        `Hi Austin! I tried to send a message through your portfolio contact form but it was flagged by your security filters.\n\nMy email: ${email}\nReference ID: ${referenceId}\n\nCould you please help me resolve this issue? Thank you!`
      );
      const whatsappUrl = `https://wa.me/254797561978?text=${whatsappMessage}`;

      const userMessage = `Your message couldn't be sent due to our automated security filters.

If you believe this is an error, please contact me directly:

📧 Email: kuriaaustin125@gmail.com
💼 LinkedIn: https://linkedin.com/in/austin-maina

Reference ID: ${referenceId}

You can also click the WhatsApp button below to send me a quick message with your details.`;

      return NextResponse.json(
        {
          error: userMessage,
          code: 'SPAM_DETECTED',
          referenceId: referenceId,
          alternativeContact: {
            email: 'kuriaaustin125@gmail.com',
            linkedin: 'https://linkedin.com/in/austin-maina',
            whatsappUrl: whatsappUrl,
            whatsappDisplay: 'Contact via WhatsApp'
          },
          details: process.env.NODE_ENV === 'development' ? spamDetectionResult.reason : undefined
        },
        { status: 400 }
      );
    }// Enhanced email templates with better branding
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });        // Message analytics
    const messageWordCount = message.trim().split(/\s+/).length;
    const urgencyScore = message.toLowerCase().includes('urgent') || message.toLowerCase().includes('asap') || message.toLowerCase().includes('immediate') ? 'HIGH' : 'NORMAL';

    // Get additional request info  
    const referer = request.headers.get('referer') || 'Direct visit';

    // Email to you (notification) - Enhanced
    const notificationEmail = {
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.TO_EMAIL || 'kuriaaustin125@gmail.com',
      subject: `${urgencyScore === 'HIGH' ? '🚨 URGENT' : '🚀'} New Portfolio Contact: ${name} - ${subject}`, html: `
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
                <a href="https://calendly.com/austinmaina" target="_blank"
                   style="background: #22c55e; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: 500;">📅 Schedule Call</a>
                <a href="https://linkedin.com/in/austin-maina" target="_blank"
                   style="background: #0077b5; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 14px; font-weight: 500;">💼 LinkedIn</a>
              </div>
            </div>            <!-- Message Analytics -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; border-left: 5px solid #0ea5e9; margin-bottom: 25px;">              <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; display: flex; align-items: center;">
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
              </div>
            </div>
              <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; border-left: 5px solid #667eea; margin-bottom: 25px;">              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
                <span style="background: #667eea; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 15px; line-height: 1; text-align: center; vertical-align: middle;">👤</span>
                Contact Information
              </h2>
              
              <div style="display: grid; gap: 15px;">                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
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
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${subject}</p>
                </div>

                <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <strong style="color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Project Category</strong>
                  <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</p>
                </div>
              </div>
            </div>
            
            <div style="background: #fefce8; padding: 20px; border-radius: 12px; border-left: 5px solid #eab308; margin-bottom: 25px;">              <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
                <span style="background: #eab308; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">💬</span>
                Message
              </h3>
              <div style="background: white; padding: 20px; border-radius: 8px; line-height: 1.6; color: #374151; font-size: 15px; border: 1px solid #e5e7eb;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}?subject=Re:%20Your%20Portfolio%20Inquiry&body=Hi%20${name},%0D%0A%0D%0AThank%20you%20for%20reaching%20out!%20I%20received%20your%20message%20and%20I'm%20excited%20to%20discuss%20your%20project.%0D%0A%0D%0ALet's%20schedule%20a%20call%20to%20discuss%20your%20requirements%20in%20detail.%0D%0A%0D%0ABest%20regards,%0D%0AAustin%20Maina" 
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
                <span style="color: #64748b; font-size: 14px;">Austin Maina Portfolio</span>
              </div>
              <div>
                <strong style="color: #475569;">🔒 Client IP:</strong><br>
                <span style="color: #64748b; font-size: 14px;">${ip}</span>
              </div>
              <div>
                <strong style="color: #475569;">📱 Referrer:</strong><br>
                <span style="color: #64748b; font-size: 14px;">${referer.includes('austinmaina') ? 'Portfolio Website' : 'External'}</span>
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
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `✨ Thanks for reaching out, ${name}! - Austin Maina`,
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
              
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 25px 0;">                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                  <span style="background: #3b82f6; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">📋</span>
                  Your Message Summary
                </h3>                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>From:</strong> ${name}</p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 5px 0; color: #6b7280; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
                  <p style="margin: 15px 0 0 0; color: #374151; font-style: italic; line-height: 1.5;">"${message.substring(0, 150)}${message.length > 150 ? '...' : ''}"</p>
                </div>
              </div>              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #f59e0b;">                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
                  <span style="background: #f59e0b; color: white; width: 28px; height: 28px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 13px; line-height: 1; text-align: center; vertical-align: middle;">❓</span>
                  Quick Answers While You Wait
                </h3>
                <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #1e293b;">💰 Project Budget:</strong>
                    <p style="margin: 5px 0 0 0; color: #374151; font-size: 14px;">I work with budgets ranging from $2,000 to $50,000+ depending on project scope.</p>
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
                <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #22c55e;">                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
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
              </div>              <div style="background: linear-gradient(135deg, #f3e8ff 0%, #ddd6fe 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #8b5cf6;">                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; display: flex; align-items: center;">
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
                  <a href="https://austinmaina.vercel.app/projects" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 14px; margin: 5px;">🚀 My Projects</a>
                  <a href="https://austinmaina.vercel.app/skills" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 14px; margin: 5px;">💻 My Skills</a>
                  <a href="https://austinmaina.vercel.app/about" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 25px; text-decoration: none; font-weight: 500; font-size: 14px; margin: 5px;">👨‍💻 About Me</a>
                </div>
                
                <!-- Alternative Contact Methods -->
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                  <h4 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px;">📞 Other Ways to Reach Me</h4>
                  <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                    <a href="https://linkedin.com/in/austin-maina" target="_blank" style="color: #0077b5; text-decoration: none; font-weight: 500;">💼 LinkedIn</a>
                    <a href="https://calendly.com/austinmaina" target="_blank" style="color: #22c55e; text-decoration: none; font-weight: 500;">📅 Schedule Call</a>
                    <a href="https://github.com/austin-maina" target="_blank" style="color: #1f2937; text-decoration: none; font-weight: 500;">💻 GitHub</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style="background: #1e293b; padding: 30px 20px; text-align: center;">
            <p style="margin: 0 0 15px 0; color: white; font-size: 18px; font-weight: 600;">Best regards,</p>
            <p style="margin: 0 0 20px 0; color: #667eea; font-size: 24px; font-weight: 700;">Austin Maina</p>
            <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; font-style: italic;">Full-Stack Developer & Digital Solutions Expert</p>
            <div style="border-top: 1px solid #374151; padding-top: 20px; margin-top: 20px;">
              <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                📧 <a href="mailto:kuriaaustin125@gmail.com" style="color: #667eea; text-decoration: none;">kuriaaustin125@gmail.com</a><br>
                🔗 <a href="https://linkedin.com/in/austin-maina" style="color: #667eea; text-decoration: none;">LinkedIn</a> | 
                🌐 <a href="https://austinmaina.vercel.app" style="color: #667eea; text-decoration: none;">Portfolio</a>
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
      ]);

      // Check if notification email failed
      if (notificationResult.status === 'rejected') {
        console.error('Notification email failed:', notificationResult.reason);
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
        console.error('Auto-reply email failed:', autoReplyResult.reason);
        // Still return success since notification was sent
      }

      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! You should receive a confirmation email shortly.',
        data: {
          notificationId: notificationResult.status === 'fulfilled' ? notificationResult.value.data?.id : null,
          autoReplyId: autoReplyResult.status === 'fulfilled' ? autoReplyResult.value.data?.id : null,
          timestamp: new Date().toISOString(),
        }
      });

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
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}
