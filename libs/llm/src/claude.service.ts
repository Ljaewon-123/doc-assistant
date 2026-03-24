import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClaudeService {
  constructor(private readonly configService: ConfigService) {}

  complete(_prompt: string): Promise<string> {
    // @anthropic-ai/sdk 사용, model: claude-haiku-4-5-20251001
    return Promise.reject(new Error('Not implemented'));
  }
}
