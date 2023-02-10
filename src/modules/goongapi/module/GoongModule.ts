import { Module } from '@nestjs/common';
import { CurlModule } from '../../curl/module/CurlModule';
import { GoongServiceImplement } from '../service/GoongServiceImplement';
import { IGoongService } from '../service/GoongServiceInterface';

@Module({
  imports: [CurlModule],
  providers: [
    {
      provide: IGoongService,
      useClass: GoongServiceImplement,
    },
  ],
  exports: [IGoongService],
})
export class GoongModule {}
