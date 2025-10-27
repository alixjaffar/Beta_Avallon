#!/bin/bash

# Avallon Cloud Development Script
# This script starts both the backend and frontend development servers

echo "🚀 Starting Avallon Cloud Development Environment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm run install:all

# Start development servers
echo "🔥 Starting development servers..."
echo ""
echo "Backend will run on: http://localhost:3000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run dev
