#!/bin/bash
# Deploy Database Schema via Supabase CLI

echo "📊 Foco Fiscal - Database Schema Deploy"
echo "========================================"
echo ""

# Check if we can access the schema file
if [ ! -f "database/schema.sql" ]; then
  echo "❌ Schema file not found!"
  echo "   Expected: database/schema.sql"
  exit 1
fi

SCHEMA_FILE="database/schema.sql"
SCHEMA_LINES=$(wc -l < "$SCHEMA_FILE")

echo "✅ Schema file found: $SCHEMA_LINES lines"
echo ""

echo "🚀 OPTION 1: Via Supabase Web UI (2 minutes)"
echo "─────────────────────────────────────────────"
echo ""
echo "1. Open this link:"
echo "   👉 https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/sql/new"
echo ""
echo "2. Copy schema to clipboard:"
echo "   cat $SCHEMA_FILE | pbcopy"
echo ""
echo "3. In the SQL editor:"
echo "   - Press Cmd+A to select all"
echo "   - Press Cmd+V to paste"
echo "   - Click the blue 'Run' button"
echo ""
echo "4. Wait for 'Success' message ✅"
echo ""

echo "─────────────────────────────────────────────"
echo ""

echo "🖥️  OPTION 2: Via PostgreSQL CLI (1 minute)"
echo "────────────────────────────────────────────"
echo ""
echo "Prerequisites:"
echo "- Need to install psql (PostgreSQL client)"
echo "- Mac: brew install postgresql"
echo "- Linux: apt install postgresql-client"
echo "- Windows: Download PostgreSQL"
echo ""
echo "Then run:"
echo "export PGPASSWORD='[your_database_password]'"
echo "psql -h db.etvqtsncufggbdmayulz.supabase.co -U postgres -d postgres -f $SCHEMA_FILE"
echo ""
echo "To find your password:"
echo "1. Go to: https://supabase.com/dashboard/project/etvqtsncufggbdmayulz/settings/database"
echo "2. Copy the 'Database Password'  or click 'Reset Password' if needed"
echo ""

echo "─────────────────────────────────────────────"
echo ""
echo "ℹ️  Schema Summary:"
echo "   - Creates 3 tables: diagnosticos, relatorios, pagamentos"
echo "   - Creates 7 indexes for performance"
echo "   - Enables Row Level Security (RLS)"
echo "   - All using PostgreSQL best practices"
echo ""
echo "📝 Next steps after schema is created:"
echo "   1. Integrate database calls in src/app/diagnostico/page.tsx"
echo "   2. Test locally: npm run dev"
echo "   3. Deploy to Vercel: git push"
echo ""
