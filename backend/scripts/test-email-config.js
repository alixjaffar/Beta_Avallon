#!/usr/bin/env node

const nodemailer = require('nodemailer');

// Test different SMTP configurations for Hello@avallon.ca
const testConfigs = [
  {
    name: 'Gmail SMTP',
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'Hello@avallon.ca',
        pass: 'Cheema1402@',
      },
    }
  },
  {
    name: 'Generic SMTP (mail.avallon.ca)',
    config: {
      host: 'mail.avallon.ca',
      port: 587,
      secure: false,
      auth: {
        user: 'Hello@avallon.ca',
        pass: 'Cheema1402@',
      },
    }
  },
  {
    name: 'Generic SMTP (smtp.avallon.ca)',
    config: {
      host: 'smtp.avallon.ca',
      port: 587,
      secure: false,
      auth: {
        user: 'Hello@avallon.ca',
        pass: 'Cheema1402@',
      },
    }
  },
  {
    name: 'Outlook/Hotmail SMTP',
    config: {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: 'Hello@avallon.ca',
        pass: 'Cheema1402@',
      },
    }
  },
  {
    name: 'Yahoo SMTP',
    config: {
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      auth: {
        user: 'Hello@avallon.ca',
        pass: 'Cheema1402@',
      },
    }
  }
];

async function testEmailConfig(config) {
  console.log(`\n🧪 Testing ${config.name}...`);
  
  try {
    const transporter = nodemailer.createTransport(config.config);
    
    // Test the connection
    await transporter.verify();
    console.log(`✅ ${config.name}: Connection successful!`);
    
    // Try to send a test email
    const testEmail = {
      from: 'Hello@avallon.ca',
      to: 'Hello@avallon.ca', // Send to yourself for testing
      subject: 'Test Email from Avallon System',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a test email to verify SMTP configuration.</p>'
    };
    
    const info = await transporter.sendMail(testEmail);
    console.log(`✅ ${config.name}: Test email sent successfully!`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return true;
  } catch (error) {
    console.log(`❌ ${config.name}: Failed`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🔍 Testing SMTP configurations for Hello@avallon.ca');
  console.log('='.repeat(60));
  
  let workingConfig = null;
  
  for (const config of testConfigs) {
    const success = await testEmailConfig(config);
    if (success && !workingConfig) {
      workingConfig = config;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (workingConfig) {
    console.log('🎉 SUCCESS! Found working SMTP configuration:');
    console.log(`   Provider: ${workingConfig.name}`);
    console.log('   Configuration:');
    console.log(JSON.stringify(workingConfig.config, null, 2));
  } else {
    console.log('❌ No working SMTP configuration found.');
    console.log('\n💡 Possible solutions:');
    console.log('1. Check if Hello@avallon.ca is set up with a specific email provider');
    console.log('2. Contact your domain/email provider for SMTP settings');
    console.log('3. Use a Gmail account for sending emails');
    console.log('4. Use the manual email sending method (current fallback)');
  }
}

// Run the tests
runTests().catch(console.error);
