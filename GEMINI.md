# Ephemeral Client

This project is a web application built with React, Vite, and TypeScript. It uses Material-UI for UI components, TanStack Router for routing, and TanStack Query for data fetching. It also includes Socket.IO for real-time communication.

## Building and Running

### Prerequisites

-   Node.js (>=20.0.0)
-   pnpm

### Development

To start the development server, run:

```bash
pnpm dev
```

This will start the development server on `http://localhost:5173`.

### Building

To build the project for production, run:

```bash
pnpm build
```

This will create a `dist` directory with the production-ready files.

### Previewing the Production Build

To preview the production build, run:

```bash
pnpm preview
```

## Development Conventions

### Code Style

The project uses ESLint to enforce a consistent code style. To run the linter, use:

```bash
pnpm lint
```

### Type Checking

The project uses TypeScript for static type checking. To run the type checker, use:

```bash
pnpm typecheck
```

### Backend Server

The project expects a backend server running on `http://localhost:3000` to handle API requests. The Vite development server is configured to proxy requests to this server.
