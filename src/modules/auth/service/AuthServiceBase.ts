import { Inject, Injectable } from '@nestjs/common';

import {
  SignInDto,
  SignUpDto,
  RequestOtpDto,
  ForgetPasswordDto,
  VerifyOtpDto,
  CheckUserTypeDto, ResetPasswordDto
} from "../dto/AuthDto";

import {
  RequestOTPMethodEnum,
  AuthMethodEnum,
  ForgetPasswordMethodEnum,
  SignInMethodEnum
} from '../enum/AuthEnum';

import { UserModel } from '../../../models';

import { IAuthService } from './AuthServiceInterface';
import { AuthServiceEmailPassword } from './AuthServiceEmailPassword';
import { AuthServicePhoneNumberPassword } from './AuthServicePhoneNumberPassword';
import { AuthServicePhoneNumberOtp } from './AuthServicePhoneNumberOtp';
import { v4 as uuidv4 } from 'uuid';
import { GoogleAuthService } from './GoogleAuthService';
import { AuthServiceEmailOtp } from './AuthServiceEmailOtp';
import { generateRandomOtpCode } from '../../../helpers/otpHelper';
import { IUserService } from '../../users/service/UserServiceInterface';
import { hashingPassword } from "../../../helpers/passwordHelper";

@Injectable()
export class AuthServiceBase implements IAuthService {
  constructor(
    private authServiceEmailPassword: AuthServiceEmailPassword,
    private authServicePhoneNumberOtp: AuthServicePhoneNumberOtp,
    private authServicePhoneNumberPassword: AuthServicePhoneNumberPassword,
    private googleAuthService: GoogleAuthService,
    private authServiceEmailOtp: AuthServiceEmailOtp,
    @Inject(IUserService)
    private userService: IUserService
  ) {
  }

  async signUp(data: SignUpDto, schema: string): Promise<UserModel | { message: string }> {
    try {
      if (data.method === AuthMethodEnum.EMAIL_PASSWORD) {
        const user = await this.authServiceEmailPassword.signUp({
          id: uuidv4(),
          method: data.method,
          ...data.payload,
          type: data.type,
          schema: schema
        }, schema);
        const response = await this.userService.getUserDetail(user.id, 'public');
        return response.transformToResponse();
      }
      if (data.method === AuthMethodEnum.PHONE_NUMBER_OTP) {
        const payload = await this.authServicePhoneNumberOtp.signUp({
          method: data.method,
          ...data.payload,
          type: data.type,
          schema: schema
        }, schema)
        return payload
      } else if(data.method === AuthMethodEnum.PHONE_NUMBER_PASSWORD) {
        const payload = await this.authServicePhoneNumberPassword.signUp({
          method: data.method,
          ...data.payload,
          type: data.type,
          schema: schema
        }, schema);
        const response = await this.userService.getUserDetail(payload.id, 'public');
        return response.transformToResponse();
      } else {
        throw new Error("method does not support");
      }
    } catch (error) {
      throw error;
    }
  }

  requestOtp(data: RequestOtpDto, schema: string): Promise<boolean> {
    try {
      if (data.method == RequestOTPMethodEnum.SMS) {
        const isSent = this.authServicePhoneNumberOtp.requestOtp({
          ...data.payload,
          schema: schema
        }, schema)
        return isSent;
      } else {
        throw new Error("method does not support");
      }
    } catch (error) {
      throw error;
    }
  }

  async forgetPassword(data: ForgetPasswordDto, schema: string): Promise<boolean> {
    try {
      let isSent = false;
      if (data.method == ForgetPasswordMethodEnum.SMS_OTP) {
        isSent = await this.authServicePhoneNumberOtp.forgetPassword({
          ...data.payload,
          schema: schema
        }, schema)
      } else if (data.method == ForgetPasswordMethodEnum.EMAIL_OTP) {
        isSent = await this.authServiceEmailOtp.forgetPassword({
          ...data.payload,
          schema: schema
        }, schema);
      } else {
        throw new Error("method does not support");
      }
      return isSent;
    } catch (error) {
      throw error;
    }
  }

  signIn(data: SignInDto, schema: string): Promise<UserModel> {
    try {
      if (data.method == SignInMethodEnum.EMAIL_PASSWORD) {
        const userPayload = this.authServiceEmailPassword.signIn({
          method: data.method,
          ...data.payload,
          schema: schema
        }, schema)
        return userPayload
      } else if(data.method == SignInMethodEnum.PHONE_NUMBER_OTP) {
        const userPayload = this.authServicePhoneNumberOtp.signIn({
          method: data.method,
          ...data.payload,
          schema: schema
        }, schema)
        return userPayload
      } if(data.method == SignInMethodEnum.PHONE_NUMBER_PASSWORD) {
        const userPayload = this.authServicePhoneNumberPassword.signIn({
          method: data.method,
          ...data.payload,
          schema: schema
        }, schema)
        return userPayload
      } else if (data.method === SignInMethodEnum.GOOGLE) {
        const payload = this.googleAuthService.signInGoogleUser(data.payload, schema);
        return payload;
      } else {
        throw new Error("method does not support");
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(data: VerifyOtpDto, schema: string): Promise<boolean> {
    const { phone_number, otp } = data;
    const user = await this.userService.getUserByCondition({ phone_number }, schema);
    if (!user) {
      throw new Error('User not found');
    }
    const now = new Date();
    if (now > user.otp_expiry_time) {
      throw new Error('OTP code expired');
    }
    if (user.otp !== otp) {
      throw new Error('OTP not valid');
    } else {
      user.is_verified = true;
      await user.save();
      return true;
    }
  }

  async checkUserType(data: CheckUserTypeDto, schema: string): Promise<{ type: string | null }> {
    try {
      const { phone_number } = data;
      const existedUser = await this.userService.getUserByCondition({ phone_number: phone_number }, schema);
      if (!existedUser) {
        return {
          type: null,
        }
      }
      const response = await this.userService.getUserDetail(existedUser.id, schema);

      if (response.staff_details) {
        return {
          type: 'STAFF'
        }
      } else if (response.agent_details) {
        return {
          type: 'AGENT'
        }
      } else if (response.customer_details) {
        return {
          type: 'CUSTOMER'
        }
      }
      
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordDto, userId: string): Promise<boolean> {
    try {
      const { new_password } = data
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) {
        return false
      }
      const updatedUser = await this.userService.updateUser(user.id, { password: new_password }, 'public');
      return !!updatedUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
