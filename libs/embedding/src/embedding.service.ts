import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// @xenova/transformers는 ESM이므로 dynamic import 사용
type Pipeline = (
  text: string | string[],
) => Promise<{ tolist: () => number[][] }>;

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private pipeline: Pipeline;
  private readonly modelName: string;

  constructor(private readonly configService: ConfigService) {
    this.modelName = this.configService.get<string>(
      'embeddingModel',
      'Xenova/all-MiniLM-L6-v2',
    );
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(`Loading embedding model: ${this.modelName}`);
    const { pipeline } = await import('@xenova/transformers');
    this.pipeline = (await pipeline(
      'feature-extraction',
      this.modelName,
    )) as unknown as Pipeline;
    this.logger.log('Embedding model loaded');
  }

  async embed(text: string): Promise<number[]> {
    const result = await this.pipeline(text);
    return result.tolist()[0];
  }

  async embedMany(texts: string[]): Promise<number[][]> {
    const result = await this.pipeline(texts);
    return result.tolist();
  }
}
