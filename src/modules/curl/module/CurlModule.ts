import { Module } from '@nestjs/common';
import { CurlServiceImplementation } from '../service/CurlServiceImplement';
import { ICurlService } from '../service/CurlServiceInterface';

@Module({
  imports: [],
  providers: [
    {
      provide: ICurlService,
      useClass: CurlServiceImplementation,
    },
  ],
  exports: [ICurlService]
})
export class CurlModule {}
