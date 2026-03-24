import { Injectable } from '@nestjs/common';
import { IParserStrategy } from './parser.interface';

@Injectable()
export class MarkdownStrategy implements IParserStrategy {
  parse(_filePath: string): Promise<string> {
    return Promise.reject(new Error('Not implemented'));
  }
}
