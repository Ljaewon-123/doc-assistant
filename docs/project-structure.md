
# 모노레포 구조
 
## 왜 모노레포인가?
 
- 공통 코드(DTO, 인터페이스)를 한 번 정의하고 여러 앱에서 import
- 타입 변경 시 한 곳만 수정하면 전체 동기화
- 단일 package.json → 의존성 버전 충돌 방지
- 앱 추가가 쉬움 (나중에 worker, web 등)
 
## 디렉토리 트리
 
```
doc-assistant/
│
├── apps/
│   └── api/                              ← 메인 API 서버
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── documents/                # 문서 업로드 & 관리
│       │   │   ├── documents.module.ts
│       │   │   ├── documents.controller.ts
│       │   │   ├── documents.service.ts
│       │   │   └── dto/
│       │   ├── chat/                     # QA (질문 → 답변)
│       │   │   ├── chat.module.ts
│       │   │   ├── chat.controller.ts
│       │   │   ├── chat.service.ts
│       │   │   └── dto/
│       │   ├── editor/                   # 문서 수정 (md/docx)
│       │   │   ├── editor.module.ts
│       │   │   ├── editor.controller.ts
│       │   │   ├── editor.service.ts
│       │   │   ├── dto/
│       │   │   └── strategies/
│       │   │       ├── markdown-writer.strategy.ts
│       │   │       └── docx-writer.strategy.ts
│       │   └── health/
│       │       └── health.controller.ts
│       └── tsconfig.app.json
│
├── libs/
│   ├── common/src/                       ← 공통 유틸
│   │   ├── index.ts
│   │   ├── config/configuration.ts
│   │   ├── filters/http-exception.filter.ts
│   │   └── interfaces/index.ts
│   │
│   ├── database/src/                     ← DB 엔티티 & 리포지토리
│   │   ├── index.ts
│   │   ├── database.module.ts
│   │   ├── entities/
│   │   │   ├── document.entity.ts
│   │   │   └── chunk.entity.ts
│   │   └── repositories/
│   │       ├── document.repository.ts
│   │       └── chunk.repository.ts
│   │
│   ├── parser/src/                       ← 파일 파싱 (Strategy 패턴)
│   │   ├── index.ts
│   │   ├── parser.module.ts
│   │   ├── parser.service.ts
│   │   └── strategies/
│   │       ├── parser.interface.ts
│   │       ├── markdown.strategy.ts
│   │       ├── docx.strategy.ts
│   │       └── pdf.strategy.ts
│   │
│   ├── embedding/src/                    ← 임베딩 + 청킹
│   │   ├── index.ts
│   │   ├── embedding.module.ts
│   │   ├── embedding.service.ts
│   │   └── chunking.service.ts
│   │
│   └── llm/src/                          ← Claude API + RAG
│       ├── index.ts
│       ├── llm.module.ts
│       ├── claude.service.ts
│       ├── rag.service.ts
│       └── prompts/
│           ├── qa.prompt.ts
│           └── rewrite.prompt.ts
│
├── uploads/                              # 원본 파일 저장
├── outputs/                              # 수정된 파일
├── docker-compose.yml
├── nest-cli.json
├── tsconfig.json
├── package.json
└── .env.example
```
 
## tsconfig.json — path alias
 
```json
{
  "compilerOptions": {
    "paths": {
      "@app/common":    ["libs/common/src"],
      "@app/common/*":  ["libs/common/src/*"],
      "@app/database":  ["libs/database/src"],
      "@app/database/*":["libs/database/src/*"],
      "@app/parser":    ["libs/parser/src"],
      "@app/parser/*":  ["libs/parser/src/*"],
      "@app/embedding": ["libs/embedding/src"],
      "@app/embedding/*":["libs/embedding/src/*"],
      "@app/llm":       ["libs/llm/src"],
      "@app/llm/*":     ["libs/llm/src/*"]
    }
  }
}
```
 