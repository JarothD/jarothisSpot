# JarothisSpot - Deployment Guide

## Quick Deploy (Recommended)

```bash
# Clone and deploy in one command
curl -s https://raw.githubusercontent.com/JarothD/jarothisSpot/clean-deploy/quick-deploy.sh | bash
```

Or manually:
```bash
git clone https://github.com/JarothD/jarothisSpot.git
cd jarothisSpot
git checkout clean-deploy
./deploy.sh
```

## Platform-Specific Scripts

### Linux/macOS
```bash
chmod +x deploy.sh
./deploy.sh
```

### Windows
```batch
deploy.bat
```

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

## Features Included

✅ **Shopping Cart**: Full cart functionality with authentication  
✅ **Price Filters**: Filter products by min/max price range  
✅ **Dark Mode**: Optimized UI with proper text visibility  
✅ **Orders System**: Complete order management  
✅ **User Authentication**: JWT-based security  

## Requirements

- Docker & Docker Compose
- Git
- 4GB+ RAM available for containers

## Troubleshooting

If services fail to start:
```bash
docker-compose -f docker-compose.deploy.yml down
docker system prune -f
./deploy.sh
```
