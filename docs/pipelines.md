# 핵심 파이프라인
 
## 1. 업로드 (Ingestion)
 
```
파일 수신 → ParserService.parse() → ChunkingService.chunk() → EmbeddingService.embed() → ChunkRepository.save()
```
 
## 2. QA
 
```
질문 → EmbeddingService.embed(question) → ChunkRepository.searchSimilar(vector, top5) → RagService.answer(question, chunks) → Claude 답변
```
 
## 3. 수정 (md/docx만)
 
```
지시 → 관련 섹션 검색 (벡터 or 헤딩 매칭) → RagService.rewrite(section, instruction) → diff 생성 → 수정 파일 저장
```
 