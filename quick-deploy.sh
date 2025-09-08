#!/bin/bash
# JarothiSpot One-Command Deploy
set -e

REPO_URL="https://github.com/JarothD/jarothisSpot.git"
PROJECT_DIR="jarothisSpot"

echo "🚀 JarothiSpot One-Command Deployment"
echo "====================================="

# Clone if directory doesn't exist
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📥 Cloning repository..."
    git clone "$REPO_URL" "$PROJECT_DIR"
else
    echo "📁 Project directory already exists."
    echo "🔄 Pulling latest changes..."
    cd "$PROJECT_DIR"
    git pull
    cd ..
fi

# Enter project directory
cd "$PROJECT_DIR"

# Run deployment
echo "🚀 Starting deployment..."
if [ -f "deploy.sh" ]; then
    chmod +x deploy.sh
    ./deploy.sh
else
    echo "⚠️  deploy.sh not found, running manual deployment..."
    cp .env.sample .env 2>/dev/null || echo "No .env.sample found"
    docker compose build
    docker compose -f docker-compose.deploy.yml up -d
fi

echo ""
echo "🎉 Deployment complete!"
echo "📱 Your application is running at: http://localhost"
