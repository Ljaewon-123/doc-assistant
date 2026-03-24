import { Module } from '@nestjs/common';
import { ChunkingService } from './chunking.service';
import { EmbeddingService } from './embedding.service';

@Module({
  providers: [EmbeddingService, ChunkingService],
  exports: [EmbeddingService, ChunkingService],
})
export class EmbeddingModule {}
