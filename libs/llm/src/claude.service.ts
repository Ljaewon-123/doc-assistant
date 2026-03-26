import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ClaudeService {
  private readonly logger = new Logger(ClaudeService.name);
  private readonly client: Anthropic;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.get<string>('anthropicApiKey'),
    });
    this.model =
      this.configService.get<string>('llmModel') ?? 'claude-haiku-4-5-20251001';
  }

  async complete(prompt: string): Promise<string> {
    this.logger.debug(`Calling Claude API (model: ${this.model})`);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('Claude API returned no text response');
    }

    return textBlock.text;
  }
}
