#!/usr/bin/env node

/**
 * Execute database schema using PostgreSQL connection via Node.js
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const DB_PASSWORD = process.env.DB_PASSWORD || '';

if (!SUPABASE_URL) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

// Extract project ID from URL
const projectId = SUPABASE_URL.replace('https://', '').split('.')[0];

// Read the schema file
const schemaPath = path.join(__dirname, '../database/schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Schema file not found:', schemaPath);
  process.exit(1);
}

const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

console.log('📊 Database Schema Executor via psql');
console.log('=====================================\n');
console.log('Project ID:', projectId);
console.log('Database Host: db.' + projectId + '.supabase.co');
console.log('');

// Try to connect and execute
const pool = new Pool({
  host: `db.${projectId}.supabase.co`,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: DB_PASSWORD || 'postgres',
  ssl: 'require',
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('❌ Pool error:', err.message);
});

(async () => {
  const client = await pool.connect();
  try {
    console.log('✅ Connected to Supabase PostgreSQL database\n');
    console.log('🚀 Executing schema...\n');
    
    // Execute the schema SQL
    await client.query(sqlContent);
    
    console.log('\n✅ Schema created successfully!');
    console.log('\n📊 Tables created:');
    console.log('  ✓ diagnosticos');
    console.log('  ✓ relatorios');
    console.log('  ✓ pagamentos');
    console.log('\n🎉 Database is ready to use!');
    
  } catch (error) {
    console.error('❌ Error executing schema:', error.message);
    
    // Check if it's a password error
    if (error.message.includes('password')) {
      console.error('\n💡 Hint: The database password is not set.');
      console.error('   To fix this, add DB_PASSWORD to .env.local or run:');
      console.error(`   PGPASSWORD="[password]" psql -h db.${projectId}.supabase.co -U postgres -d postgres -f database/schema.sql`);
    }
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
