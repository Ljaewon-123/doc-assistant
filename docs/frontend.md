# 프론트엔드 스펙 & 아키텍처

## 기술 선택 결론

| 항목 | 선택 | 배제 | 배제 이유 |
|------|------|------|-----------|
| FE 프레임워크 | **Vue 3 + Vite (SPA)** | Nuxt 4 | SSR/SEO 불필요, 컨테이너 추가 비용 |
| HTTP 클라이언트 | **ofetch** | axios | 2026-03-30 공급망 공격 (악성코드 배포) |
| 서빙 방식 | **NestJS ServeStaticModule** | 별도 nginx | 단일 컨테이너 유지 |

---

## FE 기능 명세

1. **문서 목록** — 업로드된 문서 카드 목록, 삭제 버튼
2. **드래그앤드랍 업로드** — 파일 드래그 or 버튼 클릭 → `POST /documents/upload`
3. **채팅 UI** — 선택한 문서에 대해 질문/답변 (대화 내용 비저장, 페이지 새로고침 시 초기화)

---

## 디렉토리 구조

`apps/web/`은 NestJS 모노레포(nest-cli.json) 밖의 독립 Vite 프로젝트.

```
apps/web/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── components/
│   │   ├── DocumentList.vue     ← GET /documents 목록 표시 + 삭제
│   │   ├── UploadZone.vue       ← 드래그앤드랍 + 버튼 업로드
│   │   └── ChatPanel.vue        ← 채팅 UI (비저장)
│   └── api/
│       └── client.ts            ← ofetch 래퍼
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## API 클라이언트 패턴

```typescript
// apps/web/src/api/client.ts
import { $fetch } from 'ofetch'

export const api = $fetch.create({
  baseURL: '/api',
})

// 파일 업로드: FormData를 body에 직접 전달 (ofetch가 Content-Type 자동 처리)
export async function uploadDocument(file: File) {
  const form = new FormData()
  form.append('file', file)
  return api<DocumentDto>('/documents/upload', { method: 'POST', body: form })
}
```

---

## 개발 환경 vs 프로덕션 서빙

### 로컬 개발

```
Vite dev server (port 5173)  ←→  NestJS API (port 3000)
```

- Vite는 `/api` 경로를 NestJS로 프록시
- `vite.config.ts`에 proxy 설정:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
```

- NestJS에는 CORS 허용 (개발 시):

```typescript
// main.ts
app.enableCors({ origin: 'http://localhost:5173' })
```

### 프로덕션 (Docker)

```
npm run build (apps/web/) → dist/
NestJS ServeStaticModule → dist/ 서빙
모든 트래픽 → port 3000 단일 진입점
```

```typescript
// app.module.ts
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', '..', '..', 'apps', 'web', 'dist'),
  exclude: ['/api/{*splat}', '/health'],
  renderPath: '/{*splat}',   // SPA fallback (Vue Router history mode)
})
```

---

## Docker 단일 컨테이너 전략

멀티스테이지 빌드로 Vue 빌드 결과물을 NestJS 이미지에 포함.

```dockerfile
# Stage 1: Vue 빌드
FROM node:24-alpine AS web-build
WORKDIR /app/web
COPY apps/web/package*.json ./
RUN npm ci
COPY apps/web/ ./
RUN npm run build

# Stage 2: NestJS 빌드
FROM node:24-alpine AS api-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY --from=web-build /app/web/dist ./apps/web/dist
RUN npx nest build api

# Stage 3: 실행 이미지
FROM node:24-alpine
WORKDIR /app
COPY --from=api-build /app/dist ./dist
COPY --from=api-build /app/apps/web/dist ./apps/web/dist
COPY --from=api-build /app/node_modules ./node_modules
CMD ["node", "dist/apps/api/main"]
```

### docker-compose 서비스 추가 (Phase 5 Step 23)

```yaml
services:
  postgres:          # 기존 유지
    ...
  api:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - postgres
    volumes:
      - uploads:/app/uploads
      - outputs:/app/outputs
volumes:
  pgdata:
  uploads:
  outputs:
```

---

## 금지 사항

- axios 사용 금지 (공급망 공격 이력)
- Nuxt 사용 금지 (오버킬, 컨테이너 추가)
- NestJS 모노레포(nest-cli.json)에 web 프로젝트 등록 금지 (독립 Vite 프로젝트 유지)
- 채팅 대화 내용을 DB에 저장 금지 (비저장 정책)
