import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// TypeORM 0.3.x 내부 버그: synchronize 시 동일 pg.Client에 병렬 쿼리를 날려 발생하는 경고.
// TypeORM 수정 전까지 해당 경고만 억제한다.
process.on('warning', (warning) => {
  if (
    warning.name === 'DeprecationWarning' &&
    warning.message.includes(
      'client.query() when the client is already executing',
    )
  ) {
    return;
  }
  process.stderr.write(warning.stack + '\n');
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

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
