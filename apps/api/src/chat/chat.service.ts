import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  ask(_question: string, _documentId?: string): Promise<unknown> {
    return Promise.reject(new Error('Not implemented'));
  }
}
