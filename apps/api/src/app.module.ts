import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
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
  ],
  controllers: [HealthController],
})
export class AppModule {}
