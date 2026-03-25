FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=0 /app/node_modules ./node_modules

COPY tsconfig.json ./
COPY src/ ./src/
COPY types/ ./types/
COPY dist/ ./dist/ 2>/dev/null || true

RUN npm run build || npx tsc

EXPOSE 1337

ENV NODE_ENV=production
ENV PORT=1337

CMD ["node", "dist/server.js"]
