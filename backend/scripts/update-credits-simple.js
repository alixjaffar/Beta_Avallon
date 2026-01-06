// Simple script to update all users to 20 credits
const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

async function updateCredits() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Add column if it doesn't exist
    await client.query(`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 20;
    `);
    console.log('✅ Credits column added/verified');

    // Update all users to 20 credits
    const result = await client.query(`
      UPDATE "User" SET "credits" = 20 WHERE "credits" IS NULL OR "credits" < 20;
    `);
    console.log(`✅ Updated ${result.rowCount} users to 20 credits`);

    // Set default to 20
    await client.query(`
      ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 20;
    `);
    console.log('✅ Default set to 20 for new users');

    // Verify
    const users = await client.query(`
      SELECT email, credits FROM "User" LIMIT 10;
    `);
    
    console.log('\n📊 Sample user credits:');
    users.rows.forEach(user => {
      console.log(`  - ${user.email}: ${user.credits} credits`);
    });

    const total = await client.query(`SELECT COUNT(*) as count FROM "User"`);
    console.log(`\n✅ Total users: ${total.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

updateCredits();







