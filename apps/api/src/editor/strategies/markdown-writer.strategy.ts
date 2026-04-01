import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class MarkdownWriterStrategy {
  async rewrite(
    filePath: string,
    section: string,
    newContent: string,
  ): Promise<string> {
    const original = await fs.readFile(filePath, 'utf-8');

    // 전체 문서 교체인 경우
    if (original.trim() === section.trim()) {
      return newContent;
    }

    // 섹션을 찾아 교체
    const modified = original.replace(section, newContent);
    if (modified === original) {
      // 섹션을 찾지 못한 경우 전체 교체로 폴백
      return newContent;
    }

    return modified;
  }
}
