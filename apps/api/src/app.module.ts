import { join } from 'path';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommonModule, HttpExceptionFilter } from '@app/common';
import { DatabaseModule } from '@app/database';
import { DocumentsModule } from './documents/documents.module';
import { ChatModule } from './chat/chat.module';
import { EditorModule } from './editor/editor.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    DocumentsModule,
    ChatModule,
    EditorModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'apps', 'web', 'dist'),
      exclude: ['/api/(.*)', '/health'],
      renderPath: '/*',
    }),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
