import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ESmsServiceImplementation } from '../service/ESmsServiceImplement';
import { ISmsService } from '../service/SmsServiceInterface';
import { CurlModule } from '../../curl/module/CurlModule';

@Module({
  imports: [ CurlModule ],
  providers: [
    {
      provide: ISmsService,
      useClass: ESmsServiceImplementation,
    },
  ],
  exports: [ISmsService]
})
export class SmsModule {}
