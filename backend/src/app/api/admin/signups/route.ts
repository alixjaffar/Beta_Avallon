import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read signups
    const signupPath = path.join(process.cwd(), 'signups.json');
    let signups = [];
    
    if (fs.existsSync(signupPath)) {
      const signupData = fs.readFileSync(signupPath, 'utf8');
      signups = JSON.parse(signupData);
    }

    return NextResponse.json({ 
      signups: signups.reverse() // Show newest first
    });
  } catch (error) {
    console.error('Error reading signup data:', error);
    return NextResponse.json({ error: 'Failed to read signup data' }, { status: 500 });
  }
}
