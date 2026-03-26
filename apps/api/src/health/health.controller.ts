import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'DB 연결 상태 체크' })
  check(): { status: string; db: boolean } {
    const dbConnected = this.dataSource.isInitialized;
    return {
      status: dbConnected ? 'ok' : 'degraded',
      db: dbConnected,
    };
  }
}
