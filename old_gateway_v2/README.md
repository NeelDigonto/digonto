# Gateway Service

State-of-the-art TypeScript API gateway built with Hono, featuring OAuth authentication, session management, and comprehensive observability.

## Features

- 🚀 **Hono Framework** - Ultra-fast web framework
- 🔐 **OAuth 2.0** - Support for Google, GitHub, and more
- 🍪 **Secure Sessions** - HTTPS-only session management
- 📊 **Observability** - OpenTelemetry tracing and Prometheus metrics
- 🗄️ **PostgreSQL** - With MikroORM and migrations
- ✅ **Testing** - Integration and E2E tests with Vitest
- 🏗️ **Type-Safe** - Full TypeScript with strict mode
- 📝 **Validation** - Request/response validation with Zod
- 🔍 **Logging** - Structured logging with Pino

## Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 14
- npm or pnpm

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your OAuth providers in `.env`

4. Run database migrations:
```bash
npm run migrate
```

## Development

```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Check types
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format:write
```

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user
- `GET /api/auth/providers` - List OAuth providers
- `GET /api/auth/oauth/:provider` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback
- `POST /api/auth/logout` - Logout user

### System
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

## Project Structure

```
src/
├── app.ts              # Hono app configuration
├── index.ts            # Server entry point
├── config/             # Configuration files
│   └── env.ts          # Environment validation
├── db/                 # Database layer
│   ├── entities/       # MikroORM entities
│   ├── migrations/     # Database migrations
│   └── database.ts     # Database connection
├── middleware/         # Hono middleware
│   ├── auth.ts         # Authentication
│   ├── metrics.ts      # Prometheus metrics
│   └── request-context.ts # Request context
├── routes/             # API routes
│   └── auth.routes.ts  # Authentication routes
├── services/           # Business logic
│   ├── oauth.service.ts    # OAuth handling
│   └── session.service.ts  # Session management
└── utils/              # Utilities
    ├── logger.ts       # Pino logger
    └── telemetry.ts    # OpenTelemetry
```

## Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Docker

```bash
# Build image
docker build -t gateway .

# Run container
docker run -p 4000:4000 --env-file .env gateway
```

## Environment Variables

See `.env.example` for all available options. Key variables:

- `NODE_ENV` - Environment (development/test/production)
- `PORT` - Server port (default: 4000)
- `POSTGRES_*` - Database configuration
- `SESSION_SECRET` - Session signing secret (min 32 chars)
- `GOOGLE_CLIENT_*` - Google OAuth credentials
- `GITHUB_CLIENT_*` - GitHub OAuth credentials
- `OTEL_EXPORTER_*` - OpenTelemetry configuration