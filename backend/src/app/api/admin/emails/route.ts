import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read email logs
    const emailLogPath = path.join(process.cwd(), 'email-log.json');
    let emails = [];
    
    if (fs.existsSync(emailLogPath)) {
      const emailData = fs.readFileSync(emailLogPath, 'utf8');
      emails = JSON.parse(emailData);
    }

    // Read signups
    const signupPath = path.join(process.cwd(), 'signups.json');
    let signups = [];
    
    if (fs.existsSync(signupPath)) {
      const signupData = fs.readFileSync(signupPath, 'utf8');
      signups = JSON.parse(signupData);
    }

    return NextResponse.json({ 
      emails: emails.reverse(), // Show newest first
      signups: signups.reverse() // Show newest first
    });
  } catch (error) {
    console.error('Error reading admin data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
