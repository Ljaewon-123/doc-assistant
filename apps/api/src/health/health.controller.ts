import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  check(): { status: string; db: boolean } {
    const dbConnected = this.dataSource.isInitialized;
    return {
      status: dbConnected ? 'ok' : 'degraded',
      db: dbConnected,
    };
  }
}
