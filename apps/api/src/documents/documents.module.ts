import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseModule } from '@app/database';
import { ParserModule } from '@app/parser';
import { EmbeddingModule } from '@app/embedding';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: diskStorage({
          destination: config.get<string>('uploadDir', './uploads'),
          filename: (_req, file, cb) => {
            const ext = extname(file.originalname);
            cb(null, `${uuidv4()}${ext}`);
          },
        }),
        fileFilter: (
          _req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, acceptFile: boolean) => void,
        ) => {
          const allowed = ['.md', '.docx', '.pdf'];
          const ext = extname(file.originalname).toLowerCase();
          if (allowed.includes(ext)) {
            cb(null, true);
          } else {
            cb(new Error(`Unsupported file type: ${ext}`), false);
          }
        },
      }),
    }),
    DatabaseModule,
    ParserModule,
    EmbeddingModule,
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
