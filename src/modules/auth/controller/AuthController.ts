import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  Req, UseGuards, BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BaseController } from '../../../BaseController';
import { IAuthService } from '../service/AuthServiceInterface';
import * as express from 'express';

import { getSchemaFromUrl } from '../../../helpers/jwtHelper';

import {
  SignInDto,
  SignUpDto,
  RequestOtpDto,
  ForgetPasswordDto,
  VerifyOtpDto,
  CheckUserTypeDto, ResetPasswordDto
} from "../dto/AuthDto";
import { Result } from '../../../results/Result';
import { AuthGuard } from "../../../guards";
import { IUserService } from "../../users/service/UserServiceInterface";

@ApiTags('Auth')
@Controller('/v1/auth')
export class AuthController extends BaseController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService,
    @Inject(IUserService)
    private readonly userService: IUserService,
  ) {
    super();
  }

  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign In' })
  async signIn(
    @Res() response: express.Response,
    @Body() signInDto: SignInDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createdAuth = await this.authService.signIn(signInDto, schema);

      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdAuth.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/sign-up')
  @ApiOperation({ summary: 'Sign Up' })
  async signUp(
    @Res() response: express.Response,
    @Body() signUpDto: SignUpDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);

      const res = await this.authService.signUp(signUpDto, schema);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: res,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/request-otp')
  @ApiOperation({ summary: 'Request OTP' })
  async requestOtp(
    @Res() response: express.Response,
    @Body() requestOtpDto: RequestOtpDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      let result: any = {};
      const res = await this.authService.requestOtp(requestOtpDto, schema);
      if (res) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Send OTP Successfully',
        });
        return this.ok(response, result.value);
      } else {
        result = Result.fail({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Cannot send OTP request',
        });
        return this.fail(response, result.error);
      }
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/check-user-type')
  @ApiOperation({ summary: 'Check User Type' })
  async checkUserType(
    @Res() response: express.Response,
    @Body() checkUserTypeDto: CheckUserTypeDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const user = await this.authService.checkUserType(
        checkUserTypeDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: user,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/forget-password')
  @ApiOperation({ summary: 'Forget Password' })
  async forgetPassword(
    @Res() response: express.Response,
    @Body() forgetPassword: ForgetPasswordDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);

      const res = await this.authService.forgetPassword(forgetPassword, schema);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: res,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verify OTP'})
  async verifyOtp(
    @Res() response: express.Response,
    @Body() verifyOtpDto: VerifyOtpDto,
    @Req() request: express.Request,
  ) {
    try {
      const isOtpVerified = await this.authService.verifyOtp(verifyOtpDto, 'public');
      let result = null;
      if (!isOtpVerified) {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'OTP not valid',
        });
        return this.fail(response, result.error);
      } else {
        const user = await this.userService.getUserByCondition({ phone_number: verifyOtpDto.phone_number }, 'public');
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Verify OTP successful',
          data: {
            temp_token: user.token,
          }
        });
        return this.ok(response, result.value);
      }
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async resetPassword(
    @Res() response: express.Response,
    @Body() resetPassword: ResetPasswordDto,
    @Req() request: express.Request,
  ) {
    try {
      const userId = request.user.id;
      const isResetPasswordSucessful =  await this.authService.resetPassword(resetPassword, userId);
      let result = null;
      if (!isResetPasswordSucessful) {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Reset password failed',
        });
        return this.fail(response, result.error);
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          data: {
            message: 'Reset password succeeded',
          },
        });
        return this.ok(response, result.value);
      }
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
