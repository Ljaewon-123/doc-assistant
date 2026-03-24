import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentEntity } from '../entities/document.entity';

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repo: Repository<DocumentEntity>,
  ) {}

  save(_document: Partial<DocumentEntity>): Promise<DocumentEntity> {
    return Promise.reject(new Error('Not implemented'));
  }

  findAll(): Promise<DocumentEntity[]> {
    return Promise.reject(new Error('Not implemented'));
  }

  findById(_id: string): Promise<DocumentEntity | null> {
    return Promise.reject(new Error('Not implemented'));
  }

  delete(_id: string): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }
}
