import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChunkingService {
  constructor(private readonly configService: ConfigService) {}

  chunk(_text: string): Promise<string[]> {
    // RecursiveCharacterTextSplitter (LangChain) 사용
    return Promise.reject(new Error('Not implemented'));
  }
}
