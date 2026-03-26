import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class ChunkingService {
  private readonly splitter: RecursiveCharacterTextSplitter;

  constructor(private readonly configService: ConfigService) {
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.configService.get<number>('chunkSize', 1000),
      chunkOverlap: this.configService.get<number>('chunkOverlap', 200),
    });
  }

  async chunk(text: string): Promise<string[]> {
    return await this.splitter.splitText(text);
  }
}
