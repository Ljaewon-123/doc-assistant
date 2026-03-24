import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChunkEntity } from './chunk.entity';

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 10 })
  fileType: string; // 'md' | 'docx' | 'pdf'

  @Column('text')
  filePath: string;

  @Column({ default: false })
  isEditable: boolean; // md,docx=true / pdf=false

  @Column({ default: 0 })
  chunkCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChunkEntity, (chunk) => chunk.document)
  chunks: ChunkEntity[];
}
