# 기술 스택 & 비용 구조

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| Runtime | Node.js v24+ | 프로젝트 요구사항 |
| Framework | NestJS v11 (monorepo) | 회사 환경 맞춤 + 모노레포 경험 |
| Language | TypeScript v5.x | 프로젝트 요구사항 |
| LLM | Claude Haiku 4.5 | 저비용($1/$5 MTok), RAG 충분 |
| Embedding | @xenova/transformers | 로컬 실행, 무료, ~80MB |
| Embedding model | all-MiniLM-L6-v2 | 384차원, CPU 전용, 경량 |
| Database | PostgreSQL 17 + pgvector | 익숙한 PG + 벡터 통합 |
| ORM | TypeORM | NestJS 공식 통합, 익숙한 도구 |
| 텍스트 분할 | LangChain.js (최소) | RecursiveCharacterTextSplitter만 |
| 프론트(2차) | Nuxt 4 | 추후 apps/web 추가 |
 
## 비용 구조
 
- 임베딩: 무료 (로컬)
- Claude Haiku 4.5: $1 입력 / $5 출력 per MTok → 개인 프로젝트 월 수백~수천 원
- PostgreSQL: Docker 로컬 → 무료
- 유일한 유료 항목: Anthropic API key
 