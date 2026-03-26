import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IAskResult } from '@app/common';
import { ChatService } from './chat.service';
import { AskDto } from './dto/ask.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  @ApiOperation({
    summary: '문서 기반 질문 답변',
    description:
      'RAG 기반으로 업로드된 문서에서 관련 내용을 검색하여 답변합니다.',
  })
  ask(@Body() dto: AskDto): Promise<IAskResult> {
    return this.chatService.ask(dto.question, dto.documentId);
  }
}
