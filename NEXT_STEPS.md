# 🚀 Próximos Passos - Foco Fiscal App

## ✅ O que foi feito:

1. ✅ App Next.js criado e rodando em `http://localhost:3000`
2. ✅ GitHub repository conectado
3. ✅ Vercel project linkado
4. ✅ Supabase database project criado
5. ✅ Variáveis de ambiente configuradas no `.env.local`

---

## 🔧 PASSO 1: Atualizar OpenAI API Key

O arquivo `.env.local` tem um placeholder para a chave OpenAI. Você precisa:

1. Vá para https://platform.openai.com/api-keys
2. Crie uma nova API key (ou use uma existente)
3. Atualize no `.env.local`:

```bash
OPENAI_API_KEY="sk-proj-sua-chave-aqui"
```

---

## 📊 PASSO 2: Criar Schema do Banco de Dados

### Opção A: Via Supabase Dashboard (Recomendado)

1. Abra https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/sql/new
2. No SQL Editor, clique em **"New Query"**
3. Cole o conteúdo completo de `database/schema.sql`:
   ```bash
   cat database/schema.sql
   ```
4. Clique no botão **"Run"** (ou use `Cmd+Enter`)
5. Aguarde a mensagem de sucesso ✅

### Opção B: Usando Supabase CLI (Avançado)

```bash
# Login no Supabase
npx supabase login

# Executar schema
npx supabase db push --db-url "postgresql://postgres:[password]@db.etvqtsncufggbdmayulz.supabase.co:5432/postgres"
```

---

## 🧪 PASSO 3: Testar Conexão com o Banco de Dados

Execute o comando:

```bash
npm run dev
```

Verifique no console se há erros de conexão com Supabase.

---

## 🔌 PASSO 4: Integrar Banco de Dados na App (Opcional)

As funções de banco de dados já estão prontas em `src/lib/database.ts`:

- `saveDiagnostico()` - Salvar diagnóstico
- `getUserDiagnosticos()` - Listar diagnósticos do usuário
- `generateAndSaveRelatorio()` - Gerar e salvar relatório

Para usar na page de diagnóstico, modifique `src/app/diagnostico/page.tsx`:

```typescript
import { saveDiagnostico, generateAndSaveRelatorio } from '@/lib/database';

// Na função de submit:
const diagnosticoId = await saveDiagnostico(
  userEmail,
  userResponses,
  resultado
);

await generateAndSaveRelatorio(diagnosticoId, userEmail);
```

---

## 🚀 PASSO 5: Deploy para Produção

Quando tudo estiver funcionando localmente:

```bash
# Push das mudanças para GitHub
git add .
git commit -m "Database setup and integration"
git push

# Vercel fará o deploy automaticamente
# Acompanhe em: https://vercel.com/dashboard
```

---

## 📝 Estrutura do Banco de Dados

### Tabela: `diagnosticos`
- Armazena respostas e resultados dos diagnósticos
- Ligada ao usuário via `user_email`

### Tabela: `relatorios`
- Armazena relatórios gerados pela IA
- Referencia o diagnóstico via `diagnostico_id`

### Tabela: `pagamentos`
- Preparado para Hotmart integration
- Status: `pending`, `completed`, `failed`, `refunded`

---

## 🔐 Segurança - Row Level Security (RLS)

Todas as tabelas têm RLS habilitado para garantir que cada usuário veja apenas seus dados.

---

## ⚠️ Importante: Atualizar OPENAI_API_KEY

**NÃO ESQUEÇA:** Você precisa adicionar sua chave OpenAI real antes de gerar relatórios!

Onde colocar: `OPENAI_API_KEY` no `.env.local`

---

## 📚 Recursos Úteis

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Deployment](https://vercel.com/docs)

---

## ✨ Próximas Fases (Futuro)

- [ ] Integrar pagamentos Hotmart
- [ ] Download de relatórios como PDF
- [ ] Email com relatório
- [ ] Dashboard de métricas
- [ ] Autenticação de usuários

---

**Status Atual:** ✅ Pronto para testes locais. Aguardando schema do banco de dados.
