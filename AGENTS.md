# AGENTS.md - Development Guide

This document provides guidelines for AI agents working on this codebase.

## Project Overview

This is a React 18 + TypeScript + Vite application using:
- **TanStack Router** for routing
- **TanStack Query (React Query)** for data fetching
- **MUI Joy** for UI components
- **Formik + Yup** for form handling
- **GSAP** for animations
- **Socket.IO** for real-time communication

## Build Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server with hot reload
pnpm dev

# Production build
pnpm build

# Preview production build locally
pnpm preview

# Type check only (no build)
pnpm typecheck

# Lint with ESLint
pnpm lint
```

**No test framework is currently configured** - if adding tests, set up Vitest or React Testing Library.

## Code Style Guidelines

### TypeScript

- Use strict mode enabled (`tsconfig.json`)
- All code must be type-safe with no `any` (use `unknown` or specific types instead)
- Use explicit types for function parameters and return values
- Enable `verbatimModuleSyntax` - use explicit imports/exports

### Imports

- Use path aliases: `@/*` maps to `src/*` (e.g., `@/components/auth/LoginForm`)
- React imports: `import React from "react"` (not React 17+ automatic JSX)
- Group imports in this order:
  1. React and framework imports
  2. Third-party library imports
  3. Path alias imports (`@/...`)
  4. Relative imports

```tsx
import React from "react";
import { useState } from "react";
import { Box, Button } from "@mui/joy";
import { useNavigate } from "@tanstack/react-router";
import { useLogin } from "@/hooks/useAuth";
import "./LoginForm.css";
```

### Naming Conventions

- **Components**: PascalCase (`LoginForm`, `ConnectionRequests`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `usePosts`)
- **Variables/functions**: camelCase (`userList`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE or camelCase for config objects
- **Files**: kebab-case for non-component files (`socket-utils.ts`, `api-client.ts`)
- **Interfaces**: PascalCase with no `I` prefix (`LoginFormValues`)

### React Patterns

- Use functional components with hooks
- Use `useMutation` from TanStack Query for POST/PUT/DELETE operations
- Use `useQuery` for data fetching with proper keys
- Destructure props with explicit types
- Use `tsx` extension for components, `ts` for utilities

```tsx
interface Props {
  onClose: () => void;
  userId: string;
}

export function Component({ onClose, userId }: Props) {
  const { data } = useQuery({ queryKey: ["user", userId], ... });
}
```

### Error Handling

- Use try/catch with async/await
- For mutations, use `onError` callback to handle failures
- Display error states in UI (use MUI Joy error colors)
- Log errors appropriately for debugging

### Form Handling

- Use Formik for form state management
- Use Yup for validation schemas
- Define interfaces for form values (`LoginFormValues`)
- Show validation errors inline using `ErrorMessage` component

### CSS/Styling

- Use MUI Joy components with their styling system
- Use `sx` prop for component-level styling
- Use theme tokens (`primary.solidBg`, `colors.danger.500`)
- Global styles in `src/styles/globals.css`
- Animations in `src/styles/animations.css`

### Directory Structure

```
src/
├── components/     # Reusable UI components (grouped by feature)
│   ├── auth/       # Authentication components
│   ├── feed/       # Feed-related components
│   ├── messages/   # Messaging components
│   └── ...
├── hooks/          # Custom React hooks
├── routes/         # TanStack Router route files
├── services/       # API and service layers
│   └── api/        # API endpoint definitions
└── styles/         # Global CSS and animations
```

### ESLint Rules

- Unused variables: Error (except `_` or `A-Z` prefixed)
- React hooks rules enforced
- TanStack Query plugin recommended

### API Integration

- Use `api-client.ts` for Axios instance configuration
- Define API functions in `services/api/*.api.ts`
- Use TanStack Query hooks from `api-hooks.ts` for data fetching
- Handle authentication tokens via `token-service.ts`

## Environment Variables

- API proxy configured in `vite.config.ts` (proxies `/api` to `localhost:3000`)
- Access env vars via `import.meta.env.VARIABLE_NAME`
- Use `import.meta.env.DEV` for dev-only code

## Development Notes

- Router code splitting enabled via TanStack Router
- API routes follow pattern: `_app.{feature}.tsx` for protected routes
- Socket connection managed via `SocketProvider` context
- Theme configuration in `main.tsx` with light/dark mode support
