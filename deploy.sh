#!/bin/bash
set -e

echo "🚀 JarothiSpot Production Deployment"
echo "===================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.sample .env
    echo "✅ .env file created. Edit it if needed before continuing."
else
    echo "✅ .env file already exists."
fi

# Build images if they don't exist
echo "🔍 Checking for required images..."
if ! docker images | grep -q "jarothisspot-server.*latest" || ! docker images | grep -q "jarothisspot-client.*latest"; then
    echo "🏗️  Building images from source..."
    docker compose build
    echo "✅ Images built successfully."
else
    echo "✅ Images already exist."
fi

# Deploy
echo "🚀 Starting deployment..."
docker compose -f docker-compose.deploy.yml up -d

# Wait for health checks
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check status
echo "📊 Checking service status..."
docker compose -f docker-compose.deploy.yml ps

# Test endpoints
echo "🔍 Testing endpoints..."
echo -n "API Health: "
if curl -s http://localhost:8080/actuator/health | grep -q "UP"; then
    echo "✅ Healthy"
else
    echo "❌ Failed"
fi

echo -n "Web App: "
if curl -s http://localhost/ | grep -q "html"; then
    echo "✅ Responding"
else
    echo "❌ Failed"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📱 Access your application:"
echo "   Web App: http://localhost"
echo "   API: http://localhost:8080"
echo "   Swagger: http://localhost:8080/swagger-ui.html"
echo ""
echo "👤 Default admin credentials:"
echo "   Email: admin@example.com"
echo "   Password: Admin#123456"
echo ""
echo "🛠️  Useful commands:"
echo "   View logs: docker compose -f docker-compose.deploy.yml logs -f"
echo "   Stop: docker compose -f docker-compose.deploy.yml down"
echo "   Reset: docker compose -f docker-compose.deploy.yml down -v"
