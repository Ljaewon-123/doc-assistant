# DB 스키마 (TypeORM 엔티티)
 
PostgreSQL 17 + pgvector. TypeORM 엔티티로 정의.
 
## DocumentEntity
 
```typescript
@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column({ length: 255 })
  filename: string;
 
  @Column({ length: 10 })
  fileType: string;               // 'md' | 'docx' | 'pdf'
 
  @Column('text')
  filePath: string;
 
  @Column({ default: false })
  isEditable: boolean;            // md,docx=true / pdf=false
 
  @Column({ default: 0 })
  chunkCount: number;
 
  @CreateDateColumn()
  createdAt: Date;
 
  @UpdateDateColumn()
  updatedAt: Date;
 
  @OneToMany(() => ChunkEntity, (chunk) => chunk.document)
  chunks: ChunkEntity[];
}
```
 
## ChunkEntity
 
```typescript
@Entity('chunks')
export class ChunkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @ManyToOne(() => DocumentEntity, (doc) => doc.chunks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: DocumentEntity;
 
  @Column('uuid')
  documentId: string;
 
  @Column('text')
  content: string;
 
  @Column('int')
  chunkIndex: number;
 
  @Column({ length: 255, nullable: true })
  sectionTitle: string;
 
  // pgvector — 마이그레이션에서 ALTER COLUMN ... TYPE vector(384)
  @Column('float', { array: true })
  embedding: number[];
 
  @CreateDateColumn()
  createdAt: Date;
}
```
 
## pgvector 설정 (마이그레이션에서 수동 SQL)
 
```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(384) USING embedding::vector(384);
CREATE INDEX idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_chunks_document_id ON chunks(document_id);
```
 
## 벡터 검색 쿼리 (ChunkRepository)
 
```typescript
async searchSimilar(queryVector: number[], documentId?: string, limit = 5) {
  const vectorStr = `[${queryVector.join(',')}]`;
  const qb = this.createQueryBuilder('chunk')
    .select('chunk.content', 'content')
    .addSelect('chunk.sectionTitle', 'sectionTitle')
    .addSelect('chunk.chunkIndex', 'chunkIndex')
    .addSelect(`1 - (chunk.embedding <=> '${vectorStr}'::vector)`, 'similarity');
 
  if (documentId) {
    qb.where('chunk.document_id = :documentId', { documentId });
  }
 
  return qb
    .orderBy(`chunk.embedding <=> '${vectorStr}'::vector`)
    .limit(limit)
    .getRawMany();
}
```