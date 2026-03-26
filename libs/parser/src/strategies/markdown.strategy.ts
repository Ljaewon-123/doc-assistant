import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { IParserStrategy } from './parser.interface';

@Injectable()
export class MarkdownStrategy implements IParserStrategy {
  async parse(filePath: string): Promise<string> {
    const buffer = await readFile(filePath);
    return buffer.toString('utf-8');
  }
}
