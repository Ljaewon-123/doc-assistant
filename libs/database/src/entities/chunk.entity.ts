import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { toSql, fromSql } from 'pgvector';
import { DocumentEntity } from './document.entity';

// pgvector SQL 문자열 <-> number[] 변환 트랜스포머
const vectorTransformer = {
  to: (value: number[]): string => toSql(value) as string,
  from: (value: string | number[]): number[] =>
    Array.isArray(value) ? value : (fromSql(value) as number[]),
};

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

  // TypeORM이 vector 타입을 regtype 기반으로 인식함 (PostgresQueryRunner 내장 지원)
  // type: 'vector', length: '384' 로 정의하면 DB의 vector(384)와 타입이 일치해 ALTER 불필요
  // transformer: INSERT/UPDATE 시 number[] → pgvector SQL 문자열, SELECT 시 역변환
  @Column({
    type: 'vector' as 'text',
    length: '384',
    transformer: vectorTransformer,
  })
  embedding: number[];

  @CreateDateColumn()
  createdAt: Date;
}
