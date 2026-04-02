import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (
  buf: Buffer,
) => Promise<{ text: string }>;
import { IParserStrategy } from './parser.interface';

@Injectable()
export class PdfStrategy implements IParserStrategy {
  async parse(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
}
