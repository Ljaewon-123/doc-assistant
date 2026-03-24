import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmbeddingService {
  constructor(private readonly configService: ConfigService) {}

  embed(_text: string): Promise<number[]> {
    // @xenova/transformers all-MiniLM-L6-v2 로컬 실행 (싱글톤)
    return Promise.reject(new Error('Not implemented'));
  }

  embedMany(_texts: string[]): Promise<number[][]> {
    return Promise.reject(new Error('Not implemented'));
  }
}
