import { Module } from '@nestjs/common';
import { ClaudeService } from './claude.service';
import { RagService } from './rag.service';

@Module({
  providers: [ClaudeService, RagService],
  exports: [ClaudeService, RagService],
})
export class LlmModule {}
