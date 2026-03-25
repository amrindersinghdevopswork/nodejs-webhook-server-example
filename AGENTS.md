# AGENTS.md - Development Guidelines for This Repository

## Project Overview

This is a Node.js/TypeScript webhook server built with Express. It receives and processes webhooks from various providers (Stripe, PayPal, GitHub, Shopify, etc.) and handles signature verification.

## Commands

### Development
- `npm run dev` or `npm start` - Start the development server using vite-node
- Server runs on `localhost:1337` by default (configurable via PORT env var)

### Building
- `npx tsc` - Compile TypeScript to JavaScript (output in `./dist`)

### Testing
- **No test framework is currently configured.** To add tests, consider using Jest or Vitest.
- Running a single test (once configured): `npm test -- --testPathPattern=<pattern>`

### Linting
- **No linter is currently configured.** Consider adding ESLint with the TypeScript ESLint parser.

## Code Style Guidelines

### General Principles
- Write clean, readable code with descriptive variable names
- Keep functions focused and small (under 50 lines when possible)
- Use early returns to avoid deep nesting

### TypeScript
- Use explicit return types for public functions
- Avoid `any` type - use `unknown` or proper types instead
- Enable strict mode in tsconfig.json for new code (`"strict": true`)
- Use interfaces for object shapes, types for unions/intersections

### Imports
- Use ES module syntax (`import x from "y"`)
- Group imports: external libs, then relative imports
- Use absolute paths for node_modules, relative for local files
- Example:
  ```typescript
  import express from "express";
  import bodyParser from "body-parser";
  import routes from "./routes";
  import { helper } from "./utils";
  ```

### Naming Conventions
- **Variables/functions**: camelCase (e.g., `getUserData`, `isValid`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase otherwise
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `WebhookPayload`)
- **Files**: kebab-case (e.g., `webhook-handler.ts`)
- **Routes**: kebab-case with descriptive paths (e.g., `/stripe-webhooks-endpoint`)

### Formatting
- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Add trailing commas in multiline objects/arrays
- Maximum line length: 100 characters
- Use template literals for string interpolation

### Error Handling
- Use try/catch for async operations
- Log errors with context before re-throwing or sending response
- Return appropriate HTTP status codes (400 for bad request, 401 for unauthorized, 500 for server errors)
- Always send a response (never leave request hanging)

### Security
- Never log sensitive data (API keys, secrets, passwords)
- Verify webhook signatures before processing payloads
- Keep secrets in environment variables, never hardcode
- Validate all incoming request data

### Logging
- Use `console.log` for general info, `console.error` for errors
- Include relevant context in log messages
- Use emoji prefixes sparingly for readability in development only

### Express Patterns
- Use middleware for cross-cutting concerns (signature verification, body parsing)
- Keep route handlers thin - delegate logic to service functions
- Use proper typing for Request/Response objects

## Environment Variables

Create a `.env` file with:
```
PORT=1337
VITE_HOOKDECK_SIGNING_SECRET=your_secret_here
VITE_SHOPIFY_WEBHOOK_SECRET=your_shopify_secret
VITE_MSG91_API_KEY=your_msg91_key
VITE_MSG91_ROUTE=4
```

## File Structure

```
src/
  server.ts       # Main Express app entry point
  routes.ts       # All webhook endpoints and handlers
types/
  express.d.ts    # Type augmentations
  vite-env.d.ts   # Vite type definitions
```

## Important Notes

- Webhook signature verification is currently disabled in testing mode (`verifyHookdeckSignature` in routes.ts)
- The server uses raw body preservation for signature verification
- All endpoints use POST method except the root GET route