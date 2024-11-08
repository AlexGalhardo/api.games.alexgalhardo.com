<h1 align="center"><a href="https://api.games.alexgalhardo.com" target="_blank">api.games.alexgalhardo.com</a></h1>

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
- [x] OpenAPI Specification Swagger v3 Documentation
- [x] Multi tenant (single database, shared schema)
- [x] Logs & Monitoring
- [x] Zod validation for payload requests
- [x] Security configs (rate-limiter, cors, exception errors handlers, etc)
- [ ] Git tags for releases
- [ ] Integration tests
- [x] Healthcheck endpoint (databases conections, memory usage, etc)

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
   - Generating JWE Public and Private Keys:
      - Install Bun: <https://bun.sh/>
	  - Run command: `npm run generate:jwe:keys`

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

## Error Logs
- If you wanna use Errosole, enable `ENABLE_ERRSOLE=true` on your `.env` file
- Then, you can see [Errsole Web Dashboard](https://github.com/errsole) on <http://localhost:3000/errsole>

## API Requests

- You can see the HTTP Requests references inside folder [rest-client/](rest-client/)
- You can also see  API documentation in:
   - Localhost: <http://localhost:3000/docs>
   - Live: <https://api.games.alexgalhardo.com/docs>

## Documentation
- Read and add usefull documentation (markdown, notes, images, best practices, etc) about this project inside folder [docs/](docs/)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2023-present, [Alex Galhardo](https://github.com/AlexGalhardo)
