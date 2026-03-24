import { Injectable } from '@nestjs/common';
import { IChunkSearchResult } from '@app/common';
import { ClaudeService } from './claude.service';

@Injectable()
export class RagService {
  constructor(private readonly claudeService: ClaudeService) {}

  answer(_question: string, _chunks: IChunkSearchResult[]): Promise<string> {
    return Promise.reject(new Error('Not implemented'));
  }

  rewrite(_section: string, _instruction: string): Promise<string> {
    return Promise.reject(new Error('Not implemented'));
  }
}
