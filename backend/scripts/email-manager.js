#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const emailLogFile = path.join(process.cwd(), 'email-log.json');

function displayEmails() {
  try {
    if (!fs.existsSync(emailLogFile)) {
      console.log('📧 No email log file found.');
      return;
    }

    const logs = JSON.parse(fs.readFileSync(emailLogFile, 'utf8'));
    
    if (logs.length === 0) {
      console.log('📧 No emails logged yet.');
      return;
    }

    console.log('📧 EMAIL LOG - Manual Sending Required');
    console.log('='.repeat(50));
    
    logs.forEach((log, index) => {
      console.log(`\n📧 Email #${index + 1}`);
      console.log(`📅 Time: ${new Date(log.timestamp).toLocaleString()}`);
      console.log(`📬 Type: ${log.type}`);
      console.log(`👤 To: ${log.to}`);
      console.log(`📝 Subject: ${log.subject}`);
      console.log(`📄 Content:`);
      console.log(log.content);
      console.log('-'.repeat(30));
    });

    console.log(`\n📊 Total emails logged: ${logs.length}`);
    console.log('\n💡 To send these emails manually:');
    console.log('1. Copy the content above');
    console.log('2. Send from your email client (Hello@avallon.ca)');
    console.log('3. Or set up SMTP credentials in .env file');
    
  } catch (error) {
    console.error('❌ Error reading email log:', error);
  }
}

function clearEmailLog() {
  try {
    if (fs.existsSync(emailLogFile)) {
      fs.writeFileSync(emailLogFile, '[]');
      console.log('✅ Email log cleared.');
    } else {
      console.log('📧 No email log file to clear.');
    }
  } catch (error) {
    console.error('❌ Error clearing email log:', error);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'show':
  case 'display':
    displayEmails();
    break;
  case 'clear':
    clearEmailLog();
    break;
  default:
    console.log('📧 Avallon Email Manager');
    console.log('Usage:');
    console.log('  npm run email:show    - Display logged emails');
    console.log('  npm run email:clear   - Clear email log');
    break;
}
