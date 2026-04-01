import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IRewriteResult } from '@app/common';
import { EditorService } from './editor.service';
import { RewriteDto } from './dto/rewrite.dto';

@ApiTags('editor')
@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  @Post('rewrite')
  @HttpCode(200)
  @ApiOperation({ summary: '문서 AI 리라이팅 + diff 반환 (md만 지원)' })
  rewrite(@Body() dto: RewriteDto): Promise<IRewriteResult> {
    return this.editorService.rewrite(
      dto.documentId,
      dto.instruction,
      dto.section,
    );
  }

  @Get('download/:id')
  @ApiOperation({ summary: '수정된 파일 다운로드 (documentId 사용)' })
  download(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.editorService.download(id, res);
  }
}
