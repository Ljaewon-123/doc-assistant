import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';

@Injectable()
export class DocxWriterStrategy {
  async rewrite(
    filePath: string,
    section: string,
    newContent: string,
  ): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    const original = result.value;

    if (original.trim() === section.trim()) {
      return newContent;
    }

    const modified = original.replace(section, newContent);
    if (modified === original) {
      // 섹션을 찾지 못한 경우 전체 교체로 폴백
      return newContent;
    }

    return modified;
  }
}
