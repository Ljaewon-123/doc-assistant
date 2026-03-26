import { Injectable, Logger } from '@nestjs/common';
import { IAskResult } from '@app/common';
import { ChunkRepository } from '@app/database';
import { EmbeddingService } from '@app/embedding';
import { RagService } from '@app/llm';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly chunkRepository: ChunkRepository,
    private readonly ragService: RagService,
  ) {}

  async ask(question: string, documentId?: string): Promise<IAskResult> {
    this.logger.log(
      `QA request: "${question}" (documentId: ${documentId ?? 'all'})`,
    );

    const queryVector = await this.embeddingService.embed(question);

    const chunks = await this.chunkRepository.searchSimilar(
      queryVector,
      documentId,
      5,
    );

    if (chunks.length === 0) {
      return {
        answer: '관련 문서를 찾을 수 없습니다. 먼저 문서를 업로드해주세요.',
        sources: [],
      };
    }

    const answer = await this.ragService.answer(question, chunks);

    return { answer, sources: chunks };
  }
}
