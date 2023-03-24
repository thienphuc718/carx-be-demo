import { Inject } from '@nestjs/common';
import {
  SignUpPhoneNumberOtpDto,
  SignInPhoneNumberOtpDto,
  ForgetPasswordDto,
  ForgetPasswordESmsDto,
  RequestESmsOtpDto
} from '../dto/AuthDto';
import { CreateUserMethodEnum } from '../../users/enum/UserEnum';
import { generateJwtToken, getJwtPayload } from '../../../helpers/jwtHelper';
import { generatePassword } from '../../../helpers/passwordHelper';
import { UserModel } from '../../../models/Users';
import { IUserService } from '../../users/service/UserServiceInterface';
import { ISmsService } from '../../sms/service/SmsServiceInterface';
import { ICallService } from '../../call/service/CallServiceInterface';
import { generateRandomOtpCode } from '../../../helpers/otpHelper';
import {IOtpService} from "../../otp/service/OtpServiceInterface";
import { add } from "date-fns";

export class AuthServicePhoneNumberOtp {
  constructor(
    @Inject(IUserService)
    private userService: IUserService,
    @Inject(ISmsService)
    private smsService: ISmsService,
    @Inject(ICallService)
    private callService: ICallService,
    @Inject(IOtpService)
    private otpServie: IOtpService,
  ) {
  }

  async requestOtp(data: RequestESmsOtpDto, schema: string): Promise<boolean> {
    try {
      const otp = generateRandomOtpCode();
      let user = null;
      if (data.user) {
        user = data.user;
      } else {
        user = await this.userService.getUserByCondition({
          phone_number: data.phone_number
        }, schema);
      };

      // Check if user existed
      if (!user) {
        return false;
      }

      // check isOtpSent
      // TODO: using call service temporarily
      // const isSent = await this.smsService.send(data.phone_number, `Ma xac thuc cua ban la: ${otp}`);
      // this.callService.call(data.phone_number, `Mã xác thực của bạn là: ${otp.split("").join("  ")}`);
      const isOtpSent = await this.otpServie.sendOtpViaPhoneNumber(data.phone_number, otp);
      if (!isOtpSent) {
        throw new Error('Cannot send OTP code, service is currently under maintenance')
      }
      await this.userService.updateUser(user.id, { otp, otp_expiry_time: add(new Date(), { minutes: 5 }) }, schema);
      return true;
    } catch (error) {
      throw error
    }
  }

  async signUp(data: SignUpPhoneNumberOtpDto, schema: string): Promise<{ message: string }> {
    try {
      const existedUser = await this.userService.getUserByCondition({
        phone_number: data.phone_number
      }, schema);
      if (!existedUser) {
        const user = await this.userService.createUser({
          ...data,
          method: CreateUserMethodEnum.PHONE_NUMBER,
          password: generatePassword(),
          email: (Date.now() + generatePassword() + "@temp.com")
        }, schema);
        if (user) {
          const otp = generateRandomOtpCode();
          // this.callService.call(data.phone_number, `Mã xác thực của bạn là: ${otp.split("").join("  ")}`);
          const isOtpSent = await this.otpServie.sendOtpViaPhoneNumber(data.phone_number, otp);
          if (!isOtpSent) {
            throw new Error('Cannot send OTP code, service is currently under maintenance')
          }
          await this.userService.updateUser(user.id, { otp, otp_expiry_time: add(new Date(), { minutes: 5 }) }, schema);
          return { message: "Please verify your SMS OTP" }
        } else {
          throw new Error('User create error. Please try again later');
        }
      } else {
        if (existedUser.is_verified) {
          throw new Error('User is existed');
        } else {
          const checked = await this.requestOtp({
            phone_number: data.phone_number,
            user: existedUser
          }, schema);
          if (checked) {
            return { message: "Please verify your OTP" }
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async forgetPassword(data: ForgetPasswordESmsDto, schema: string): Promise<any> {
    const existedUser = await this.userService.getUserByCondition({
      phone_number: data.phone_number
    }, schema);
    if (!existedUser) throw new Error('User not found');
    const checked = await this.requestOtp({
      phone_number: data.phone_number,
      user: existedUser
    }, schema);
    if (checked) {
      return { message: "Please verify your SMS OTP" }
    }
  }

  async signIn(data: SignInPhoneNumberOtpDto, schema: string): Promise<UserModel> {
    try {
      const existedUser = await this.userService.getUserByCondition({
        phone_number: data.phone_number
      }, schema);
      if (!existedUser) {
        throw new Error('User does not exist');
      }
      if (existedUser.otp != data.otp) {
        throw new Error('SMS OTP is not correct');
      }
      // TODO: hard code for test schema
      existedUser.schema = 'public';
      const token: string = generateJwtToken(getJwtPayload(existedUser));
      await this.userService.updateUser(
        existedUser.id,
        { ...existedUser, token, is_verified: true }, schema
      );
      return this.userService.getUserDetail(existedUser.id, schema);
    } catch (error) {
      throw error;
    }
  }
}
