import { Body, Controller, Post } from '@nestjs/common';
import { IAskResult } from '@app/common';
import { ChatService } from './chat.service';
import { AskDto } from './dto/ask.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  ask(@Body() dto: AskDto): Promise<IAskResult> {
    return this.chatService.ask(dto.question, dto.documentId);
  }
}
