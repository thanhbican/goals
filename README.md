# Personal Goals

Personal Goals is a personal learning project for experimenting with real-time application development in a Turborepo monorepo. The project includes a Vue 3 client, an Express API, Socket.IO-based real-time features, and MongoDB persistence.

## Disclaimer

This project is a personal learning project created to experiment with Socket.IO, WebSocket, and real-time application development. Although it may be inspired by roulette-style concepts, it is not designed, promoted, or intended for real-money gambling, commercial operation, or any malicious purpose.

## Monorepo Structure

```text
apps/
  client/    Vue 3 application powered by Vite
  server/    Express API and Socket.IO server
packages/
  eslint-config/        Shared ESLint configuration
  typescript-config/    Shared TypeScript configuration
  ui/                   Shared UI package
deploy/                 Docker and Nginx deployment notes
```

## Tech Stack

### Client

- Vue 3
- TypeScript
- Vite
- Pinia
- Socket.IO Client
- Tailwind CSS and DaisyUI

### Server

- Node.js
- Express
- TypeScript
- Socket.IO
- MongoDB and Mongoose
- JWT-based authentication

### Tooling

- pnpm workspaces
- Turborepo
- Prettier
- ESLint
- Docker Compose

## Getting Started

### Requirements

- Node.js 18 or newer
- pnpm 9
- MongoDB

### Environment Variables

Create environment files from the examples:

```bash
cp apps/client/.env.example apps/client/.env
cp apps/server/.env.example apps/server/.env
```

Default local values:

- Client API: `http://localhost:3000/api`
- Client Socket.IO URL: `http://localhost:3000/`
- Server URL: `http://localhost:3000`
- Client URL: `http://localhost:4000`
- MongoDB: `mongodb://127.0.0.1:27017/goals`

### Install Dependencies

Run from the repository root:

```bash
pnpm install
```

### Start Development Servers

Run both the client and server:

```bash
pnpm dev
```

The server runs on port `3000`. The Vite client uses its configured development port.

## Available Scripts

Run these commands from the repository root:

```bash
pnpm dev      # Start all development services through Turborepo
pnpm build    # Build all packages and applications
pnpm lint     # Run lint tasks through Turborepo
pnpm format   # Format TypeScript, TSX, and Markdown files
```

## Deployment

Docker Compose and Nginx deployment notes are available in [deploy/README.md](deploy/README.md).
