import {
  SignInDto,
  SignUpDto,
  RequestOtpDto,
  ForgetPasswordDto,
  VerifyOtpDto,
  CheckUserTypeDto, ResetPasswordDto
} from "../dto/AuthDto";

import { UserModel } from '../../../models/Users';

export interface IAuthService {
  signUp(data: SignUpDto, schema: string): Promise<UserModel | { message: string }>;
  requestOtp(data: RequestOtpDto, schema: string): Promise<boolean>;
  forgetPassword(data: ForgetPasswordDto, schema: string): Promise<boolean>;
  signIn(data: SignInDto, schema: string): Promise<UserModel>;
  verifyOtp(data: VerifyOtpDto, schema: string): Promise<boolean>;
  checkUserType(data: CheckUserTypeDto, schema: string): Promise<{ type: string | null }>;
  resetPassword(data: ResetPasswordDto, userId: string): Promise<boolean>;
}

export const IAuthService = Symbol('IAuthService');
