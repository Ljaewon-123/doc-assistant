import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { LlmModule } from '@app/llm';
import { ParserModule } from '@app/parser';
import { EditorController } from './editor.controller';
import { EditorService } from './editor.service';
import { MarkdownWriterStrategy } from './strategies/markdown-writer.strategy';
import { DocxWriterStrategy } from './strategies/docx-writer.strategy';

@Module({
  imports: [DatabaseModule, LlmModule, ParserModule],
  controllers: [EditorController],
  providers: [EditorService, MarkdownWriterStrategy, DocxWriterStrategy],
})
export class EditorModule {}
