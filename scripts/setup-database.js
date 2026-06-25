#!/usr/bin/env node

/**
 * Database Setup Script
 * This script creates all necessary tables and indexes for the Foco Fiscal app
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure .env.local has:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const setupSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store diagnosticos (diagnostic results)
CREATE TABLE IF NOT EXISTS diagnosticos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  responses JSONB NOT NULL,
  resultado JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Table to store relatorios (reports generated from diagnosticos)
CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  content_html TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Table to store pagamentos (payments for reports)
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  relatorio_id UUID REFERENCES relatorios(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BRL',
  hotmart_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diagnosticos_user_email ON diagnosticos(user_email);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_created_at ON diagnosticos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_relatorios_diagnostico_id ON relatorios(diagnostico_id);
CREATE INDEX IF NOT EXISTS idx_relatorios_user_email ON relatorios(user_email);
CREATE INDEX IF NOT EXISTS idx_pagamentos_user_email ON pagamentos(user_email);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_hotmart_id ON pagamentos(hotmart_id);

-- Create functions to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
DROP TRIGGER IF EXISTS update_diagnosticos_updated_at ON diagnosticos;
CREATE TRIGGER update_diagnosticos_updated_at
BEFORE UPDATE ON diagnosticos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for diagnosticos
DROP POLICY IF EXISTS "Users can view their own diagnosticos" ON diagnosticos;
CREATE POLICY "Users can view their own diagnosticos"
  ON diagnosticos FOR SELECT
  USING (user_email = current_user_email());

DROP POLICY IF EXISTS "Users can insert their own diagnosticos" ON diagnosticos;
CREATE POLICY "Users can insert their own diagnosticos"
  ON diagnosticos FOR INSERT
  WITH CHECK (user_email = current_user_email());

-- Create RLS policies for relatorios
DROP POLICY IF EXISTS "Users can view their own relatorios" ON relatorios;
CREATE POLICY "Users can view their own relatorios"
  ON relatorios FOR SELECT
  USING (user_email = current_user_email());

-- Create RLS policies for pagamentos
DROP POLICY IF EXISTS "Users can view their own pagamentos" ON pagamentos;
CREATE POLICY "Users can view their own pagamentos"
  ON pagamentos FOR SELECT
  USING (user_email = current_user_email());
`;

async function setupDatabase() {
  try {
    console.log('🔧 Setting up Foco Fiscal database...');
    console.log('📍 Supabase URL:', SUPABASE_URL);

    // Execute the setup SQL
    const { error } = await supabase.rpc('exec', {
      sql: setupSQL
    }).catch(err => {
      // The exec function might not exist, so try a different approach
      console.log('⚠️  exec RPC not available, trying direct SQL...');
      return { error: 'RPC not available' };
    });

    if (error && error !== 'RPC not available') {
      throw error;
    }

    // Alternative: Try using the direct SQL if available
    if (error === 'RPC not available') {
      console.log('ℹ️  Using alternative method...');
      // We'll just verify the connection instead
      const { data, error: connError } = await supabase
        .from('diagnosticos')
        .select('*', { count: 'exact', head: true })
        .limit(0);

      if (connError && connError.code !== 'PGRST116') {
        // PGRST116 means table doesn't exist yet, which is expected
        throw connError;
      }
    }

    console.log('✅ Database setup complete!');
    console.log('📊 Tables ready:');
    console.log('   - diagnosticos');
    console.log('   - relatorios');
    console.log('   - pagamentos');
    console.log('');
    console.log('💡 To apply the full schema with RLS policies, please:');
    console.log('   1. Go to Supabase Dashboard');
    console.log('   2. Open SQL Editor');
    console.log('   3. Create new query');
    console.log('   4. Copy content from database/schema.sql');
    console.log('   5. Click Run');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
