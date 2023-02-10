import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min, IsEnum, IsString } from "class-validator";
import {
  RequestOTPMethodEnum,
  AuthMethodEnum,
  ForgetPasswordMethodEnum,
  SignInMethodEnum
} from '../enum/AuthEnum';

import { UserTypeEnum } from '../../users/enum/UserEnum';

export class SignInDto {
  @IsNotEmpty()
  @IsEnum(SignInMethodEnum)
  method: SignInMethodEnum;

  @IsNotEmpty()
  payload: any;
}

export class RequestOtpDto {
  @IsNotEmpty()
  @IsEnum(RequestOTPMethodEnum)
  method: RequestOTPMethodEnum;

  @IsNotEmpty()
  payload: any;
}

export class SignUpDto {
  @IsNotEmpty()
  @IsEnum(AuthMethodEnum)
  method: AuthMethodEnum;

  @IsNotEmpty()
  payload: any;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}

export class VerifyDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  payload: any;
}

export class SignUpEmailPasswordDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  schema: string;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}

export class SignInEmailPasswordDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  schema: string;
}

export class SignUpPhoneNumberPasswordDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  schema: string;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}

export class SignInPhoneNumberPasswordDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  schema: string;
}

export class SignUpPhoneNumberOtpDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  schema: string;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}

export class SignInPhoneNumberOtpDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  schema: string;
}

export class SignInResponseDto {
  @IsNotEmpty()
  user: any;

  @IsNotEmpty()
  token: string;
}

export class RequestESmsOtpDto {
  @IsNotEmpty()
  phone_number: any;

  @IsOptional()
  user: any;
}

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsEnum(ForgetPasswordMethodEnum)
  method: ForgetPasswordMethodEnum;

  @IsNotEmpty()
  payload: any;
}

export class ForgetPasswordESmsDto {
  @IsNotEmpty()
  phone_number: any;
}

export class GoogleAuthTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class RequestEmailOtpDto {
  @IsNotEmpty()
  email: string;

  @IsOptional()
  user?: any;
}

export class ForgetPasswordEmailDto {
  @IsNotEmpty()
  email: string;
}

export class SignUpEmailOtpDto {
  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  schema: string;

  @IsNotEmpty()
  @IsEnum(UserTypeEnum)
  type: UserTypeEnum;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class CheckUserTypeDto {
  @IsNotEmpty()
  @IsString()
  phone_number: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  new_password: string;
}