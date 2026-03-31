import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IChunkSearchResult } from '@app/common';
import { ChunkEntity } from '../entities/chunk.entity';

@Injectable()
export class ChunkRepository {
  constructor(
    @InjectRepository(ChunkEntity)
    private readonly repo: Repository<ChunkEntity>,
  ) {}

  saveMany(chunks: Partial<ChunkEntity>[]): Promise<ChunkEntity[]> {
    return this.repo.save(chunks.map((c) => this.repo.create(c)));
  }

  async deleteByDocumentId(documentId: string): Promise<void> {
    await this.repo.delete({ documentId });
  }

  async searchSimilar(
    queryVector: number[],
    documentId?: string,
    limit = 5,
  ): Promise<IChunkSearchResult[]> {
    const vectorStr = `[${queryVector.join(',')}]`;
    const qb = this.repo
      .createQueryBuilder('chunk')
      .select('chunk.content', 'content')
      .addSelect('chunk.sectionTitle', 'sectionTitle')
      .addSelect('chunk.chunkIndex', 'chunkIndex')
      .addSelect(
        `1 - (chunk.embedding <=> '${vectorStr}'::vector)`,
        'similarity',
      );

    if (documentId) {
      qb.where('chunk.documentId = :documentId', { documentId });
    }

    return qb
      .orderBy(`chunk.embedding <=> '${vectorStr}'::vector`)
      .limit(limit)
      .getRawMany<IChunkSearchResult>();
  }
}
