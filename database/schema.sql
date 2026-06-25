-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store diagnosticos (diagnostic results)
CREATE TABLE IF NOT EXISTS diagnosticos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  responses JSONB NOT NULL, -- Store all user responses as JSON
  resultado JSONB NOT NULL, -- Store calculated results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB -- Additional metadata like browser info, etc
);

-- Table to store relatorios (reports generated from diagnosticos)
CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL, -- The AI-generated report
  content_html TEXT, -- Optional HTML version of the report
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
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
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
CREATE TRIGGER update_diagnosticos_updated_at
BEFORE UPDATE ON diagnosticos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to view their own diagnosticos
CREATE POLICY "Users can view their own diagnosticos"
  ON diagnosticos
  FOR SELECT
  USING (user_email = (auth.jwt()->>'email')::text);

-- Allow users to insert their own diagnosticos
CREATE POLICY "Users can insert their own diagnosticos"
  ON diagnosticos
  FOR INSERT
  WITH CHECK (user_email = (auth.jwt()->>'email')::text);

-- Allow users to view their own relatorios
CREATE POLICY "Users can view their own relatorios"
  ON relatorios
  FOR SELECT
  USING (user_email = (auth.jwt()->>'email')::text);

-- Allow users to view their own pagamentos
CREATE POLICY "Users can view their own pagamentos"
  ON pagamentos
  FOR SELECT
  USING (user_email = (auth.jwt()->>'email')::text);
