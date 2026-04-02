# CLAUDE.md

이 파일은 Claude Code가 doc-assistant 프로젝트에서 코드를 작성할 때 참조하는 지시서입니다.

---

## 프로젝트 한 줄 요약

문서(md/docx/pdf)를 업로드하면 AI가 내용을 이해하고, 질문에 답변하고, 문서를 수정해주는 NestJS API 서비스.

## 핵심 기능

1. **문서 QA** — 업로드된 문서에 대해 RAG 기반 질문 답변 (md/docx/pdf)
2. **문서 수정** — 지시에 따라 해당 섹션을 AI가 리라이팅 (md/docx만)
3. **Diff + 다운로드** — 원본 vs 수정본 diff 비교, 수정 파일 다운로드

---

## 프로젝트 문서 (Lazy Loading)

필요할 때 해당 파일을 읽어서 참조하세요.

- 기술 스택 & 비용 구조: @docs/tech-stack.md
- 모노레포 구조 & 디렉토리 트리: @docs/project-structure.md
- API 엔드포인트 명세: @docs/api-spec.md
- DB 스키마 & pgvector 설정: @docs/db-schema.md
- 핵심 파이프라인 (업로드/QA/수정): @docs/pipelines.md
- 개발 Phase & 순서: @docs/dev-phases.md
- Docker / 환경변수 / 패키지: @docs/environment.md
- 코딩 컨벤션 & 금지 사항: @docs/conventions.md
- 프론트엔드 스펙 & 아키텍처: @docs/frontend.md
- 실행 방법 (개발/프로덕션): @docs/running.md

---

## 기술 제약사항 (항상 참조)

- **Runtime**: Node.js v24+
- **Framework**: NestJS v11 (모노레포 모드)
- **Language**: TypeScript
- **LLM**: Claude Haiku 4.5 (`claude-haiku`) via `@anthropic-ai/sdk`
- **Embedding**: `@xenova/transformers` 로컬 실행 (all-MiniLM-L6-v2, 384차원)
- **Database**: PostgreSQL 17 + pgvector (Docker)
- **ORM**: TypeORM (`@nestjs/typeorm`)
- **LangChain**: `RecursiveCharacterTextSplitter`만 사용. 그 외 LangChain 기능 사용 금지.

---

## 모듈 의존 관계 (항상 지켜야 할 방향)

```
apps/api → libs/* (모든 libs를 import 가능)
libs/llm → libs/common (API key 설정만)
libs/embedding → libs/common (모델 설정만)
libs/database → libs/common (DB URL 설정만)
libs/parser → (독립, 다른 libs에 의존하지 않음)
libs/common → (독립, 최하위 계층)
```

**금지**: libs 간 순환 의존. libs 간 횡단 의존 금지.

---

## 하지 말 것 (항상 참조)

- LangChain의 chain, agent, memory 등 고수준 기능 사용 금지. TextSplitter만 쓴다.
- OpenAI, Voyage AI 등 외부 임베딩 API 사용 금지. 임베딩은 로컬만.
- Turborepo, Nx 등 외부 모노레포 도구 사용 금지. NestJS CLI 모노레포로 충분.
- Drizzle ORM 사용 금지. TypeORM을 사용한다.
- libs 간 순환 의존 금지.
- Controller에 비즈니스 로직 금지.
- `any` 타입 사용 금지.
- 상대 경로로 다른 lib import 금지 (path alias 사용).

---

## 자주 쓰는 명령어

```bash
nest start api --watch          # 개발 서버
nest build api                  # 빌드
npx typeorm migration:generate  # 마이그레이션 생성
npx typeorm migration:run       # 마이그레이션 실행
docker compose up -d            # PostgreSQL 시작
docker compose down             # PostgreSQL 종료
```

### TIP

하나의 기능이 끝날때마다 백업 개념으로 커밋해 놓을것
