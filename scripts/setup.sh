#!/bin/bash

# Setup script for Notion Telegram Bot
# This script helps you get started quickly

set -e

echo "🚀 Notion Telegram Bot - Setup Script"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: You need to edit .env and add your credentials!"
    echo "   Run: nano .env"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build
echo "✅ Build successful"
echo ""

# Check configuration
echo "🔍 Checking configuration..."
npm run check || {
    echo ""
    echo "⚠️  Configuration incomplete. Please fill in your .env file."
    echo "   See NEXT_STEPS.md for instructions."
    exit 1
}

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your credentials: nano .env"
echo "  2. Run the bot: npm run dev"
echo ""
echo "See NEXT_STEPS.md for detailed instructions."
