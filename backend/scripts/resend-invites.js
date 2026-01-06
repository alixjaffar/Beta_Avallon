const nodemailer = require('nodemailer');

const N8N_BASE_URL = 'http://159.89.113.242';
const loginUrl = `${N8N_BASE_URL}/signin`;
const signupUrl = `${N8N_BASE_URL}/signup`;

// Users to send emails to (pending users from n8n)
const users = [
  { email: 'alij123402@gmail.com', isPending: true },
  { email: 'aleemacheema@gmail.com', isPending: true },
  // Skip test user
];

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'Hello@avallon.ca',
    pass: 'oagqtgpxwcldyibn',
  },
});

async function sendEmail(userEmail, isPending) {
  const primaryUrl = isPending ? signupUrl : loginUrl;
  const subject = isPending 
    ? 'Complete Your n8n Registration - Avallon'
    : 'Your n8n Account is Ready - Avallon';

  const mailOptions = {
    from: 'Hello@avallon.ca',
    to: userEmail,
    subject: subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366F1; margin: 0; font-size: 28px;">n8n</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Workflow Automation by Avallon</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; color: white; text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">${isPending ? 'Complete Your Registration! 🚀' : 'Your Account is Ready! ✅'}</h2>
          <p style="margin: 0; opacity: 0.9;">${isPending ? 'Set up your password to start automating' : 'Log in to start building workflows'}</p>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello,</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          ${isPending 
            ? 'Your n8n account has been created. Click the button below to complete your registration and set up your password.'
            : 'Your n8n account is ready to use. Click the button below to log in and start building powerful automation workflows.'
          }
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${primaryUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            ${isPending ? 'Complete Registration →' : 'Log In to n8n →'}
          </a>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">Quick Links:</p>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li style="margin-bottom: 8px;">Sign Up: <a href="${signupUrl}" style="color: #6366F1;">${signupUrl}</a></li>
            <li>Sign In: <a href="${loginUrl}" style="color: #6366F1;">${loginUrl}</a></li>
          </ul>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          <strong>Your Email:</strong> ${userEmail}
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          This email was sent by Avallon. If you didn't request this, you can safely ignore it.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email to', userEmail, ':', error.message);
    return false;
  }
}

async function main() {
  console.log('📧 Resending n8n invitation emails...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const user of users) {
    const result = await sendEmail(user.email, user.isPending);
    if (result) success++;
    else failed++;
  }
  
  console.log('\n📊 Summary:', success, 'sent,', failed, 'failed');
  process.exit(0);
}

main();
