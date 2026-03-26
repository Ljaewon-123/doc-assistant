import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentEntity } from '@app/database';
import { DocumentsService } from './documents.service';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '문서 업로드',
    description: 'md/docx/pdf 파일을 업로드하고 임베딩합니다.',
  })
  @ApiConsumes('multipart/form-data')
  upload(@UploadedFile() file: Express.Multer.File): Promise<DocumentEntity> {
    return this.documentsService.upload(file);
  }

  @Get()
  @ApiOperation({ summary: '문서 목록 조회' })
  findAll(): Promise<DocumentEntity[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '문서 상세 조회' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DocumentEntity> {
    return this.documentsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '문서 삭제' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.documentsService.remove(id);
  }
}
