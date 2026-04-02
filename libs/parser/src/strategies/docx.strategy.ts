import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import { IParserStrategy } from './parser.interface';

@Injectable()
export class DocxStrategy implements IParserStrategy {
  async parse(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
}
