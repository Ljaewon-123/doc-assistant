# Doc Assistant

문서(md/docx/pdf)를 업로드하면 AI가 내용을 이해하고, 질문에 답변하고, 문서를 수정해주는 RAG 기반 서비스.

Upload docs, ask questions, rewrite sections — powered by NestJS + Claude + pgvector.

![동작 예시](running.png)

---

## 주요 기능

- **문서 QA** — 업로드된 문서에 대해 RAG 기반 질문/답변 (md, docx, pdf 지원)
- **문서 수정** — AI가 지시에 따라 해당 섹션을 리라이팅 (md, docx만)
- **Diff + 다운로드** — 원본 vs 수정본 diff 비교, 수정된 파일 다운로드
- **드래그앤드랍 업로드** — Vue SPA에서 파일 드래그 or 버튼 클릭으로 업로드
- **채팅 UI** — 선택한 문서에 대해 자유롭게 질문 (대화 내용 비저장)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | NestJS v11 (모노레포) + TypeScript |
| Frontend | Vue 3 + Vite (SPA) |
| LLM | Claude Haiku 4.5 (`@anthropic-ai/sdk`) |
| Embedding | `@xenova/transformers` 로컬 실행 (all-MiniLM-L6-v2, 384차원) |
| Database | PostgreSQL 17 + pgvector |
| ORM | TypeORM |
| 서빙 | NestJS ServeStaticModule (단일 컨테이너) |

---

## 사전 준비

- **Node.js v24+**
- **Docker** (PostgreSQL용)
- **Anthropic API Key** ([console.anthropic.com](https://console.anthropic.com)에서 발급)

---

## 빠른 시작

### 1. 클론 & 의존성 설치

```bash
git clone https://github.com/<your-username>/doc-assistant.git
cd doc-assistant
npm install
cd apps/web && npm install && cd ../..
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 `ANTHROPIC_API_KEY`에 실제 API 키를 입력합니다.

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
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

### 3-A. 개발 환경 (터미널 3개)

```bash
# 터미널 1: PostgreSQL 시작
docker compose up -d

# 터미널 2: NestJS API 서버 (port 3000, hot-reload)
nest start api --watch

# 터미널 3: Vue 개발 서버 (port 5173)
cd apps/web && npm run dev
```

브라우저에서 **http://localhost:5173** 접속.

> Swagger UI: http://localhost:3000/api-docs

### 3-B. 프로덕션 (Docker 단일 컨테이너)

```bash
docker compose up --build
```

브라우저에서 **http://localhost:3000** 접속.

> Vue 빌드 결과물을 NestJS가 정적 파일로 서빙하므로 포트 3000 하나로 동작합니다.

### 종료

```bash
docker compose down       # 컨테이너 종료
docker compose down -v    # 컨테이너 + 데이터 볼륨 삭제
```

---

## 사용 방법

1. **문서 업로드** — 좌측 패널에서 md/docx/pdf 파일을 드래그하거나 버튼으로 업로드
2. **문서 선택** — 목록에서 문서를 클릭하여 선택
3. **질문하기** — 우측 채팅 패널에서 문서 내용에 대해 질문 입력
4. **AI 답변 확인** — 관련 문서 내용을 기반으로 AI가 답변

---

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| `POST` | `/api/documents/upload` | 파일 업로드 (md/docx/pdf) |
| `GET` | `/api/documents` | 문서 목록 조회 |
| `GET` | `/api/documents/:id` | 문서 상세 조회 |
| `DELETE` | `/api/documents/:id` | 문서 삭제 |
| `POST` | `/api/chat/ask` | 질문 → AI 답변 |
| `POST` | `/api/editor/rewrite` | 문서 섹션 수정 요청 |
| `GET` | `/api/editor/download/:id` | 수정된 파일 다운로드 |
| `GET` | `/health` | 헬스 체크 |

---

## 프로젝트 구조

```
doc-assistant/
├── apps/
│   ├── api/              ← NestJS API 서버
│   │   └── src/
│   │       ├── documents/    # 문서 업로드 & 관리
│   │       ├── chat/         # QA (질문 → 답변)
│   │       ├── editor/       # 문서 수정
│   │       └── health/       # 헬스 체크
│   └── web/              ← Vue 3 SPA
│       └── src/
│           ├── components/
│           │   ├── DocumentList.vue
│           │   ├── UploadZone.vue
│           │   └── ChatPanel.vue
│           └── api/client.ts
├── libs/
│   ├── common/           ← 공통 설정, 필터, 인터페이스
│   ├── database/         ← TypeORM 엔티티 & 리포지토리
│   ├── parser/           ← 파일 파싱 (md/docx/pdf)
│   ├── embedding/        ← 로컬 임베딩 + 청킹
│   └── llm/              ← Claude API + RAG
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 핵심 아키텍처

### RAG 파이프라인

```
업로드: 파일 → 파싱 → 청킹 → 로컬 임베딩 → pgvector 저장
QA:    질문 → 임베딩 → 벡터 유사도 검색(top 5) → Claude 답변 생성
수정:  지시 → 관련 섹션 검색 → Claude 리라이팅 → diff 생성 → 다운로드
```

### 비용 구조

- **임베딩**: 무료 (로컬 실행)
- **Claude Haiku 4.5**: $1 입력 / $5 출력 per MTok
- **PostgreSQL**: Docker 로컬 → 무료
- 유일한 유료 항목: **Anthropic API Key**

---

## 라이선스

UNLICENSED
