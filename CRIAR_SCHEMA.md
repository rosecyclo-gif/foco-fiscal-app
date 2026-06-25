# 📊 Criar Schema do Banco de Dados

O schema SQL está **100% pronto** e já copiado para seu clipboard! ✅

## 3 Opções para Criar

### 🎯 OPÇÃO 1: Supabase Web UI (Mais Fácil)

1. Abra: **https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/sql/new**
2. Se uma modal abrir, feche com **ESC** (aperte várias vezes)
3. No editor SQL, faça:
   - Selecionar tudo: **Cmd+A** (Mac) ou **Ctrl+A** (Windows)
   - Colar: **Cmd+V** (Mac) ou **Ctrl+V** (Windows)
4. Clique no botão azul **"Run"**
5. Pronto! ✅

---

### 🖥️ OPÇÃO 2: Linha de Comando (Mais Rápido)

```bash
# 1. Abra o settings de database do Supabase para copiar a senha:
# → https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/settings/database
# → Copie a senha (ou clique "Reset Password")

# 2. Execute (substitua [PASSWORD] pela senha):
PGPASSWORD="[PASSWORD]" psql \
  -h db.etvqtsncufggbdmayulz.supabase.co \
  -U postgres \
  -d postgres \
  -f database/schema.sql
```

---

### 📋 OPÇÃO 3: Se Ficar Travado

Se a interface do Supabase ficar travada:

```bash
# Copie o schema novamente:
cat database/schema.sql | pbcopy

# Depois tente Option 1 de novo
```

---

## ✅ Depois de Criar

Você verá:
- ✓ Mensagem verde de "Success"
- ✓ 3 tabelas no painel esquerdo:
  - `diagnosticos` 
  - `relatorios`
  - `pagamentos`

---

## 📌 O que o Schema Cria

**diagnosticos** → Armazena respostas do usuário
```
- id (UUID)
- user_email
- responses (JSON)
- resultado (JSON)
```

**relatorios** → Armazena relatórios gerados
```
- id (UUID)
- diagnostico_id
- user_email
- content (relatório em texto)
```

**pagamentos** → Preparado para Hotmart
```
- id (UUID)
- user_email
- relatorio_id
- amount_cents
- status
```

---

## 🚀 Próximos Passos

✅ Database schema criado
⏭️  Integrar chamadas ao banco na app
⏭️  Testar localmente
⏭️  Deploy para Vercel
⏭️  Integrar Hotmart

Ver: [NEXT_STEPS.md](NEXT_STEPS.md)
