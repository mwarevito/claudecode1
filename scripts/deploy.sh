#!/bin/bash

# Deployment script for production
# Usage: ./scripts/deploy.sh [pm2|docker]

set -e

DEPLOY_METHOD=${1:-pm2}

echo "🚀 Deploying Notion Telegram Bot"
echo "================================="
echo "Method: $DEPLOY_METHOD"
echo ""

# Check configuration
echo "🔍 Checking configuration..."
npm run check || {
    echo "❌ Configuration check failed. Fix errors before deploying."
    exit 1
}

# Build
echo "🔨 Building application..."
npm run build
echo "✅ Build successful"
echo ""

# Deploy based on method
case $DEPLOY_METHOD in
    pm2)
        echo "📦 Deploying with PM2..."
        
        # Check if PM2 is installed
        if ! command -v pm2 &> /dev/null; then
            echo "❌ PM2 is not installed. Install it with: npm install -g pm2"
            exit 1
        fi
        
        # Stop existing instance if running
        pm2 stop notion-bot 2>/dev/null || true
        pm2 delete notion-bot 2>/dev/null || true
        
        # Start with PM2
        pm2 start ecosystem.config.js
        pm2 save
        
        echo "✅ Deployed with PM2"
        echo ""
        echo "Useful commands:"
        echo "  pm2 logs notion-bot    - View logs"
        echo "  pm2 restart notion-bot - Restart bot"
        echo "  pm2 stop notion-bot    - Stop bot"
        ;;
        
    docker)
        echo "🐳 Deploying with Docker..."
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is not installed."
            exit 1
        fi
        
        # Stop and remove existing container
        docker stop notion-bot 2>/dev/null || true
        docker rm notion-bot 2>/dev/null || true
        
        # Build and run
        docker build -t notion-telegram-bot .
        docker run -d \
            --name notion-bot \
            --env-file .env \
            --restart unless-stopped \
            notion-telegram-bot
        
        echo "✅ Deployed with Docker"
        echo ""
        echo "Useful commands:"
        echo "  docker logs -f notion-bot  - View logs"
        echo "  docker restart notion-bot  - Restart bot"
        echo "  docker stop notion-bot     - Stop bot"
        ;;
        
    *)
        echo "❌ Unknown deployment method: $DEPLOY_METHOD"
        echo "Usage: ./scripts/deploy.sh [pm2|docker]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo "Test your bot by sending /start on Telegram"
