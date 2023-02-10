import { Module } from '@nestjs/common';
import { FileServiceImplementation } from '../service/FileServiceImplementation';
import { IFileService } from '../service/FileServiceInterface';
import { FileController } from '../controller/FileController';

@Module({
  providers: [
    {
      provide: IFileService,
      useClass: FileServiceImplementation,
    },
  ],
  exports: [IFileService],
  controllers: [FileController],
})
export class FileModule {}
