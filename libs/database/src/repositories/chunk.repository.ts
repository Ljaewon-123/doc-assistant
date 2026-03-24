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

  saveMany(_chunks: Partial<ChunkEntity>[]): Promise<ChunkEntity[]> {
    return Promise.reject(new Error('Not implemented'));
  }

  deleteByDocumentId(_documentId: string): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }

  searchSimilar(
    _queryVector: number[],
    _documentId?: string,
    _limit?: number,
  ): Promise<IChunkSearchResult[]> {
    // pgvector cosine similarity 검색 — 구현 시 createQueryBuilder + raw SQL 사용
    return Promise.reject(new Error('Not implemented'));
  }
}
