#!/usr/bin/env node
/**
 * Quick test script to verify Namecheap API configuration
 * Run with: node scripts/test-namecheap-api.js
 */

require('dotenv').config({ path: '.env' });

const API_USER = process.env.NAMECHEAP_API_USER;
const API_KEY = process.env.NAMECHEAP_API_KEY;
const USERNAME = process.env.NAMECHEAP_USERNAME;
const CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP;
const USE_SANDBOX = process.env.NAMECHEAP_USE_SANDBOX === 'true' || process.env.NAMECHEAP_SANDBOX === 'true';

const BASE_URL = USE_SANDBOX 
  ? 'https://api.sandbox.namecheap.com/xml.response'
  : 'https://api.namecheap.com/xml.response';

console.log('🔍 Namecheap API Configuration Test\n');
console.log('Configuration:');
console.log(`  API User: ${API_USER ? '✅ Set' : '❌ Missing'}`);
console.log(`  API Key: ${API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`  Username: ${USERNAME ? '✅ Set' : '❌ Missing'}`);
console.log(`  Client IP: ${CLIENT_IP ? `✅ ${CLIENT_IP}` : '❌ Missing'}`);
console.log(`  Environment: ${USE_SANDBOX ? '🧪 Sandbox' : '🚀 Production'}`);
console.log(`  API URL: ${BASE_URL}\n`);

if (!API_USER || !API_KEY || !USERNAME || !CLIENT_IP) {
  console.log('❌ Missing required environment variables!');
  console.log('Please check your backend/.env file.\n');
  process.exit(1);
}

// Test API connection
async function testAPI() {
  console.log('Testing API connection...\n');
  
  const params = new URLSearchParams({
    ApiUser: API_USER,
    ApiKey: API_KEY,
    UserName: USERNAME,
    ClientIp: CLIENT_IP,
    Command: 'namecheap.users.getPricing',
    ProductType: 'DOMAIN',
    ActionName: 'REGISTER',
    ProductCategory: 'DOMAINS'
  });

  const url = `${BASE_URL}?${params.toString()}`;
  
  try {
    console.log('Making API request...');
    const response = await fetch(url);
    const xml = await response.text();
    
    if (xml.includes('<Status>ERROR</Status>')) {
      const errorMatch = xml.match(/<Error>([^<]+)<\/Error>/);
      const error = errorMatch ? errorMatch[1] : 'Unknown error';
      console.log('❌ API Error:', error);
      
      if (error.includes('IP') || error.includes('whitelist')) {
        console.log('\n⚠️  IP Whitelist Issue:');
        console.log(`   Make sure ${CLIENT_IP} is whitelisted in Namecheap`);
        console.log('   Go to: Profile → Tools → API Access → Whitelisted IPs\n');
      }
      
      process.exit(1);
    } else if (xml.includes('<Status>OK</Status>')) {
      console.log('✅ API Connection Successful!');
      console.log('✅ Namecheap API is properly configured.\n');
      
      // Try to extract a price
      const priceMatch = xml.match(/<Product[^>]*Name="COM"[^>]*>[\s\S]*?<Price>([0-9.]+)<\/Price>/i);
      if (priceMatch) {
        console.log(`Sample pricing: .com domain = $${priceMatch[1]}`);
      }
      
      return true;
    } else {
      console.log('⚠️  Unexpected response:', xml.substring(0, 200));
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('\nCheck your internet connection and try again.\n');
    process.exit(1);
  }
}

testAPI().catch(console.error);

