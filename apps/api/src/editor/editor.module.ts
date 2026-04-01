import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { LlmModule } from '@app/llm';
import { EditorController } from './editor.controller';
import { EditorService } from './editor.service';
import { MarkdownWriterStrategy } from './strategies/markdown-writer.strategy';

@Module({
  imports: [DatabaseModule, LlmModule],
  controllers: [EditorController],
  providers: [EditorService, MarkdownWriterStrategy],
})
export class EditorModule {}
