import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { extname } from 'path';
import {
  DocumentEntity,
  DocumentRepository,
  ChunkRepository,
} from '@app/database';
import { ParserService } from '@app/parser';
import { ChunkingService, EmbeddingService } from '@app/embedding';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly documentRepo: DocumentRepository,
    private readonly chunkRepo: ChunkRepository,
    private readonly parserService: ParserService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async upload(file: Express.Multer.File): Promise<DocumentEntity> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const fileType = extname(file.originalname).replace('.', '').toLowerCase();
    const isEditable = fileType === 'md' || fileType === 'docx';

    // 1. 문서 레코드 저장
    const document = await this.documentRepo.save({
      filename: file.originalname,
      fileType,
      filePath: file.path,
      isEditable,
    });

    // 2. 파싱
    this.logger.log(`Parsing file: ${file.originalname}`);
    const text = await this.parserService.parse(file.path, fileType);

    // 3. 청킹
    this.logger.log('Chunking text...');
    const chunks = await this.chunkingService.chunk(text);

    // 4. 임베딩
    this.logger.log(`Embedding ${chunks.length} chunks...`);
    const embeddings = await this.embeddingService.embedMany(chunks);

    // 5. 청크 + 벡터 저장
    const chunkEntities = chunks.map((content, index) => ({
      documentId: document.id,
      content,
      chunkIndex: index,
      sectionTitle: this.extractSectionTitle(content),
      embedding: embeddings[index],
    }));

    await this.chunkRepo.saveMany(chunkEntities);

    // 6. chunkCount 업데이트
    document.chunkCount = chunks.length;
    await this.documentRepo.save(document);

    this.logger.log(
      `Upload complete: ${file.originalname} (${chunks.length} chunks)`,
    );
    return document;
  }

  async findAll(): Promise<DocumentEntity[]> {
    return await this.documentRepo.findAll();
  }

  async findOne(id: string): Promise<DocumentEntity> {
    const doc = await this.documentRepo.findById(id);
    if (!doc) {
      throw new NotFoundException(`Document ${id} not found`);
    }
    return doc;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.chunkRepo.deleteByDocumentId(id);
    await this.documentRepo.delete(id);
  }

  private extractSectionTitle(content: string): string | undefined {
    const match = content.match(/^#{1,6}\s+(.+)/m);
    return match ? match[1].trim() : undefined;
  }
}
