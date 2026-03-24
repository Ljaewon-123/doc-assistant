import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  upload(_file: Express.Multer.File): Promise<unknown> {
    return Promise.reject(new Error('Not implemented'));
  }

  findAll(): Promise<unknown[]> {
    return Promise.reject(new Error('Not implemented'));
  }

  findOne(_id: string): Promise<unknown> {
    return Promise.reject(new Error('Not implemented'));
  }

  remove(_id: string): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }
}
