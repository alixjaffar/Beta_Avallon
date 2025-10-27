#!/bin/bash

# Script to set up the beta signup tracking system
echo "🚀 Setting up Avallon Beta Signup Tracking System"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    cp env.example .env
    echo "✅ Created .env file. Please edit it with your email credentials."
    echo ""
fi

# Check if database is running
echo "🔍 Checking database connection..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ Database is not running. Please start your PostgreSQL database first."
    echo "   You can start it with: brew services start postgresql"
    echo ""
    exit 1
fi

echo "✅ Database is running"
echo ""

# Run Prisma migration
echo "📊 Creating beta signup table..."
npx prisma migrate dev --name add_beta_signup_table

if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully!"
    echo ""
    echo "🎉 Setup complete! Your beta signup tracking system is ready."
    echo ""
    echo "📧 Next steps:"
    echo "1. Edit your .env file with email credentials:"
    echo "   EMAIL_USER=\"your-gmail@gmail.com\""
    echo "   EMAIL_APP_PASSWORD=\"your-gmail-app-password\""
    echo ""
    echo "2. Start your backend server:"
    echo "   npm run dev"
    echo ""
    echo "3. Access your admin dashboard at:"
    echo "   http://localhost:8082/admin"
    echo ""
    echo "4. Test the signup flow at:"
    echo "   http://localhost:8082/auth"
    echo ""
else
    echo "❌ Migration failed. Please check your database connection and try again."
    exit 1
fi
