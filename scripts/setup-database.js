#!/usr/bin/env node

/**
 * Database Setup Script for NoteCraft
 * 
 * This script automatically sets up the Appwrite database for the NoteCraft application.
 * Run this script after setting up your Appwrite project.
 * 
 * Usage:
 *   node scripts/setup-database.js
 *   or
 *   npm run setup-database
 */

import { databaseSetup } from '../lib/database-setup.js';

async function main() {
  console.log('🚀 NoteCraft Database Setup');
  console.log('============================\n');

  try {
    // Run the database setup
    const result = await databaseSetup.setupDatabase();

    if (result.success) {
      console.log('✅ Database setup completed successfully!');
      console.log('\n📊 Setup Summary:');
      console.log('• Database: notes_database');
      console.log('• Collection: notes');
      console.log('• Attributes: 9 created');
      console.log('• Permissions: User-specific access');
      console.log('• Indexes: 3 performance indexes');
      
      console.log('\n🔍 Verifying setup...');
      const verification = await databaseSetup.verifySetup();
      
      if (verification.success) {
        console.log('✅ Database verification successful!');
        console.log('\n🎉 Your NoteCraft database is ready to use!');
        console.log('\nNext steps:');
        console.log('1. Start your application: npm run dev');
        console.log('2. Create a user account');
        console.log('3. Start creating notes!');
      } else {
        console.log('❌ Database verification failed:', verification.message);
      }
    } else {
      console.log('❌ Database setup failed:', result.message);
      if (result.details) {
        console.log('\nError details:', result.details);
      }
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Setup script failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your Appwrite project ID is correct');
    console.error('2. Check that you have the necessary permissions');
    console.error('3. Verify your internet connection');
    console.error('4. Check the Appwrite console for any errors');
    process.exit(1);
  }
}

// Run the setup
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
