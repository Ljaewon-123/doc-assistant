import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class RewriteDto {
  @ApiProperty({ description: '문서 ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({ description: '수정 지시사항 (예: "더 간결하게 작성해줘")' })
  @IsString()
  @IsNotEmpty()
  instruction: string;

  @ApiPropertyOptional({
    description: '수정할 섹션 제목 (없으면 전체 문서 수정)',
  })
  @IsString()
  @IsOptional()
  section?: string;
}
