#!/bin/bash

# Extract project ID from .env.local
PROJECT_ID=$(grep "NEXT_PUBLIC_SUPABASE_URL" ~/Downloads/foco-fiscal-app/.env.local | cut -d'"' -f2 | sed 's|https://||' | cut -d'.' -f1)

echo "📋 Foco Fiscal - Database Schema Executor"
echo "=========================================="
echo ""

echo "✅ Status: Schema file ready at database/schema.sql"
echo ""

echo "🚀 OPTION 1: Using Supabase Web UI (Recommended)"
echo "────────────────────────────────────────────────"
echo ""
echo "Follow these steps:"
echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new"
echo "2. If a modal pops up, press ESC key several times"
echo "3. Copy the schema from your clipboard (it's already there!)"
echo "   OR paste: cat database/schema.sql | pbcopy && echo '✅ Copied'"
echo "4. In the SQL Editor, press Cmd+A then Cmd+V to replace content"
echo "5. Click the blue 'Run' button at the bottom right"
echo "6. Wait for success message ✓"
echo ""

echo "─────────────────────────────────────────────────"
echo ""

echo "🖥️  OPTION 2: Using Command Line (via psql)"
echo "────────────────────────────────────────────"
echo ""
echo "1. Get your database password:"
echo "   → Go to: https://supabase.com/dashboard/project/${PROJECT_ID}/settings/database"
echo "   → Copy the password (or click 'Reset Password' if you don't have it)"
echo ""
echo "2. Run this command (replace [PASSWORD] with your actual password):"
echo "   ```"
echo "   PGPASSWORD=\"[PASSWORD]\" psql -h db.${PROJECT_ID}.supabase.co -U postgres -d postgres -f database/schema.sql"
echo "   ```"
echo ""
echo "3. Wait for 'CREATE TABLE', 'CREATE INDEX', 'CREATE TRIGGER' messages"
echo ""

echo "─────────────────────────────────────────────────"
echo ""

echo "✨ That's it! Once created, your database is ready for:"
echo "   ✓ Storing diagnostic responses"
echo "   ✓ Storing AI-generated reports"
echo "   ✓ Processing payments (when Hotmart integration is added)"
echo ""
