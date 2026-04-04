# Stage 1: Vue 빌드
FROM node:24-slim AS web-build
WORKDIR /app/web
COPY apps/web/package*.json ./
RUN npm ci
COPY apps/web/ ./
RUN npm run build

# Stage 2: NestJS 빌드
FROM node:24-slim AS api-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY --from=web-build /app/web/dist ./apps/web/dist
RUN npx nest build api

# Stage 3: 실행 이미지
FROM node:24-slim
WORKDIR /app
COPY --from=api-build /app/dist ./dist
COPY --from=api-build /app/apps/web/dist ./apps/web/dist
COPY --from=api-build /app/node_modules ./node_modules
RUN mkdir -p uploads outputs
CMD ["node", "dist/apps/api/apps/api/src/main"]
