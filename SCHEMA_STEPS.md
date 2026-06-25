# 📋 GUIA DE CRIAÇÃO DO SCHEMA - Passo a Passo

## ✅ PRONTO!  O SQL está copiado para seu clipboard

Siga estas 3 etapas simples:

---

## ETAPA 1️⃣: Abra o Supabase SQL Editor

Clique neste link:
**https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/sql/new**

---

## ETAPA 2️⃣: Limpe o editor (se houver algo lá)

- Clique no editor SQL
- Pressione **Ctrl+A** (ou **Cmd+A** no Mac)
- Pressione **Delete**

---

## ETAPA 3️⃣: Cole o SQL

- Pressione **Ctrl+V** (ou **Cmd+V** no Mac)
- Todo o schema deve aparecer

---

## ETAPA 4️⃣: Execute

Procure o botão azul **"Run"** na parte inferior direita do editor

- Clique em **"Run"** OU
- Pressione **Cmd+Enter** (Mac) ou **Ctrl+Enter** (Windows/Linux)

---

## ✅ Sucesso!

Você deve ver:
- ✓ Mensagem verde de sucesso
- ✓ Ou erros com "table already exists" (isso é OK!)
- ✓ No painel esquerdo, aparecem as 3 tabelas:
  - `diagnosticos`
  - `relatorios`
  - `pagamentos`

---

## 🆘 Se der erro?

### Erro: "permission denied"
- Saia e faça login novamente no Supabase
- Certifique-se de usar uma conta que é proprietária do projeto

### Erro: "table already exists"
- Significa que o schema já foi criado ✅
- Você pode prosseguir!

### Editor não funciona
- Tente em um navegador diferente
- Ou use a linha de comando (veja abaixo)

---

## 🖥️ ALTERNATIVA: Usar linha de comando

Se preferir, use o `psql`:

```bash
# Substitua [PASSWORD] pela sua senha do Postgres no Supabase
psql postgresql://postgres:[PASSWORD]@db.etvqtsncufggbdmayulz.supabase.co:5432/postgres < database/schema.sql
```

Para encontrar a senha:
1. Abra: https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/settings/database
2. Procure por "Database Password"
3. Clique em "Reset Password" se não souber

---

## 📌 O que o schema cria?

```
diagnosticos  ← Armazena respostas do usuário
    ├── id (UUID)
    ├── user_email (TEXT)
    ├── responses (JSON)
    └── resultado (JSON)

relatorios    ← Armazena relatórios gerados
    ├── id (UUID)
    ├── diagnostico_id (FK)
    ├── user_email (TEXT)
    └── content (TEXT)

pagamentos    ← Preparado para Hotmart
    ├── id (UUID)
    ├── user_email (TEXT)
    ├── relatorio_id (FK)
    ├── amount_cents (INT)
    └── status (TEXT)
```

---

## 🚀 Próximo?

Depois de criar o schema:

1. A app está **pronta para testar!**
2. Execute: `npm run dev`
3. Teste a página de diagnóstico
4. Faça commit e push para Vercel

---

**Precisar de ajuda?** Verifique `DATABASE_SETUP.md` e `NEXT_STEPS.md`
