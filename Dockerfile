# Stage 1: Build the TypeScript code
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first to cache them
COPY package*.json ./

# Install ALL dependencies (including devDependencies like typescript)
RUN npm ci

# Copy source code and necessary tsconfig
COPY tsconfig.json ./
COPY src/ ./src/
COPY types/ ./types/

# Compile TypeScript to JavaScript in the ./dist folder
RUN npx tsc

# Stage 2: Create the minimal production image
FROM node:20-alpine

WORKDIR /app

# Copy package info
COPY package*.json ./

# Install ONLY production dependencies to keep image small
RUN npm ci --omit=dev

# Copy the compiled JS from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 1337

ENV NODE_ENV=production
ENV PORT=1337

# Run the compiled server
CMD ["node", "dist/server.js"]
