import { Inject, Injectable } from '@nestjs/common';

import {
  SignUpPhoneNumberPasswordDto,
  SignInPhoneNumberPasswordDto,
  SignInResponseDto,
  RequestESmsOtpDto
} from '../dto/AuthDto';

import {
  CreateUserMethodEnum
} from '../../users/enum/UserEnum';

import {
  generateJwtToken,
  getJwtPayload
} from '../../../helpers/jwtHelper';
import { comparePassword, hashingPassword } from '../../../helpers/passwordHelper';

import { UserModel } from '../../../models/Users';
import { IUserService } from '../../users/service/UserServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { generatePassword } from '../../../helpers/passwordHelper';
import { generateRandomOtpCode } from '../../../helpers/otpHelper';
import { ICallService } from '../../call/service/CallServiceInterface';
import { IOtpService } from "../../otp/service/OtpServiceInterface";
import { add } from "date-fns";

export class AuthServicePhoneNumberPassword {
  constructor(
    @Inject(IUserService)
    private userService: IUserService,
    @Inject(ICallService)
    private callService: ICallService,
    @Inject(IOtpService)
    private otpServie: IOtpService,
  ) { }

  async signUp(data: SignUpPhoneNumberPasswordDto, schema: string): Promise<UserModel> {
    try {
      const existedUser = await this.userService.getUserByCondition({ phone_number: data.phone_number }, schema);
      if (existedUser) {
        throw new Error('Phone number is already in use');
      }
      const otp = generateRandomOtpCode();
      // this.callService.call(data.phone_number, `Mã xác thực của bạn là: ${otp.split("").join("  ")}`);
      const isOtpSent = await this.otpServie.sendOtpViaPhoneNumber(data.phone_number, otp);
      if (!isOtpSent) {
        throw new Error('Cannot send OTP code, service is currently under maintenance')
      }
      const user = await this.userService.createUser({
        ...data,
        method: CreateUserMethodEnum.PHONE_NUMBER,
        password: data.password,
        email: (Date.now() + generatePassword() + "@temp.com"),
      }, schema);
      if (user) {
        user.otp = otp;
        user.otp_expiry_time = add(new Date(), { minutes: 5 });
        return user.save();
      }
    } catch (error) {
      throw error;
    }
  }

  async signIn(data: SignInPhoneNumberPasswordDto, schema: string): Promise<UserModel> {
    try {
      const existedUser = await this.userService.getUserByCondition({
        phone_number: data.phone_number
      }, schema);
      if (!existedUser) {
        throw new Error('User does not exist');
      }
      const isPasswordCorrect: boolean = await comparePassword(
        data.password,
        existedUser.password,
      );

      if (!isPasswordCorrect) {
        throw new Error('Password is not correct');
      }
      // TODO: hard code for test schema
      existedUser.schema = 'public';
      const token: string = generateJwtToken(getJwtPayload(existedUser));
      await this.userService.updateUser(existedUser.id, { ...existedUser, token }, schema);
      return this.userService.getUserDetail(existedUser.id, schema);
    } catch (error) {
      throw error;
    }
  }
}
