import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from '../controller/AuthController';
import { UserModel } from '../../../models';
import { AuthServiceBase } from '../service/AuthServiceBase';
import { AuthServiceEmailPassword } from '../service/AuthServiceEmailPassword';
import { AuthServicePhoneNumberOtp } from '../service/AuthServicePhoneNumberOtp';
import { AuthServicePhoneNumberPassword } from '../service/AuthServicePhoneNumberPassword';
import { IAuthService } from '../service/AuthServiceInterface';

import { UserModule } from '../../users/module/UserModule';
import { SmsModule } from '../../sms/module/SmsModule';
import { GoogleAuthService } from '../service/GoogleAuthService';
import { AuthServiceEmailOtp } from '../service/AuthServiceEmailOtp';
import { OtpModule } from '../../otp/module/OtpModule';
import { CallModule } from '../../call/module/CallModule';

@Module({
  imports: [
    forwardRef(() => UserModule), 
    SmsModule,
    OtpModule,
    CallModule
  ],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthServiceBase,
    },
    AuthServiceEmailPassword,
    AuthServicePhoneNumberOtp,
    AuthServicePhoneNumberPassword,
    GoogleAuthService,
    AuthServiceEmailOtp,
  ],
  controllers: [AuthController],
  exports: [IAuthService]
})
export class AuthModule {}
