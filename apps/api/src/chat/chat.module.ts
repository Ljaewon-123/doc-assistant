import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { EmbeddingModule } from '@app/embedding';
import { LlmModule } from '@app/llm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [DatabaseModule, EmbeddingModule, LlmModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
