import { Module } from '@nestjs/common';
import { DocumentsModule } from './documents/documents.module';
import { ChatModule } from './chat/chat.module';
import { EditorModule } from './editor/editor.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [DocumentsModule, ChatModule, EditorModule],
  controllers: [HealthController],
})
export class AppModule {}
