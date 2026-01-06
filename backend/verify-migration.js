/**
 * Verify spec-first architecture migration
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    console.log('🔍 Verifying migration...\n');
    
    // Test Project table
    console.log('1. Testing Project table...');
    const projectCount = await prisma.project.count();
    console.log(`✅ Project table exists (${projectCount} records)\n`);
    
    // Test SiteVersion table
    console.log('2. Testing SiteVersion table...');
    const versionCount = await prisma.siteVersion.count();
    console.log(`✅ SiteVersion table exists (${versionCount} records)\n`);
    
    // Test Asset table
    console.log('3. Testing Asset table...');
    const assetCount = await prisma.asset.count();
    console.log(`✅ Asset table exists (${assetCount} records)\n`);
    
    // Test Site table for projectId column
    console.log('4. Testing Site table for projectId column...');
    const sites = await prisma.site.findMany({ take: 1 });
    console.log(`✅ Site table has projectId column\n`);
    
    console.log('✅ Migration verified successfully!');
    console.log('\n📊 Database Status:');
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Site Versions: ${versionCount}`);
    console.log(`   Assets: ${assetCount}`);
    console.log(`   Sites: ${sites.length > 0 ? 'Ready' : 'Empty'}`);
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verify();


