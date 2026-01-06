const nodemailer = require('nodemailer');

const N8N_BASE_URL = 'http://159.89.113.242';

// Users with CORRECT invite URLs (fixed from localhost to real server)
const users = [
  { 
    email: 'alij123402@gmail.com', 
    inviteUrl: 'http://159.89.113.242/signup?inviterId=87979355-3462-4751-beae-5705a546b7e1&inviteeId=0db9cbeb-37e6-4ffc-8a46-50fb8737df05'
  },
  { 
    email: 'aleemacheema@gmail.com', 
    inviteUrl: 'http://159.89.113.242/signup?inviterId=87979355-3462-4751-beae-5705a546b7e1&inviteeId=a6688e69-aa18-4570-bd75-e9a0bd57d0a5'
  },
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

async function sendEmail(userEmail, inviteUrl) {
  const mailOptions = {
    from: 'Hello@avallon.ca',
    to: userEmail,
    subject: 'Complete Your n8n Registration - Avallon',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366F1; margin: 0; font-size: 28px;">n8n</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Workflow Automation by Avallon</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; color: white; text-align: center; margin-bottom: 25px;">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">Complete Your Registration! 🚀</h2>
          <p style="margin: 0; opacity: 0.9;">Click the button below to set up your password</p>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello,</p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Your n8n account has been created. Click the button below to complete your registration and set up your password.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            Accept Invitation & Set Password →
          </a>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #333; font-weight: 600;">If the button doesn't work, copy this link:</p>
          <p style="margin: 0; color: #6366F1; word-break: break-all; font-size: 14px;">${inviteUrl}</p>
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
    console.log('   Invite URL:', inviteUrl);
    return true;
  } catch (error) {
    console.error('❌ Failed:', userEmail, error.message);
    return false;
  }
}

async function main() {
  console.log('📧 Resending n8n invitations with CORRECT URLs...\n');
  
  for (const user of users) {
    await sendEmail(user.email, user.inviteUrl);
    console.log('');
  }
  
  console.log('✅ Done! Users should now be able to complete registration.');
  process.exit(0);
}

main();
