import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// TypeORM 0.3.x 내부 버그: synchronize 시 동일 pg.Client에 병렬 쿼리를 날려 발생하는 경고.
// process.on('warning')은 출력 이후 호출되므로 억제 불가 → emitWarning 자체를 override.
// 개인적으로 너무 별로인 방식같은데
const originalEmitWarning = process.emitWarning.bind(
  process,
) as typeof process.emitWarning;
process.emitWarning = (warning: string | Error, ...args: unknown[]) => {
  const msg = warning instanceof Error ? warning.message : String(warning);
  if (msg.includes('client.query() when the client is already executing')) {
    return;
  }
  Reflect.apply(originalEmitWarning, process, [warning, ...args]);
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.enableCors({ origin: 'http://localhost:5173' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Doc Assistant API')
    .setDescription('문서 업로드, QA, 수정 API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
