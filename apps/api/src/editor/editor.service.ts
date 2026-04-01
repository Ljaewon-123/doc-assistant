import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';
import { createPatch } from 'diff';
import { DocumentRepository } from '@app/database';
import { RagService } from '@app/llm';
import { AppConfig, IRewriteResult } from '@app/common';
import { MarkdownWriterStrategy } from './strategies/markdown-writer.strategy';

@Injectable()
export class EditorService {
  private readonly logger = new Logger(EditorService.name);

  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly ragService: RagService,
    private readonly markdownWriter: MarkdownWriterStrategy,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async rewrite(
    documentId: string,
    instruction: string,
    section?: string,
  ): Promise<IRewriteResult> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new NotFoundException(`Document ${documentId} not found`);
    }
    if (!document.isEditable) {
      throw new BadRequestException('PDF 문서는 수정할 수 없습니다');
    }

    const originalContent = await fs.readFile(document.filePath, 'utf-8');

    // 섹션 추출 또는 전체 문서 사용
    const sectionContent = section
      ? this.extractSection(originalContent, section)
      : originalContent;

    // Claude로 리라이팅
    this.logger.log(
      `Rewriting document ${documentId}, section: ${section ?? 'full'}`,
    );
    const rewrittenSection = await this.ragService.rewrite(
      sectionContent,
      instruction,
    );

    // 수정된 전체 문서 생성
    const modifiedContent = await this.markdownWriter.rewrite(
      document.filePath,
      sectionContent,
      rewrittenSection,
    );

    // Unified diff 생성
    const diff = createPatch(
      document.filename,
      originalContent,
      modifiedContent,
      'original',
      'rewritten',
    );

    // outputs/ 디렉토리에 저장
    const outputDir = this.configService.get<string>('outputDir', {
      infer: true,
    })!;
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `${documentId}.md`);
    await fs.writeFile(outputPath, modifiedContent, 'utf-8');

    this.logger.log(`Rewritten file saved: ${outputPath}`);

    return {
      diff,
      downloadUrl: `/editor/download/${documentId}`,
      outputPath,
    };
  }

  async download(id: string, res: Response): Promise<void> {
    const outputDir = this.configService.get<string>('outputDir', {
      infer: true,
    })!;
    const outputPath = path.join(outputDir, `${id}.md`);

    try {
      await fs.access(outputPath);
    } catch {
      throw new NotFoundException(
        `Document ${id}의 수정 파일이 없습니다. 먼저 rewrite를 실행하세요.`,
      );
    }

    res.download(outputPath);
  }

  private extractSection(content: string, sectionName: string): string {
    const lines = content.split('\n');
    let startIdx = -1;
    let startLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const match = /^(#{1,6})\s+(.+)/.exec(lines[i]);
      if (
        match &&
        match[2].trim().toLowerCase() === sectionName.trim().toLowerCase()
      ) {
        startIdx = i;
        startLevel = match[1].length;
        break;
      }
    }

    if (startIdx === -1) {
      this.logger.warn(
        `Section "${sectionName}" not found, using full content`,
      );
      return content;
    }

    let endIdx = lines.length;
    for (let i = startIdx + 1; i < lines.length; i++) {
      const match = /^(#{1,6})\s+/.exec(lines[i]);
      if (match && match[1].length <= startLevel) {
        endIdx = i;
        break;
      }
    }

    return lines.slice(startIdx, endIdx).join('\n');
  }
}
