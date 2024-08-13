<div align="center">
 <h1 align="center"><a href="https://api.games.alexgalhardo.com/" target="_blank">api.games.alexgalhardo.com v2</a></h1>
</div>

## Introduction

- A side project I created to learn and improve my skills about how to develop a backend for a micro-saas.

## Technologies
- [NodeJS](https://nodejs.org/en)
- [NestJS](https://nestjs.com/)
- [PrismaORM](https://www.prisma.io/)
- [Docker](https://docs.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## FrontEnd & Docs
- FrontEnd Source Code: <https://github.com/AlexGalhardo/games.alexgalhardo.com>
- Documentation Source code: <https://github.com/AlexGalhardo/docs.games.alexgalhardo.com>
- Docs Live: <https://docs.games.alexgalhardo.com>
- Legacy v1: <https://github.com/AlexGalhardo/legacy.api.nerdapi.com>

## Features
- [x] CRUD API REST
- [x] Authentication (Email & Password, Google & Github)
- [x] Send Emails
- [x] Subscriptions Payments with Webhooks
- [x] Unit Tests using Jest Mocks
- [x] Git Hooks using Husky (pre-commit and pre-push)
- [x] Following clean architecture principles (use-case, repositories, dependency injection, IoC, etc)
- [x] CI/CD using Github Actions (linter, tests, build)
- [x] Middlewares to verify authentication & authorization
- [x] Migrations & Seeds & Database GUI
- [x] Swagger OpenAPI Specification v3 Documentation
- [x] Multi tenant (single database, shared schema)
- [x] Logs & Monitoring
- [x] Zod validation for payload requests
- [x] Security configs (rate-limiter, cors, exception errors handlers, etc)
- [ ] Git tags for releases
- [ ] Integration tests
- [ ] Healthcheck endpoint (databases conections, memory usage, etc)

## Development Setup Local

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/api.games.alexgalhardo.com.git
```

2. Enter repository
```bash
cd api.games.alexgalhardo.com/
```

3. Install dependencies
```bash
npm install
```

4. Setup your environment variables
```bash
cp .env.example .env
```

5. Create Migrations and Seeds
```bash
chmod +x setup.sh && ./setup.sh
```

6. To Start Prisma Studio:
```bash
npm run prisma:studio
```

7. Start local server
```bash
npm run dev
```

## Build
a. Creating build
```bash
npm run build
```

b. Testing build server locally
```bash
npm run start
```

## Tests

a. Run all unit tests
```bash
npm run test
```

## API Requests

- You can see the HTTP Requests references inside folder [rest-client/](rest-client/)
- You can also see Swagger API documentation in:
   - Localhost: <http://localhost:3000/api>
   - Live: <https://api.games.alexgalhardo.com/api>

## Documentation
- Read and add usefull documentation (markdown, notes, images, best practices, etc) about this project inside folder [docs/](docs/)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2023-present, [Alex Galhardo](https://github.com/AlexGalhardo)
