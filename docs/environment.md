# Docker / 환경변수 / 패키지
 
## docker-compose.yml
 
```yaml
version: "3.8"
services:
  postgres:
    image: pgvector/pgvector:pg17
    environment:
      POSTGRES_USER: docassist
      POSTGRES_PASSWORD: docassist
      POSTGRES_DB: doc_assistant
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```
 
## .env.example
 
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
 
## 주요 패키지

**해당 패키지중에 현재 노드 버전에 맞는 가장 최신버전을 기준으로 한다.**

```json
{
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/swagger": "^11.0.0",
    "@nestjs/typeorm": "^11.0.0",
    "@anthropic-ai/sdk": "^0.39.0",
    "langchain": "^0.3.0",
    "@xenova/transformers": "^2.17.0",
    "typeorm": "^0.3.0",
    "pg": "^8.13.0",
    "pgvector": "^0.2.0",
    "mammoth": "^1.8.0",
    "pdf-parse": "^1.1.1",
    "multer": "^1.4.5",
    "diff": "^7.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0"
  }
}
```
 
## 개발 명령어
 
```bash
nest start api --watch                    # 개발 서버
nest build api                            # 빌드
npx typeorm migration:generate -d src/data-source.ts -n Init   # 마이그레이션 생성
npx typeorm migration:run -d src/data-source.ts                # 마이그레이션 실행
docker compose up -d                      # PostgreSQL 시작
docker compose down                       # 종료
```