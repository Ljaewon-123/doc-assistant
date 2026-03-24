import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('ask')
  ask(
    @Body() body: { question: string; documentId?: string },
  ): Promise<unknown> {
    return this.chatService.ask(body.question, body.documentId);
  }
}
