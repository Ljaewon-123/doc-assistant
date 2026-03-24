import { Injectable } from '@nestjs/common';
import { DocxStrategy } from './strategies/docx.strategy';
import { MarkdownStrategy } from './strategies/markdown.strategy';
import { PdfStrategy } from './strategies/pdf.strategy';
import { IParserStrategy } from './strategies/parser.interface';

@Injectable()
export class ParserService {
  constructor(
    private readonly markdownStrategy: MarkdownStrategy,
    private readonly docxStrategy: DocxStrategy,
    private readonly pdfStrategy: PdfStrategy,
  ) {}

  parse(filePath: string, fileType: string): Promise<string> {
    const strategy = this.getStrategy(fileType);
    return strategy.parse(filePath);
  }

  private getStrategy(fileType: string): IParserStrategy {
    switch (fileType) {
      case 'md':
        return this.markdownStrategy;
      case 'docx':
        return this.docxStrategy;
      case 'pdf':
        return this.pdfStrategy;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }
}
