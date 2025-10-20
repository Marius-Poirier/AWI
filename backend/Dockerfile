# --- Étape 1 : Build TypeScript ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
COPY db ./db
RUN npx tsc -p tsconfig.json --pretty false --noEmitOnError false && \
echo "Compilation TS terminée" && \
ls -la dist && \
ls -la dist/src || true
# --- Étape 2 : Exécution en production ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/db ./db
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node", "dist/src/server.js"]