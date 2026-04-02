# 개발 Phase & 순서
 
## 학습 목표
 
- NestJS 모노레포(apps/libs) 구조에 익숙해지기
- pgvector를 활용한 벡터 검색 실전 경험
- LangChain.js를 최소한으로 사용한 RAG 파이프라인 구축
- 포트폴리오에 어필할 수 있는 수준의 완성도
 
## Phase 1: 기반 세팅 (1~2주) ✅
1. ✅ `nest new doc-assistant` → 모노레포 전환 → `docker compose up`
2. ✅ `libs/common` — ConfigModule 설정, HttpExceptionFilter
3. ✅ `libs/database` — TypeORM 연결, 엔티티 정의, pgvector 마이그레이션
4. ✅ tsconfig path alias 확인, 모노레포 빌드 확인

## Phase 2: 업로드 → 임베딩 (1주) ✅
5. ✅ `libs/parser` — MarkdownStrategy 먼저
6. ✅ `libs/embedding` — Xenova 모델 로딩 (싱글톤) + ChunkingService
7. ✅ `apps/api/documents` — POST /upload 엔드포인트
8. ✅ 테스트: md 파일 업로드 → pgvector에 벡터 저장 확인

## Phase 3: QA (1주) ✅
9. ✅ `libs/llm` — ClaudeService + RagService
10. ✅ `apps/api/chat` — POST /ask 엔드포인트
11. ✅ Swagger 문서화
12. ✅ 테스트: 질문 → 관련 청크 검색 → Claude 답변 확인
    - SnakeNamingStrategy + autoLoadEntities 적용
    - ChunkEntity vector 타입 native 지원 (pgvector transformer)
    - DB 컬럼 camelCase → snake_case 마이그레이션
    - end-to-end QA 파이프라인 검증 완료

## Phase 4: 문서 수정 (1~2주)
13. `apps/api/editor` — POST /rewrite (md 먼저)
14. diff 라이브러리 연동 + 파일 다운로드
15. DocxStrategy + DocxWriterStrategy 추가
16. PdfStrategy 추가 (읽기 전용)

## Phase 5: 프론트엔드 (Vue + Vite SPA)
17. ✅ `docs/frontend.md` 작성 + `CLAUDE.md` Lazy Loading 연결 + `dev-phases.md` 계획 수립
18. `apps/web/` Vite 프로젝트 초기화 (vue-ts 템플릿) + ofetch 설치
19. NestJS `ServeStaticModule` 연동 + 개발 환경 CORS + Vite proxy 설정
20. `DocumentList.vue` — `GET /documents` 목록 + 삭제
21. `UploadZone.vue` — 드래그앤드랍 + 버튼 → `POST /documents/upload`
22. `ChatPanel.vue` — 채팅 UI (`POST /chat/ask`, 대화 비저장)
23. `Dockerfile` 멀티스테이지 빌드 + `docker-compose.yml` api 서비스 추가
 
## 포트폴리오 어필 포인트
 
- **NestJS 모노레포**: apps/libs 분리, @app/* alias, 공유 라이브러리 설계
- **RAG 파이프라인**: 로컬 임베딩 + pgvector + Claude 조합, 비용 최적화
- **pgvector 실전**: SQL 기반 벡터 검색, IVFFlat 인덱스
- **Strategy 패턴**: 파서/라이터를 파일 타입별 전략으로 분리 (OCP 준수)
- **비용 최적화 설계**: 임베딩 무료(로컬) + Haiku(저비용) 조합
- **문서 수정 워크플로우**: 원본 → AI 리라이팅 → diff → 다운로드
- **LangChain 최소 의존**: 필요한 부분만 가져다 씀