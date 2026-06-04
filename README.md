# Farland Holidays

## Prerequisites
- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- That's it. No Node.js or npm required locally.

## Development (with hot reload)
```bash
docker-compose up dev
```
Open http://localhost:5173

## Production Build
```bash
docker-compose up prod
```
Open http://localhost:80

## Rebuild after installing new packages
```bash
docker-compose build dev
docker-compose up dev
```

## Stop containers
```bash
docker-compose down
```
