#!/usr/bin/env node

/**
 * Guide for creating database schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

// Extract project ID from URL
const projectId = SUPABASE_URL.replace('https://', '').split('.')[0];

// For Supabase, we need the database password which we don't have in our env
// But we can use the SERVICE_ROLE_KEY approach

console.log('📋 Foco Fiscal - Database Schema Executor');
console.log('==========================================\n');

console.log('ℹ️  To create the database schema directly:');
console.log('\n📌 METHOD 1: Using psql (recommended)\n');
console.log('1. Get your database password from Supabase:');
console.log(`   → https://supabase.com/dashboard/project/${projectId}/settings/database`);
console.log('   → Look for "Database Password" in the tab "Connection pooling"');
console.log('   → Or reset it if you need\n');

console.log('2. Run this command in your terminal:');
console.log('   ```bash');
console.log(`   psql postgresql://postgres:[YOUR_PASSWORD]@db.${projectId}.supabase.co:5432/postgres < database/schema.sql`);
console.log('   ```\n');

console.log('3. Or use this shorter version after setting password:');
console.log('   ```bash');
console.log(`   export PGPASSWORD="[YOUR_PASSWORD]" && psql -h db.${projectId}.supabase.co -U postgres -d postgres -f database/schema.sql`);
console.log('   ```\n');

console.log('─'.repeat(60));
console.log('\n📌 METHOD 2: Using the Web UI (if automation is blocking)\n');
console.log('If the modal is blocking your Supabase SQL Editor:');
console.log(`1. Open: https://supabase.com/dashboard/project/${projectId}/sql/new`);
console.log('2. Press ESC key multiple times to close the modal');
console.log('3. Or try: Cmd+A → Delete → Paste the schema');
console.log('4. Then click the blue "Run" button\n');

console.log('─'.repeat(60));
console.log('\n✅ Schema file location: database/schema.sql\n');

// Check if schema file exists
const schemaPath = path.join(__dirname, '../database/schema.sql');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const lineCount = schemaContent.split('\n').length;
  console.log(`✓ Schema file exists (${lineCount} lines)`);
} else {
  console.log('⚠️  Schema file not found at', schemaPath);
}

console.log('\n💡 Tip: The schema.sql file is already in your clipboard from before!');
console.log('   Just open Supabase → SQL Editor → Cmd+V to paste\n');
