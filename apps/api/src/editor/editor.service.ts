import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class EditorService {
  rewrite(
    _documentId: string,
    _instruction: string,
    _section?: string,
  ): Promise<unknown> {
    return Promise.reject(new Error('Not implemented'));
  }

  download(_id: string, _res: Response): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }
}
