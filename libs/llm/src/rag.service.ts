import { Injectable, Logger } from '@nestjs/common';
import { IChunkSearchResult } from '@app/common';
import { ClaudeService } from './claude.service';
import { buildQaPrompt } from './prompts/qa.prompt';
import { buildRewritePrompt } from './prompts/rewrite.prompt';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(private readonly claudeService: ClaudeService) {}

  async answer(
    question: string,
    chunks: IChunkSearchResult[],
  ): Promise<string> {
    const context = chunks
      .map((c) => {
        const title = c.sectionTitle ? `[${c.sectionTitle}] ` : '';
        return `${title}${c.content}`;
      })
      .join('\n\n---\n\n');

    const prompt = buildQaPrompt(question, context);
    this.logger.debug(`QA prompt built with ${chunks.length} chunks`);

    return this.claudeService.complete(prompt);
  }

  async rewrite(section: string, instruction: string): Promise<string> {
    const prompt = buildRewritePrompt(section, instruction);
    this.logger.debug('Rewrite prompt built');

    return this.claudeService.complete(prompt);
  }
}
