# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing multiple services for digonto.in - a personal portfolio website with experimental 3D projects and a microservices backend.

### Services

1. **web/** - Main Next.js 15 frontend (React 19) with portfolio, blog, and experiments
2. **bostro-web/** - Separate Next.js app for the Bostro project  
3. **gateway/** - Node.js/Fastify API gateway with PostgreSQL database
4. **engine/** - C++ engine compilable to WebAssembly and Windows native
5. **nginx/** - Reverse proxy configuration

## Common Development Commands

### Quick Start
```bash
# Start full development environment
./dev.sh

# Run tests
./devtest.sh
```

### Frontend Development (web/ or bostro-web/)
```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Run linting
```

### Backend Development (gateway/)
```bash
npm run dev           # Development with hot reload
npm run migrate       # Run database migrations
npm test             # Run tests
npm run coverage     # Test coverage
npm run lint:fix     # Fix linting issues
npm run format:write # Format code
```

### C++ Engine (engine/)
```bash
./wasm.bat    # Build WebAssembly version
./win.bat     # Build Windows version
```

## Architecture Overview

### Frontend Architecture
- **Next.js App Router** with TypeScript
- **Three.js/React Three Fiber** for 3D experiments
- **MDX** for blog posts in `web/src/markdown/`
- **Material-UI** and **TailwindCSS** for styling
- Experiments live in `web/src/app/experiment/`

### Backend Architecture
- **Fastify** server with modular architecture
- **MikroORM** with PostgreSQL for persistence
- Database entities in `gateway/src/db/entities/`
- GraphQL-style modules in `gateway/src/modules/`

### Infrastructure
- **Docker Compose** for local development
- **Kubernetes/Helm** charts for production
- **AWS** deployment via Terraform (EC2, ECR, Route53)
- SSL certificates via Let's Encrypt

## Key Development Patterns

### Database Migrations
Migrations are managed via MikroORM in the gateway service:
```bash
cd gateway
npm run migrate
```

### Testing
- Frontend tests use Jest with React Testing Library
- Backend tests use Jest with coverage reporting
- Run CI tests with `./citest.sh`

### Docker Development
The `compose.dev.yaml` orchestrates all services with hot reloading:
- Web on port 3000
- Gateway on port 4000  
- PostgreSQL on port 5432
- Nginx proxy on port 8080

### Environment Variables
Required for gateway service:
- `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `NODE_ENV` (dev/test/production)

## UI/UX Development Guidelines

### Interactive Design Patterns
When creating or updating UI components, always include interactive gestures and hover effects:

1. **Hover Effects**
   - Add smooth transitions (200-300ms) for all interactive elements
   - Include visual feedback like color changes, transforms, or underlines
   - Use gradient effects for premium feel (e.g., gradient underlines on nav links)

2. **Micro-animations**
   - Logo/icon rotation and scale on hover
   - Subtle translate effects on clickable elements
   - Animated underlines that expand on hover

3. **Glassmorphic Effects**
   - Use backdrop-filter for blur and saturation
   - Semi-transparent backgrounds with proper contrast
   - Subtle shadows and borders for depth

4. **Example patterns from this codebase**:
   - Header: Logo rotates and scales on hover, nav links have animated gradient underlines
   - Buttons: Background color change with rounded corners
   - Links: Color transitions and animated underlines

### Design Inspiration Sources
When creating frontend components, styles, and pages, refer to these websites for artistic and stylistic inspiration:
- **https://blog.maximeheckel.com** - Modern blog design with excellent typography and animations
- **https://maximeheckel.com** - Portfolio with creative interactions and visual effects
- **https://www.joshwcomeau.com** - Playful, educational design with delightful micro-interactions