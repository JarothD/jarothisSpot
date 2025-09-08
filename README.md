# Jarothi's Spot — Full Stack (Java + Spring Boot + React)

Monorepo with **Spring Boot + PostgreSQL + React (Vite + TS)**.
Includes **Swagger/OpenAPI** and **Docker/Compose**.

---

## Requirements

* Docker & Docker Compose
* (Optional for local dev) Java 21, Node 20, Maven/Gradle

## Project Structure

```
.
├─ server/
│  └─ jarothispot/      # Spring Boot API
│     ├─ src/...
│     └─ Dockerfile
├─ client/              # React (Vite)
│  ├─ src/...
│  ├─ Dockerfile
│  └─ nginx.conf
└─ docker-compose.yml
```

## Quick Start (Docker Compose)

```bash
docker compose up -d --build
```

* Web: [http://localhost](http://localhost)
* API: [http://localhost:8080](http://localhost:8080)
* Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
* OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Key env vars (compose)

* `SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/jarothi`
* `SPRING_DATASOURCE_USERNAME=jarothi`
* `SPRING_DATASOURCE_PASSWORD=jarothi`
* `APP_JWT_SECRET=change-me`
* `APP_CORS_ALLOWED_ORIGINS=http://localhost`
* `VITE_API_BASE_URL=http://localhost:8080`

## Docker (manual builds)

**API**

```bash
docker build -t jarothispot-api -f server/jarothispot/Dockerfile server/jarothispot
```

**Web**

```bash
docker build -t jarothispot-web -f client/Dockerfile client
```

## Development (without Docker)

**DB**

```bash
docker run -d --name db \
  -e POSTGRES_DB=jarothi -e POSTGRES_USER=jarothi -e POSTGRES_PASSWORD=jarothi \
  -p 5432:5432 postgres:16
```

**API**

```bash
cd server/jarothispot
./mvnw spring-boot:run   # or ./gradlew bootRun
```

**Web**

```bash
cd client
npm ci && npm run dev  # http://localhost:5173
```

## Swagger / OpenAPI

* UI → `http://localhost:8080/swagger-ui/index.html`
* JSON → `http://localhost:8080/v3/api-docs`
