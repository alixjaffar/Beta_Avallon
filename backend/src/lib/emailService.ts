import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

interface SignupNotificationData {
  name: string;
  email: string;
  birthday: string;
  emailSubscription: boolean;
  signupDate: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private emailLogFile: string;

  constructor() {
    // Configure email transporter for Hello@avallon.ca Google Workspace
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'Hello@avallon.ca',
        pass: 'oagq tgpx wcld yibn', // Google Workspace App Password
      },
    });
    
    this.emailLogFile = path.join(process.cwd(), 'email-log.json');
    
    console.log('📧 Email Service: Configured for Hello@avallon.ca');
    console.log('📧 Automatic email sending enabled!');
  }

  private logEmail(type: string, to: string, subject: string, content: string) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type,
        to,
        subject,
        content: content.substring(0, 200) + '...', // Truncate for logging
      };
      
      let logs = [];
      if (fs.existsSync(this.emailLogFile)) {
        logs = JSON.parse(fs.readFileSync(this.emailLogFile, 'utf8'));
      }
      
      logs.push(logEntry);
      fs.writeFileSync(this.emailLogFile, JSON.stringify(logs, null, 2));
      
      console.log(`📧 Email logged: ${type} to ${to}`);
    } catch (error) {
      console.error('Error logging email:', error);
    }
  }

  async sendSignupNotification(data: SignupNotificationData): Promise<boolean> {
    const subject = `New Beta Signup: ${data.name}`;
    const content = `
      New Beta Signup Notification
      
      User Details:
      - Name: ${data.name}
      - Email: ${data.email}
      - Birthday: ${data.birthday}
      - Email Subscription: ${data.emailSubscription ? 'Yes' : 'No'}
      - Signup Date: ${data.signupDate}
    `;

    try {
      const mailOptions = {
        from: 'Hello@avallon.ca',
        to: 'Hello@avallon.ca',
        subject: subject,
        priority: 'high' as const,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'X-Mailer': 'Avallon Beta System',
          'X-Auto-Response-Suppress': 'All',
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Beta Signup Notification</h2>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">User Details:</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Birthday:</strong> ${data.birthday}</p>
              <p><strong>Email Subscription:</strong> ${data.emailSubscription ? 'Yes' : 'No'}</p>
              <p><strong>Signup Date:</strong> ${data.signupDate}</p>
            </div>

            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin-top: 0;">Next Steps:</h4>
              <ul style="color: #555;">
                <li>Add this user to your beta notification list</li>
                <li>Send welcome email if they subscribed to notifications</li>
                <li>Track signup metrics for beta launch planning</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 14px;">
              This notification was automatically sent when a user signed up for the Avallon beta waitlist.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Signup notification email sent successfully to Hello@avallon.ca');
      
      // Also log for backup
      this.logEmail('signup-notification', 'Hello@avallon.ca', subject, content);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send signup notification email:', error);
      // Log the email for manual sending as fallback
      this.logEmail('signup-notification', 'Hello@avallon.ca', subject, content);
      console.log('📧 Email logged for manual sending as fallback');
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to Avallon Beta Waitlist!';
    const content = `
      Welcome to Avallon, ${userName}!
      
      Thank you for joining our beta waitlist! We're excited to have you on board.
      
      What's Next?
      - We'll notify you as soon as our beta version is ready
      - You'll get early access to our web creation platform
      - We'll keep you updated on our development progress
      
      In the meantime, feel free to reach out to us at Hello@avallon.ca if you have any questions.
      
      Best regards,
      The Avallon Team
    `;

    try {
      const mailOptions = {
        from: 'Hello@avallon.ca',
        to: userEmail,
        subject: subject,
        priority: 'high' as const,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'X-Mailer': 'Avallon Beta System',
          'X-Auto-Response-Suppress': 'All',
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Avallon, ${userName}!</h2>
            
            <p>Thank you for joining our beta waitlist! We're excited to have you on board.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">What's Next?</h3>
              <ul style="color: #555;">
                <li>We'll notify you as soon as our beta version is ready</li>
                <li>You'll get early access to our web creation platform</li>
                <li>We'll keep you updated on our development progress</li>
              </ul>
            </div>

            <p>In the meantime, feel free to reach out to us at <a href="mailto:Hello@avallon.ca">Hello@avallon.ca</a> if you have any questions.</p>
            
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              The Avallon Team
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully to', userEmail);
      
      // Also log for backup
      this.logEmail('welcome', userEmail, subject, content);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Log the email for manual sending as fallback
      this.logEmail('welcome', userEmail, subject, content);
      console.log('📧 Email logged for manual sending as fallback');
      return false;
    }
  }

  async sendNewUserWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to Avallon! 🎉';
    const content = `
      Welcome to Avallon, ${userName}!
      
      Thank you for joining Avallon! We're excited to have you on board.
      
      You now have access to:
      - AI-powered website generation
      - 15 free credits to get started
      - Professional website creation tools
      
      Get started by creating your first website in the dashboard!
      
      If you have any questions, feel free to reach out to us at Hello@avallon.ca
      
      Best regards,
      The Avallon Team
    `;

    try {
      const mailOptions = {
        from: 'Hello@avallon.ca',
        to: userEmail,
        subject: subject,
        priority: 'high' as const,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'X-Mailer': 'Avallon Platform',
          'X-Auto-Response-Suppress': 'All',
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Avallon, ${userName}! 🎉</h2>
            
            <p>Thank you for joining Avallon! We're excited to have you on board.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #555; margin-top: 0;">You now have access to:</h3>
              <ul style="color: #555;">
                <li>✨ AI-powered website generation</li>
                <li>🎁 15 free credits to get started</li>
                <li>🚀 Professional website creation tools</li>
                <li>💼 Custom domain support</li>
              </ul>
            </div>

            <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 15px 0; font-weight: bold;">Ready to create your first website?</p>
              <a href="https://beta-avallon.onrender.com/dashboard" 
                 style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:Hello@avallon.ca">Hello@avallon.ca</a></p>
            
            <p style="color: #666; font-size: 14px;">
              Best regards,<br>
              The Avallon Team
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ New user welcome email sent successfully to', userEmail);
      
      // Also log for backup
      this.logEmail('new-user-welcome', userEmail, subject, content);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send new user welcome email:', error);
      // Log the email for manual sending as fallback
      this.logEmail('new-user-welcome', userEmail, subject, content);
      console.log('📧 Email logged for manual sending as fallback');
      return false;
    }
  }

  async sendBulkUpdateEmail(subscribers: Array<{email: string, name: string}>, subject: string, content: string): Promise<{sent: number, failed: number}> {
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        const mailOptions = {
          from: 'Hello@avallon.ca',
          to: subscriber.email,
          subject: subject,
          priority: 'high' as const,
          headers: {
            'X-Priority': '1',
            'X-MSMail-Priority': 'High',
            'Importance': 'high',
            'X-Mailer': 'Avallon Beta System',
            'X-Auto-Response-Suppress': 'All',
          },
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Avallon Update</h2>
              
              <p>Hi ${subscriber.name},</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${content}
              </div>

              <p>Thank you for being part of the Avallon community!</p>
              
              <p style="color: #666; font-size: 14px;">
                Best regards,<br>
                The Avallon Team<br>
                <a href="mailto:Hello@avallon.ca">Hello@avallon.ca</a>
              </p>
            </div>
          `,
        };

        await this.transporter.sendMail(mailOptions);
        sent++;
        console.log(`✅ Update email sent to ${subscriber.email}`);
        
        // Also log for backup
        const personalizedContent = `
          Hi ${subscriber.name},
          
          ${content}
          
          Thank you for being part of the Avallon community!
          
          Best regards,
          The Avallon Team
          Hello@avallon.ca
        `;
        this.logEmail('bulk-update', subscriber.email, subject, personalizedContent);
        
      } catch (error) {
        failed++;
        console.error(`❌ Failed to send update email to ${subscriber.email}:`, error);
        // Log the email for manual sending as fallback
        const personalizedContent = `
          Hi ${subscriber.name},
          
          ${content}
          
          Thank you for being part of the Avallon community!
          
          Best regards,
          The Avallon Team
          Hello@avallon.ca
        `;
        this.logEmail('bulk-update', subscriber.email, subject, personalizedContent);
      }
    }

    console.log(`📧 Bulk email results: ${sent} sent, ${failed} failed`);
    return { sent, failed };
  }
}

export const emailService = new EmailService();