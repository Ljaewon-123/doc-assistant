import { Injectable } from '@nestjs/common';

@Injectable()
export class DocxWriterStrategy {
  rewrite(
    _filePath: string,
    _section: string,
    _newContent: string,
  ): Promise<string> {
    return Promise.reject(new Error('Not implemented'));
  }
}
