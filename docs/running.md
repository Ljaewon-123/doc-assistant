# 실행 방법

## 사전 준비

1. `.env` 파일 생성 (`.env.example` 참고)
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   LLM_MODEL=claude-haiku-4-5-20251001
   DATABASE_URL=postgresql://docassist:docassist@localhost:5432/doc_assistant
   PORT=3000
   UPLOAD_DIR=./uploads
   OUTPUT_DIR=./outputs
   EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2
   EMBEDDING_DIMENSION=384
   CHUNK_SIZE=1000
   CHUNK_OVERLAP=200
   ```

2. Node.js v24+ 설치 확인

---

## 개발 환경

터미널 3개를 열고 각각 실행.

```bash
# 1. PostgreSQL 시작
docker compose up -d

# 2. NestJS API 서버 (port 3000, hot-reload)
nest start api --watch

# 3. Vue 개발 서버 (port 5173, /api → 3000 프록시)
cd apps/web && npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

> Swagger UI: `http://localhost:3000/api-docs`

---

## 프로덕션 (Docker 단일 컨테이너)

```bash
# 빌드 + 실행
docker compose up --build

# 이후 재실행 (이미 빌드된 경우)
docker compose up
```

브라우저에서 `http://localhost:3000` 접속.

> Vue 빌드 결과물을 NestJS가 정적 파일로 서빙하므로 포트가 3000 하나.

---

## 종료

```bash
docker compose down          # PostgreSQL(개발) 또는 api+PostgreSQL(프로덕션) 종료
```

데이터 볼륨까지 삭제하려면:

```bash
docker compose down -v
```
