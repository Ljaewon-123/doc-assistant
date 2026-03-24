import { Module } from '@nestjs/common';
import { DocxStrategy } from './strategies/docx.strategy';
import { MarkdownStrategy } from './strategies/markdown.strategy';
import { PdfStrategy } from './strategies/pdf.strategy';
import { ParserService } from './parser.service';

@Module({
  providers: [ParserService, MarkdownStrategy, DocxStrategy, PdfStrategy],
  exports: [ParserService],
})
export class ParserModule {}
