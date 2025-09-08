@echo off
echo 🚀 JarothiSpot Production Deployment
echo ====================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Create .env if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.sample .env >nul
    echo ✅ .env file created. Edit it if needed before continuing.
) else (
    echo ✅ .env file already exists.
)

REM Check for required images
echo 🔍 Checking for required images...
docker images | findstr "jarothisspot-server.*latest" >nul
if %errorlevel% neq 0 (
    echo 🏗️  Building images from source...
    docker compose build
    echo ✅ Images built successfully.
) else (
    echo ✅ Images already exist.
)

REM Deploy
echo 🚀 Starting deployment...
docker compose -f docker-compose.deploy.yml up -d

REM Wait for health checks
echo ⏳ Waiting for services to be healthy...
ping 127.0.0.1 -n 11 >nul

REM Check status
echo 📊 Checking service status...
docker compose -f docker-compose.deploy.yml ps

echo.
echo 🎉 Deployment complete!
echo.
echo 📱 Access your application:
echo    Web App: http://localhost
echo    API: http://localhost:8080
echo    Swagger: http://localhost:8080/swagger-ui.html
echo.
echo 👤 Default admin credentials:
echo    Email: admin@example.com
echo    Password: Admin#123456
echo.
echo 🛠️  Useful commands:
echo    View logs: docker compose -f docker-compose.deploy.yml logs -f
echo    Stop: docker compose -f docker-compose.deploy.yml down
echo    Reset: docker compose -f docker-compose.deploy.yml down -v
echo.
pause
