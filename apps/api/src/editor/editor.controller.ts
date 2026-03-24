import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { EditorService } from './editor.service';

@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  @Post('rewrite')
  rewrite(
    @Body()
    body: {
      documentId: string;
      instruction: string;
      section?: string;
    },
  ): Promise<unknown> {
    return this.editorService.rewrite(
      body.documentId,
      body.instruction,
      body.section,
    );
  }

  @Get('download/:id')
  download(@Param('id') id: string, @Res() res: Response): Promise<void> {
    return this.editorService.download(id, res);
  }
}
