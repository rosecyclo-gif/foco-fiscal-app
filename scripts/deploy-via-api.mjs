#!/usr/bin/env node

/**
 * Execute SQL schema using Supabase REST API
 * This bypasses the UI completely
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://etvqtsncufggbdmayulz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dnF0c25jdWZnZ2JkbWF5dWx6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM4ODIzOSwiZXhwIjoyMDk3OTY0MjM5fQ.5aQBrY8T_bV8t-EFSLJSNgXoLn8CJqOKZPQfXj8Lfa8';

// Read the schema file
const schemaPath = path.join(__dirname, '../database/schema.sql');
const sqlContent = fs.readFileSync(schemaPath, 'utf-8');

console.log('📊 Executing Database Schema via Supabase API');
console.log('=============================================\n');

// Split SQL into individual statements
const statements = sqlContent.split(';').filter(stmt => stmt.trim());

console.log(`Found ${statements.length} SQL statements to execute\n`);

async function executeSQL() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim() + ';';
    if (!statement.trim()) continue;

    try {
      console.log(`[${i + 1}/${statements.length}] Executing...`);
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
        },
        body: JSON.stringify({
          query: statement
        })
      });

      if (response.ok) {
        console.log(`  ✅ Success`);
        successCount++;
      } else {
        const error = await response.text();
        if (error.includes('already exists')) {
          console.log(`  ⚠️  Already exists (OK)`);
          successCount++;
        } else {
          console.log(`  ❌ Error: ${response.status}`);
          errorCount++;
        }
      }
    } catch (error) {
      console.log(`  ❌ Network error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n✅ Completed: ${successCount} success, ${errorCount} errors\n`);
  
  if (errorCount === 0) {
    console.log('🎉 Database schema created successfully!');
  }
}

executeSQL();
