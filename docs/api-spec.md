# API 엔드포인트 명세
 
```
POST   /documents/upload      — multer로 파일 수신 (md/docx/pdf)
GET    /documents              — 문서 목록
GET    /documents/:id          — 문서 상세
DELETE /documents/:id          — 문서 + 벡터 삭제
 
POST   /chat/ask               — { question, documentId? } → 답변 + 출처
POST   /editor/rewrite         — { documentId, instruction, section? } → diff + downloadUrl
GET    /editor/download/:id    — 수정된 파일 다운로드
 
GET    /health                 — DB 연결 체크
```