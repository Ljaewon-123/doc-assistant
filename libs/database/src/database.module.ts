import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { ChunkEntity } from './entities/chunk.entity';
import { DocumentEntity } from './entities/document.entity';
import { ChunkRepository } from './repositories/chunk.repository';
import { DocumentRepository } from './repositories/document.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('databaseUrl'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        autoLoadEntities: true, // forFeature로 등록된 엔티티 자동으로 DataSource에 추가
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: true, // 개발 환경만. 프로덕션에서는 마이그레이션 사용
      }),
    }),
    TypeOrmModule.forFeature([DocumentEntity, ChunkEntity]),
  ],
  providers: [DocumentRepository, ChunkRepository],
  exports: [DocumentRepository, ChunkRepository],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
  }
}
