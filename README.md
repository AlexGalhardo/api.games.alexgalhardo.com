<div align="center">
		<h1 align="center"><a href="https://api.nerdapi.com/" target="_blank">api.nerdapi.com v2</a></h1>
</div>

## Introduction

- Backend REST API for <https://nerdapi.com>
- I created this project to learn how to program a backend for a micro SaaS product.

## Technologies & Tools
- [x] NestJS
- [x] Typescript
- [x] Docker
- [x] PrismaORM
- [x] PostgreSQL & JSON Database
- [x] Fastify
- [x] JWT
- [x] Prettier
- [x] Jest
- [x] Stripe Subscription Checkout API Integration
- [x] Weebhooks listening to Stripe events
- [x] Resend for emails
- [x] Zod to validate payloads inputs
- [x] Husky Git Hook
- [x] Github Actions for CI/CD

## Features
- [x] Stateless Authentication & Authorization using JWT
- [x] Social Login Authentication (Github & Google)
- [x] Clean/Hexagonal Architecture Principles (ports, useCases, repositories, etc)
- [x] Unit Tests using mocks
- [x] Integration tests using supertest
- [x] Telegram Logger
- [x] Migrations & Seeders
- [x] API Rate Limiter & Throttler
- [x] Web Security Policies (CORs, Helmet, etc)
- [x] Swagger API Documentation
- [x] API Authentication using API Keys
- [x] Email service for contact and payment transactions

## FrontEnd & Docs
- FrontEnd Source Code: <https://github.com/AlexGalhardo/nerdapi.com>
- Documentation Source code: <https://github.com/AlexGalhardo/docs.nerdapi.com>
- Docs Live: <https://docs.nerdapi.com>
- Legacy v1: <https://github.com/AlexGalhardo/legacy.api.nerdapi.com>

## Development Setup Local

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/api.nerdapi.com.git
```

2. Enter repository
```bash
cd api.nerdapi.com/
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

a. Run all tests
```bash
npm run test
```

## API Requests

- You can see the HTTP Requests references inside folder **rest-client/**
- You can also see Swagger API documentation in: <http://localhost:3000/api>

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) August 2023-present, [Alex Galhardo](https://github.com/AlexGalhardo)
