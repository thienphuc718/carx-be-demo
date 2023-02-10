import { Module } from '@nestjs/common';
import { CurlModule } from '../../curl/module/CurlModule';
import { CallServiceImplement } from '../service/CallServiceImplement';
import { ICallService } from '../service/CallServiceInterface';

@Module({
  imports: [CurlModule],
  providers: [
    {
      provide: ICallService,
      useClass: CallServiceImplement,
    },
  ],
  exports: [ICallService],
})
export class CallModule {}
