import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentEntity } from './document.entity';

@Entity('chunks')
export class ChunkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DocumentEntity, (doc) => doc.chunks, {
    onDelete: 'CASCADE',
  })
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
