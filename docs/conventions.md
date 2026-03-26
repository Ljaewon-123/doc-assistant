# 코딩 컨벤션 & 금지 사항

## 네이밍

- 파일명: `kebab-case` (예: `upload-document.dto.ts`)
- 클래스명: `PascalCase` (예: `DocumentsService`)
- 변수/함수: `camelCase`
- 상수: `UPPER_SNAKE_CASE`
- DTO 접미사: `.dto.ts`
- 인터페이스 접미사: `.interface.ts`
- Strategy 접미사: `.strategy.ts`
- Entity 접미사: `.entity.ts`
- Repository 접미사: `.repository.ts`

## NestJS 패턴

- 각 모듈은 `module.ts`, `controller.ts`, `service.ts` 구성
- Controller는 요청 검증 + Service 호출만 담당. 비즈니스 로직을 Controller에 넣지 않는다.
- DTO에는 `class-validator` 데코레이터를 사용한다.
- libs의 모든 public API는 `index.ts`에서 barrel export 한다.
- Service는 생성자 주입(constructor injection)을 사용한다.

## TypeORM 패턴

- 엔티티는 `libs/database/src/entities/`에 정의한다.
- Custom Repository 패턴을 사용한다 (`Repository.extend()`).
- pgvector 관련 쿼리는 `ChunkRepository`에 `createQueryBuilder` + raw SQL로 캡슐화한다.
- 개발 중에는 `synchronize: true`를 사용하되, 프로덕션에서는 반드시 마이그레이션을 사용한다.
- pgvector 인덱스(ivfflat)는 마이그레이션에서 직접 SQL로 생성한다.

## libs 간 import 규칙

- path alias를 사용한다: `import { RagService } from '@app/llm'`
- 상대 경로로 다른 lib를 import하지 않는다: `import { ... } from '../../../libs/...'` ← 금지

## TypeScript

- `any` 사용 금지. 타입이 불확실하면 `unknown`을 사용하고 타입 가드를 작성한다.
- 함수 반환 타입을 명시한다.
- 인터페이스는 `libs/common/src/interfaces/`에 공유 타입으로 정의한다.

## 에러 처리

- NestJS `HttpException` 계열을 사용한다 (`BadRequestException`, `NotFoundException` 등).
- 글로벌 예외 필터(`HttpExceptionFilter`)를 `libs/common`에 정의하고 `apps/api`에서 적용한다.

## Async Error Handling

- `try-catch`가 기본. 연속 await, 에러 변환, 복잡한 catch 로직에 사용
- `.then().catch()`는 **단일 작업 + 단순 변환 + 단순 폴백** 조합일 때만 허용
- catch 안에서 에러를 삼킬 때는 의도를 주석으로 명시

```typescript
// ✅ try-catch: 여러 단계, 에러 변환
try {
  const doc = await this.repo.findOneOrFail({ where: { id } });
  const chunks = await this.chunkRepo.find({ where: { documentId: id } });
  return { doc, chunks };
} catch {
  throw new NotFoundException(`Document ${id} not found`);
}

// ✅ then/catch: 단일 작업 + 간단 변환 + 폴백
const config = await readFile('config.json')
  .then((d) => JSON.parse(d.toString()) as AppConfig)
  .catch(() => DEFAULT_CONFIG);

// ✅ fire-and-forget: 실패해도 메인 흐름 무관
await this.analytics
  .track(event)
  .catch((e) => this.logger.warn('Analytics failed', e));

// ✅ then 2개까지는 허용 (흐름이 한 눈에 읽힘)
const items = await fetchData()
  .then((d) => d.json())
  .then((d) => d.items)
  .catch(() => []);

// ❌ then 3개 이상이면 try-catch로 전환
await fetchData()
  .then((d) => transform(d))
  .then((d) => validate(d))
  .then((d) => save(d))
  .catch((e) => handle(e));

// ❌ 의도 없이 에러 삼키기
await save(data).catch(() => {});

// ✅ 의도적 무시는 주석 명시
await save(data).catch(() => {
  /* 캐시 실패 무시 */
});
```
