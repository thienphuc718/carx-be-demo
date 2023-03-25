import { Inject } from '@nestjs/common';
import { IOtpService } from '../../otp/service/OtpServiceInterface';
import { IUserService } from '../../users/service/UserServiceInterface';
import { ForgetPasswordEmailDto, RequestEmailOtpDto } from '../dto/AuthDto';

export class AuthServiceEmailOtp {
  constructor(
    @Inject(IUserService) private userService: IUserService,
    @Inject(IOtpService) private otpService: IOtpService,
  ) { }

  async requestOtp(data: RequestEmailOtpDto, schema: string): Promise<boolean> {
    try {
      let user = null;
      if (data.user) {
        user = data.user;
      } else {
        user = await this.userService.getUserByCondition(
          {
            email: data.email,
          },
          schema,
        );
      }

      // Check if user existed
      if (!user) {
        return false;
      }

      // Check if OTP code sent successfully
      const isSent = await this.otpService.sendOtpViaEmail(data.email);
      if (isSent) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(
    data: ForgetPasswordEmailDto,
    schema: string,
  ): Promise<any> {
    const existedUser = await this.userService.getUserByCondition(
      {
        email: data.email,
      },
      schema,
    );
    if (!existedUser) throw new Error('User not found');
    const checked = await this.requestOtp(
      {
        email: data.email,
        user: existedUser,
      },
      schema,
    );
    if (checked) {
      return { message: 'Please verify your SMS OTP' };
    }
  }
}
