import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AskDto {
  @ApiProperty({ description: '질문 내용', example: '이 문서의 주요 내용은?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiPropertyOptional({
    description: '특정 문서 ID (없으면 전체 문서 대상)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsOptional()
  documentId?: string;
}
