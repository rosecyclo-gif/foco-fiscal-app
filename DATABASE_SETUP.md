# 📊 Como Criar o Schema do Banco de Dados Supabase

## ⚡ Versão Rápida (5 minutos)

### 1️⃣ Abra o Supabase SQL Editor
Vá para: **https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/sql/new**

### 2️⃣ Copie o SQL Completo
No seu terminal:
```bash
cd ~/Downloads/foco-fiscal-app
cat database/schema.sql
```

Ou abra o arquivo diretamente: `database/schema.sql`

### 3️⃣ Cole no Supabase SQL Editor
- Clique no editor de texto
- Limpe qualquer conteúdo anterior (Ctrl+A, Delete)
- Cole todo o conteúdo de `database/schema.sql`

### 4️⃣ Execute o SQL
- Procure o botão **"Run"** (canto inferior direito em azul)
- OU use o atalho: **`Cmd+Enter`** (Mac) ou **`Ctrl+Enter`** (Windows/Linux)

### 5️⃣ Verifique o Resultado
- Você deve ver uma mensagem de sucesso
- As tabelas aparecem no painel esquerdo em "Tables"

---

## 📋 SQL Completo (Alternativa - se copiar não funcionar)

Se tiver problema em copiar do arquivo, aqui está o SQL completo:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store diagnosticos
CREATE TABLE IF NOT EXISTS diagnosticos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  responses JSONB NOT NULL,
  resultado JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Table to store relatorios
CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  content_html TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Table to store pagamentos
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_diagnosticos_user_email ON diagnosticos(user_email);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_created_at ON diagnosticos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_relatorios_diagnostico_id ON relatorios(diagnostico_id);
CREATE INDEX IF NOT EXISTS idx_relatorios_user_email ON relatorios(user_email);
CREATE INDEX IF NOT EXISTS idx_pagamentos_user_email ON pagamentos(user_email);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_hotmart_id ON pagamentos(hotmart_id);

-- Create function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_diagnosticos_updated_at ON diagnosticos;
CREATE TRIGGER update_diagnosticos_updated_at
BEFORE UPDATE ON diagnosticos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own diagnosticos" ON diagnosticos;
CREATE POLICY "Users can view their own diagnosticos"
  ON diagnosticos FOR SELECT
  USING (user_email = current_user_email());

DROP POLICY IF EXISTS "Users can insert their own diagnosticos" ON diagnosticos;
CREATE POLICY "Users can insert their own diagnosticos"
  ON diagnosticos FOR INSERT
  WITH CHECK (user_email = current_user_email());

DROP POLICY IF EXISTS "Users can view their own relatorios" ON relatorios;
CREATE POLICY "Users can view their own relatorios"
  ON relatorios FOR SELECT
  USING (user_email = current_user_email());

DROP POLICY IF EXISTS "Users can view their own pagamentos" ON pagamentos;
CREATE POLICY "Users can view their own pagamentos"
  ON pagamentos FOR SELECT
  USING (user_email = current_user_email());
```

---

## ✅ Como Saber se Funcionou

Após clicar "Run", você deve ver:

1. ✅ Mensagem verde de sucesso
2. ✅ Tab "Results" mostra sucesso
3. ✅ No painel esquerdo (Database), aparecem 3 novas tabelas:
   - `diagnosticos`
   - `relatorios`
   - `pagamentos`

---

## ❌ Se Der Erro

### Erro: "table already exists"
- Isso é ok! Significa que o schema já foi criado
- Você já pode usar o banco de dados

### Erro: "permission denied"
- Verifique se está usando a conta correta no Supabase
- Você deve ser o owner do projeto

### Erro: "invalid SQL syntax"
- Copie exatamente todo o conteúdo de `database/schema.sql`
- Não modifique nada

---

## 🎯 Próximo Passo

Depois de criar o schema:

1. O banco está pronto para usar! ✅
2. A app já tem as funções de banco de dados prontas
3. Você pode testar localmente com: `npm run dev`
4. Fazer deploy com: `git push`

**Dúvidas?** Consulte `NEXT_STEPS.md` para mais detalhes.
