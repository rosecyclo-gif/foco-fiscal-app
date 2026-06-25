# Setup Database com Supabase

Guia passo-a-passo para conectar seu Foco Fiscal ao banco de dados PostgreSQL do Supabase.

## 📋 Pré-requisitos

- ✅ Supabase account criado (você já tem)
- ✅ Projeto Supabase criado (rosecyclo-gif's Project)
- Upgrade para Pro realizado (para criar novo projeto) - OPCIONAL

## 🚀 Passo 1: Obter Credenciais do Supabase

### Opção A: Usar Projeto Existente (Recomendado para começar)

Se você ainda não fez upgrade:

1. Acesse: https://supabase.com/dashboard/projects
2. Clique em **"rosecyclo-gif's Project"**
3. Vá para **Settings** → **API**
4. Copie:
   - **Project URL**: Exemplo: `https://etvqtsncufggbdmayulz.supabase.co`
   - **anon public key**: Chave pública para cliente
   - **service_role key**: Chave privada para servidor (use com cuidado!)

### Opção B: Criar Novo Projeto (Após Upgrade para Pro)

1. Faça upgrade em: https://supabase.com/dashboard/org/htaywrgaskdtrxwmmyol/billing
2. Clique em **"Upgrade to Pro"** e complete o pagamento
3. Após upgrade, crie novo projeto:
   - Nome: `foco-fiscal`
   - Região: Próxima de seus usuários
   - Criptografia: Gerar automaticamente
4. Siga os mesmos passos da Opção A

## 🔐 Passo 2: Adicionar Credenciais ao .env.local

1. Abra `.env.local` no VS Code
2. Atualize com suas credenciais:

```env
# OpenAI
OPENAI_API_KEY=sua_chave_aqui

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

⚠️ **IMPORTANTE**: 
- Nunca compartilhe o `SUPABASE_SERVICE_ROLE_KEY`
- Não commite `.env.local` no Git (já está em .gitignore)
- O `NEXT_PUBLIC_*` é seguro expor no código

## 📊 Passo 3: Criar Tabelas no Banco

1. No dashboard Supabase, clique em **"SQL Editor"**
2. Clique em **"New Query"**
3. Copie e cole o conteúdo de `/database/schema.sql`
4. Clique em **"Run"**
5. Aguarde a confirmação

**Tabelas criadas:**
- ✅ `diagnosticos` - Armazena respostas dos usuários
- ✅ `relatorios` - Armazena relatórios gerados
- ✅ `pagamentos` - Armazena informações de pagamento (para Hotmart)

## ✅ Passo 4: Testar Conexão

1. No VS Code, abra o Terminal: `Ctrl + ~`
2. Execute:
   ```bash
   npm run dev
   ```
3. Acesse http://localhost:3000
4. Complete um diagnóstico
5. Os dados devem ser salvos automaticamente!

## 📱 Como o App Usa o Banco

### Fluxo de Diagnóstico → Relatório → Pagamento

```
1. Usuário acessa /diagnostico
   ↓
2. Responde questões (armazenadas em React state)
   ↓
3. Clica "Gerar Relatório"
   ↓
4. Diagnóstico salvo em `diagnosticos` table
   ↓
5. IA gera relatório baseado nas respostas
   ↓
6. Relatório salvo em `relatorios` table
   ↓
7. Usuário vê relatório em /relatorio
   ↓
8. Clica "Comprar Relatório em PDF" (Hotmart)
   ↓
9. Pagamento registrado em `pagamentos` table
```

## 🔧 Funções Disponíveis

Todas em `/src/lib/database.ts`:

```typescript
// Salvar diagnóstico
await saveDiagnostico(userEmail, responses, resultado);

// Obter diagnósticos do usuário
await getUserDiagnosticos(userEmail);

// Gerar e salvar relatório
await generateAndSaveRelatorio(diagnosticoId, userEmail);

// Obter relatórios do usuário
await getUserRelatorios(userEmail);

// Obter relatório específico
await getRelatorio(id);
```

## 🚀 Próximos Passos

1. ✅ Teste a conexão com o banco
2. ⏭️ Integre com autenticação (Login/Signup)
3. ⏭️ Implemente pagamento com Hotmart
4. ⏭️ Deploy para produção (Vercel)

## 🐛 Troubleshooting

### Erro: "Supabase environment variables are not defined"
- Verifique se `.env.local` tem as chaves corretas
- Reinicie o servidor: `npm run dev`

### Erro: "JWT could not be decoded"
- Verifique se o `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto
- Copie novamente do Supabase Dashboard

### Dados não estão sendo salvos
- Abra DevTools (F12) → Console
- Procure por mensagens de erro
- Verifique RLS policies em Supabase → Authentication → Policies

## 📞 Suporte

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do servidor (terminal)
3. Acesse Supabase Logs: Dashboard → Database → Logs

---

**Próximo passo**: Execute `npm run dev` e teste! 🎉
