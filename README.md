<div align="center">
 <h1 align="center"><a href="https://api.games.alexgalhardo.com/" target="_blank">api.games.alexgalhardo.com v2</a></h1>
</div>

## Introduction

- A side project I created to learn and improve my skills in:
   - Clean/Hexagonal Architecture Principles (ports, useCases, repositories, etc)
   - Stateless Authentication & Authorization using JWT
   - API (REST) development and documentation
   - Tests (Unit, integration, TDD, etc)
   - Web Scrapping
   - API Requests Handling & Limit & Quota
   - SaaS (Software as a Service) Backend Development
   - And so on
- This project use 2 databases:
   - JSONs files for simplicity and fast development.
   - PostgresSQL using PrismaORM (migrations, seeds, prisma studio) and Docker

## FrontEnd & Docs
- FrontEnd Source Code: <https://github.com/AlexGalhardo/games.alexgalhardo.com>
- Documentation Source code: <https://github.com/AlexGalhardo/docs.games.alexgalhardo.com>
- Docs Live: <https://docs.games.alexgalhardo.com>
- Legacy v1: <https://github.com/AlexGalhardo/legacy.api.nerdapi.com>

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
