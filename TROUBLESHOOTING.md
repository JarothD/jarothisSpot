# Troubleshooting

### Ports already in use
Change the host ports in `docker-compose.deploy.yml`:
```yaml
  api:
    ports: ["8081:8080"]
  client:
    ports: ["8082:80"]
```

### Admin seeder errors (password null)
Ensure `.env` contains valid values:
```env
APP_ADMIN_EMAIL=admin@example.com
APP_ADMIN_PASSWORD=Admin#123456
```

### Database not ready
The API waits for Postgres health. If startup loops, check DB logs:
```bash
docker compose -f docker-compose.deploy.yml logs db
```

### CORS issues
Client runs at `http://localhost` and API at `http://localhost:8080`. If you changed ports/hostnames, update backend CORS or put a reverse proxy in front.

### Reset database
This removes the Postgres volume:
```bash
docker compose -f docker-compose.deploy.yml down -v
```

### Slow first load
The DB initializes on first run; subsequent restarts are faster.
