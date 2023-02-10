import {
  UseGuards,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../../guards';
import { BaseController } from '../../../BaseController';
import { IUserService } from '../service/UserServiceInterface';
import * as express from 'express';
import { ChangePasswordDto, CreateUserDto, FilterUserDto, UpdateUserDto } from '../dto/UserDto';
import { Result } from '../../../results/Result';
import { getSchemaFromUrl } from '../../../helpers/jwtHelper';

@Controller('/v1/users')
@ApiTags('Users')
@ApiBearerAuth()
export class UserController extends BaseController {
  constructor(
    @Inject(IUserService)
    private readonly userService: IUserService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  async getAllUsers(
    @Res() response: express.Response,
    @Query() getUsersDto: FilterUserDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const users = await this.userService.getUserList(getUsersDto, schema);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: users,
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

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get User Detail' })
  async getUserDetail(
    @Res() response: express.Response,
    @Param('id') userId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const user = await this.userService.getUserDetail(userId, schema);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: user.transformToResponse(),
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

  @Post()
  @ApiOperation({ summary: 'Create User' })
  async createNewUser(
    @Res() response: express.Response,
    @Body() createUserDto: CreateUserDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const createdUser = await this.userService.createUser(
        createUserDto,
        schema,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdUser,
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

  @Post('/change-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Res() response: express.Response,
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const userId = request.user.id;
      const isPasswordChanged = await this.userService.changePassword(userId, changePasswordDto, schema);
      let result = null;
      if (isPasswordChanged) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: "Change password successfully",
        });
      } else {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Failed to change password",
        })
      }
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update User' })
  async updateUser(
    @Res() response: express.Response,
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') userId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updatedUser = await this.userService.updateUser(
        userId,
        updateUserDto,
        schema,
      );
      let result = null;
      if (updatedUser) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: "Successfully update user",
          data: updatedUser,
        });
      } else {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Failed to update user info",
        });
      }
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        errorCode: error.code,
        data: error.value
      });
      return this.fail(response, err.error);
    }
  }

  @Put('/detail/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update User Personal Information' })
  async updatePersonalUserInfo(
    @Res() response: express.Response,
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') userId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const updatedUser = await this.userService.updatePersonalInfo(
        userId,
        updateUserDto,
        schema,
      );
      let result = null;
      if (updatedUser) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: "Successfully update user",
          data: updatedUser,
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Failed to update user info",
        });
      }
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Disable A User' })
  async deleteUser(
    @Res() response: express.Response,
    @Param('id') userId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      await this.userService.disableUser(userId, schema);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully delete user',
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

  @Delete('/:id/delete')
  @ApiOperation({ summary: 'Delete A User' })
  async hardDeleteUser(
    @Res() response: express.Response,
    @Param('id') userId: string,
    @Req() request: express.Request,
  ) {
    try {
      const schema = getSchemaFromUrl(request);
      const res = await this.userService.hardDeleteUser(userId, schema);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: res.message,
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
}
