import { personalInfo, socialLinks, siteConfig, emailConfig } from '@/config';

// Helper to build prefilled Calendly URL
export function buildPrefilledSchedulingUrl(name?: string, email?: string, subject?: string): string {
  const schedulingBase = socialLinks.calendly || '';
  if (!schedulingBase) return '#';

  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (email) params.set('email', email);
  if (subject) params.set('a1', subject); // Calendly custom answer field

  return `${schedulingBase}${schedulingBase.includes('?') ? '&' : '?'}${params.toString()}`;
}

// Portfolio color scheme for consistent email branding
export const emailTheme = {
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

// Function to determine if client needs simple or detailed email template
export function isSimpleClientRequest(category: string | undefined, message: string): boolean {
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

interface NotificationEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  timestamp: string;
  messageWordCount: number;
  urgencyScore: 'HIGH' | 'NORMAL';
}

export function generateNotificationEmail(params: NotificationEmailParams) {
  const { name, email, subject, message, category, timestamp, messageWordCount, urgencyScore } = params;

  return {
    from: emailConfig.from.notification,
    to: emailConfig.to.default,
    subject: urgencyScore === 'HIGH' ? `[URGENT] New Project Inquiry - ${name}` : `New Project Inquiry - ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: ${emailTheme.background}; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
          
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, ${emailTheme.primary} 0%, #1e40af 100%); padding: 48px 32px; text-align: center; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.05&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); opacity: 0.1;"></div>
            ${urgencyScore === 'HIGH' ? `
            <div style="background: ${emailTheme.danger}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; display: inline-block; margin-bottom: 16px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(239,68,68,0.3);">
              URGENT
            </div>` : ''}
            <h1 style="margin: 0; font-size: 32px; color: white; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">New Lead Alert!</h1>
            <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; font-weight: 500;">${name} wants to work with you</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 32px;">
            
            <!-- Stats Bar -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;">
              <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, ${emailTheme.primaryLight} 0%, #dbeafe 100%); border-radius: 12px; border: 2px solid ${emailTheme.border};">
                <div style="font-size: 28px; font-weight: 700; color: ${emailTheme.textPrimary}; margin-bottom: 4px;">${messageWordCount}</div>
                <div style="font-size: 12px; color: ${emailTheme.textMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Words</div>
              </div>
              <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, ${urgencyScore === 'HIGH' ? '#fee2e2' : '#dcfce7'} 0%, ${urgencyScore === 'HIGH' ? '#fecaca' : '#bbf7d0'} 100%); border-radius: 12px; border: 2px solid ${urgencyScore === 'HIGH' ? emailTheme.danger : emailTheme.success};">
                <div style="font-size: 28px; font-weight: 700; color: ${urgencyScore === 'HIGH' ? emailTheme.danger : emailTheme.success}; margin-bottom: 4px;">${urgencyScore === 'HIGH' ? 'High' : 'Normal'}</div>
                <div style="font-size: 12px; color: ${emailTheme.textMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Priority</div>
              </div>
              <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); border-radius: 12px; border: 2px solid ${emailTheme.purple};">
                <div style="font-size: 28px; font-weight: 700; color: ${emailTheme.purple}; margin-bottom: 4px;">Now</div>
                <div style="font-size: 12px; color: ${emailTheme.textMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Received</div>
              </div>
            </div>

            <!-- Contact Info Card -->
            <div style="margin-bottom: 28px; background: ${emailTheme.backgroundAlt}; border-radius: 12px; padding: 24px; border: 1px solid ${emailTheme.border};">
              <h2 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 700; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">
                Contact Details
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid ${emailTheme.borderLight};">
                    <div style="font-size: 12px; color: ${emailTheme.textMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Full Name</div>
                    <div style="font-size: 16px; color: ${emailTheme.textPrimary}; font-weight: 600;">${name}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid ${emailTheme.borderLight};">
                    <div style="font-size: 12px; color: ${emailTheme.textMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Email Address</div>
                    <a href="mailto:${email}" style="font-size: 16px; color: ${emailTheme.primary}; font-weight: 600; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0; ${category ? `border-bottom: 1px solid ${emailTheme.borderLight};` : ''}">
                    <div style="font-size: 12px; color: ${emailTheme.textMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Subject</div>
                    <div style="font-size: 16px; color: ${emailTheme.textPrimary}; font-weight: 600;">${subject}</div>
                  </td>
                </tr>
                ${category ? `
                <tr>
                  <td style="padding: 16px 0;">
                    <div style="font-size: 12px; color: ${emailTheme.textMuted}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Project Category</div>
                    <div style="display: inline-block; background: ${emailTheme.primaryLight}; color: ${emailTheme.primary}; padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 600;">${category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                  </td>
                </tr>
                ` : ''}
              </table>
            </div>

            <!-- Message Card -->
            <div style="margin-bottom: 28px;">
              <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">
                Their Message
              </h2>
              <div style="padding: 24px; background: linear-gradient(135deg, #ffffff 0%, ${emailTheme.backgroundAlt} 100%); border-left: 4px solid ${emailTheme.primary}; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <p style="margin: 0; color: ${emailTheme.textSecondary}; line-height: 1.8; font-size: 15px; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="margin-bottom: 28px;">
              <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: ${emailTheme.textMuted}; text-transform: uppercase; letter-spacing: 1px;">Quick Actions</h2>
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                  <td style="padding-right: 8px;">
                    <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}" 
                       style="display: block; background: linear-gradient(135deg, ${emailTheme.primary} 0%, #1e40af 100%); color: white; padding: 16px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; text-align: center; box-shadow: 0 4px 12px rgba(59,130,246,0.3);">
                      Reply to ${name.split(' ')[0]}
                    </a>
                  </td>
                  <td style="padding-left: 8px;">
                    <a href="${buildPrefilledSchedulingUrl(name, email, subject)}" target="_blank"
                       style="display: block; background: linear-gradient(135deg, ${emailTheme.success} 0%, #059669 100%); color: white; padding: 16px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
                      Schedule Meeting
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Recommendation Box -->
            <div style="padding: 20px 24px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid ${emailTheme.warning}; border-radius: 8px; box-shadow: 0 2px 8px rgba(245,158,11,0.15);">
              <div style="font-size: 13px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Smart Recommendation</div>
              <div style="font-size: 14px; color: #78350f; line-height: 1.6; font-weight: 500;">
                ${urgencyScore === 'HIGH' ? 'High priority lead! Respond within 12 hours for best conversion rate.' : 'Respond within 24-48 hours to maintain professionalism and close the deal.'}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, ${emailTheme.backgroundDark} 0%, #0f172a 100%); padding: 32px; text-align: center; border-top: 1px solid ${emailTheme.border};">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: ${emailTheme.textLight}; font-weight: 500;">
              ${timestamp}
            </p>
            <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">
              ${siteConfig.siteName} • Lead Notification System
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  };
}

// Generate auto-reply email to client
interface AutoReplyEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  isSimpleClient: boolean;
}

export function generateAutoReplyEmail(params: AutoReplyEmailParams) {
  const { name, email, subject, message, category, isSimpleClient } = params;

  return {
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
}
