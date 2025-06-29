# GitHub Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

## Project Overview

This is a monorepo containing multiple services for digonto.in - a personal portfolio website with experimental 3D projects and a microservices backend.

### Services Structure

1. **web/** - Main Next.js 15 frontend (React 19) with portfolio, blog, and experiments
2. **bostro-web/** - Separate Next.js app for the Bostro project
3. **gateway/** - Node.js/Hono API gateway with PostgreSQL database and WebSocket server
4. **engine/** - C++ engine compilable to WebAssembly and Windows native
5. **nginx/** - Reverse proxy configuration

## Development Context

### Frontend Stack (web/ & bostro-web/)

- **Framework**: Next.js 15 with App Router and TypeScript
- **UI Libraries**: Material-UI, TailwindCSS
- **3D Graphics**: Three.js with React Three Fiber
- **Content**: MDX for blog posts in `web/src/markdown/`
- **Experiments**: Located in `web/src/app/experiment/`

### Backend Stack (gateway/)

- **Server**: Hono with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **WebSocket**: Node.js WebSocket Server (ws library) for real-time features
- **Architecture**: Modular design with entities in `src/db/entities/`
- **API**: RESTful modules in `src/modules/`

### Infrastructure

- **Development**: Docker Compose with hot reloading
- **Production**: Kubernetes/Helm charts
- **Cloud**: AWS (EC2, ECR, Route53) via Terraform
- **Proxy**: Nginx for reverse proxy and SSL termination

## Code Generation Guidelines

### TypeScript Standards

- Always use strict TypeScript with proper type definitions
- Prefer interfaces over types for object shapes
- Use generics for reusable components and utilities
- Import types with `import type` when possible

### Frontend Development Patterns

```typescript
// Component structure example
import { FC } from 'react';
interface Props {
  // Define props with proper types
}
export const ComponentName: FC<Props> = ({ prop }) => {
  // Component logic with hooks
  return (
    // JSX with proper styling classes
  );
};
```

### Backend Development Patterns

```typescript
// Hono route example
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const schema = z.object({
  // Define schema with Zod
});

app.post("/api/endpoint", zValidator("json", schema), async (c) => {
  const data = c.req.valid("json");
  // Route handler logic
  return c.json({ success: true });
});
```

### WebSocket Patterns

```typescript
// WebSocket server setup with ws library
import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, request: IncomingMessage) => {
  ws.on("message", (data) => {
    // Handle incoming messages
    const message = JSON.parse(data.toString());
    // Process message and send response
    ws.send(JSON.stringify({ type: "response", data: result }));
  });

  ws.on("close", () => {
    // Cleanup on disconnect
  });
});
```

### Database Patterns

- Use Drizzle ORM for database operations
- Define schemas in `gateway/src/db/schema/`
- Use transactions for complex operations
- Follow proper migration practices

### Testing Approach

- Frontend: Jest with React Testing Library
- Backend: Vitest with coverage reporting
- Write unit tests for components and utilities
- Integration tests for API endpoints

## UI/UX Guidelines

### Interactive Design Requirements

When generating UI components, always include:

1. **Hover Effects**

   - Smooth transitions (200-300ms duration)
   - Visual feedback (color changes, transforms, shadows)
   - Gradient effects for premium feel

2. **Micro-animations**

   - Logo/icon interactions on hover (rotate, scale)
   - Subtle transform effects on clickable elements
   - Animated underlines and borders

3. **Glassmorphic Effects**
   - backdrop-filter for blur and saturation
   - Semi-transparent backgrounds with proper contrast
   - Layered shadows and borders for depth

### Example Animation Patterns

```css
/* Hover transition example */
.interactive-element {
  transition: all 0.3s ease;
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animated underline */
.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

### Design References

When creating frontend components, reference these sites for inspiration:

- **https://blog.maximeheckel.com** - Modern blog design and typography
- **https://maximeheckel.com** - Creative portfolio interactions
- **https://www.joshwcomeau.com** - Playful educational design patterns

## Common Commands & Scripts

### Development

```bash
# Start full development environment
./dev.sh

# Frontend development
cd web && npm run dev

# Backend development
cd gateway && npm run dev

# Run tests
./devtest.sh
```

### Database Operations

```bash
cd gateway
npm run migrate        # Run migrations
npm run db:studio     # Open database GUI
npm run db:generate   # Generate migration files
```

### Build & Deploy

```bash
# Build for production
npm run build

# Run CI tests
./citest.sh

# Docker operations
docker-compose -f compose.dev.yaml up
```

## File Organization

### Web Frontend Structure

```
web/src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── lib/                # Utility functions
├── styles/             # Global styles and themes
├── markdown/           # MDX blog content
└── experiments/        # 3D and interactive experiments
```

### Gateway Backend Structure

```
gateway/src/
├── app/                # Hono app setup and configuration
├── db/                 # Database schema and ORM
├── middleware/         # Hono middleware
├── modules/            # Feature modules and API routes
├── server/             # WebSocket server and connection logic
└── utils/              # Helper utilities
```

## Error Handling Patterns

### Frontend Error Boundaries

```typescript
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

// Usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Component />
</ErrorBoundary>;
```

### Backend Error Handling

```typescript
// Custom error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Hono error handling middleware
app.onError((err, c) => {
  if (err instanceof ValidationError) {
    return c.json({ error: err.message }, 400);
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

// WebSocket error handling
ws.on("error", (error) => {
  console.error("WebSocket error:", error);
  ws.close(1000, "Server error");
});
```

## Performance Considerations

### Frontend Optimization

- Use React.memo for expensive components
- Implement proper loading states
- Optimize images with Next.js Image component
- Code splitting with dynamic imports

### Backend Optimization

- Use database indexes appropriately
- Implement caching where beneficial
- Use connection pooling for database connections
- Monitor memory usage and connection cleanup in WebSocket server
- Use Hono's built-in performance optimizations

## Security Guidelines

### Frontend Security

- Sanitize user inputs
- Use HTTPS in production
- Implement proper CSP headers
- Validate data at component boundaries

### Backend Security

- Input validation with Zod schemas and Hono validators
- Rate limiting on API endpoints using Hono middleware
- Proper authentication/authorization with Hono context
- Secure WebSocket connections with proper origin validation
- Use Hono's built-in security middleware

Remember to follow these guidelines when generating code suggestions and completions for this repository.
