import { Module } from '@nestjs/common';
import { IOtpService } from '../service/OtpServiceInterface';
import { OtpServiceImplement } from '../service/OtpServiceImplement';
import {CurlModule} from "../../curl/module/CurlModule";
import {SmsController} from "../controller/SmsController";

@Module({
  imports: [CurlModule],
  providers: [
    {
      provide: IOtpService,
      useClass: OtpServiceImplement,
    },
  ],
  exports: [IOtpService],
  controllers: [SmsController]
})
export class OtpModule {}
