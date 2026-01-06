#!/bin/bash
# Apply Spec-First Architecture Migration
# Run this when database connection is stable

echo "📋 Applying Spec-First Architecture Migration..."
echo ""

# Option 1: Use Prisma migrate (if connection works)
echo "Attempting Prisma migrate..."
npx prisma migrate dev --name add_spec_architecture || {
    echo ""
    echo "⚠️  Prisma migrate failed (connection issue)"
    echo ""
    echo "📝 Manual Migration Options:"
    echo ""
    echo "Option 1: Apply SQL directly via Supabase Dashboard"
    echo "   1. Go to Supabase Dashboard > SQL Editor"
    echo "   2. Copy contents of: prisma/migrations/add_spec_architecture.sql"
    echo "   3. Run the SQL"
    echo ""
    echo "Option 2: Use psql command line"
    echo "   psql \$DATABASE_URL -f prisma/migrations/add_spec_architecture.sql"
    echo ""
    echo "Option 3: Try Prisma db push (simpler, for dev)"
    echo "   npx prisma db push"
    echo ""
}

# Generate Prisma client
echo ""
echo "✅ Generating Prisma Client..."
npx prisma generate

echo ""
echo "✅ Done! Prisma Client generated with new types."


