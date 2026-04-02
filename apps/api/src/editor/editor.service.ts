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
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { DocumentRepository } from '@app/database';
import { RagService } from '@app/llm';
import { ParserService } from '@app/parser';
import { AppConfig, IRewriteResult } from '@app/common';
import { MarkdownWriterStrategy } from './strategies/markdown-writer.strategy';
import { DocxWriterStrategy } from './strategies/docx-writer.strategy';

@Injectable()
export class EditorService {
  private readonly logger = new Logger(EditorService.name);

  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly ragService: RagService,
    private readonly parserService: ParserService,
    private readonly markdownWriter: MarkdownWriterStrategy,
    private readonly docxWriter: DocxWriterStrategy,
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

    const isDocx = document.fileType === 'docx';

    // 원본 텍스트 추출 (md: 직접 읽기, docx: mammoth로 추출)
    const originalContent = isDocx
      ? await this.parserService.parse(document.filePath, 'docx')
      : await fs.readFile(document.filePath, 'utf-8');

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
    const modifiedContent = isDocx
      ? await this.docxWriter.rewrite(
          document.filePath,
          sectionContent,
          rewrittenSection,
        )
      : await this.markdownWriter.rewrite(
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

    const ext = isDocx ? 'docx' : 'md';
    const outputPath = path.join(outputDir, `${documentId}.${ext}`);

    if (isDocx) {
      const buffer = await this.textToDocxBuffer(modifiedContent);
      await fs.writeFile(outputPath, buffer);
    } else {
      await fs.writeFile(outputPath, modifiedContent, 'utf-8');
    }

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

    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    const ext = document.fileType === 'docx' ? 'docx' : 'md';
    const outputPath = path.join(outputDir, `${id}.${ext}`);

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

  private async textToDocxBuffer(text: string): Promise<Buffer> {
    const paragraphs = text.split('\n').map((line) => {
      const h1 = /^#\s+(.+)/.exec(line);
      if (h1) {
        return new Paragraph({
          children: [new TextRun({ text: h1[1], bold: true, size: 32 })],
        });
      }
      const h2 = /^##\s+(.+)/.exec(line);
      if (h2) {
        return new Paragraph({
          children: [new TextRun({ text: h2[1], bold: true, size: 28 })],
        });
      }
      const h3 = /^###\s+(.+)/.exec(line);
      if (h3) {
        return new Paragraph({
          children: [new TextRun({ text: h3[1], bold: true, size: 24 })],
        });
      }
      return new Paragraph({ children: [new TextRun(line)] });
    });

    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }],
    });

    return Packer.toBuffer(doc);
  }
}
