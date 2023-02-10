import {
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
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiExcludeController,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IStaffService } from '../service/StaffServiceInterface';
import { IAuthService } from '../../auth/service/AuthServiceInterface';
import * as express from 'express';
import {
  CreateStaffPayloadDto,
  FilterStaffDto,
  UpdateStaffPayloadDto,
  ChangePasswordStaffPayloadDto,
} from '../dto/StaffDto';
import { AuthGuard, PermissionGuard } from '../../../guards';

import { SignInDto } from '../../auth/dto/AuthDto';

import { Result } from '../../../results/Result';
import { havePermission } from '../../../helpers/checkPermissionHelper';
import { CARX_MODULES } from '../../../constants';

@ApiTags('Staffs')
// @ApiExcludeController()
@Controller('/v1/staffs')
export class StaffController extends BaseController {
  constructor(
    @Inject(IStaffService)
    private readonly staffService: IStaffService,
    @Inject(IAuthService)
    private readonly authService: IAuthService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Staffs' })
  async getAllStaffs(
    @Res() response: express.Response,
    @Query() getStaffsDto: FilterStaffDto,
  ) {
    try {
      const staffs = await this.staffService.getStaffList(getStaffsDto);
      const total = await this.staffService.countStaffByCondition(getStaffsDto);
      const data = staffs.map((staff) => staff.transformToResponse());
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          staff_list: data,
          total: total,
        },
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
  @ApiOperation({ summary: 'Get Staff Detail' })
  async getStaffDetail(
    @Res() response: express.Response,
    @Param('id') staffId: string,
  ) {
    try {
      const staff = await this.staffService.getStaffDetails(staffId);
      let result = null;
      if (staff) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          data: staff.transformToResponse(),
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Staff not found',
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

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @SetMetadata('permission', CARX_MODULES.STAFFS)
  @ApiOperation({ summary: 'Create Staff' })
  async createNewStaff(
    @Res() response: express.Response,
    @Body() createStaffDto: CreateStaffPayloadDto,
    @Req() request: express.Request,
  ) {
    try {
      if (!havePermission(request.user, CARX_MODULES.STAFFS)) {
        throw new Error('user does not have permission');
      }
      const createdStaff = await this.staffService.createStaff(createStaffDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdStaff.transformToResponse(),
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

  @Put('/change-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @SetMetadata('permission', CARX_MODULES.STAFFS)
  @ApiOperation({ summary: 'Change Staff Password' })
  async changePasswordStaff(
    @Res() response: express.Response,
    @Body() updateStaffDto: ChangePasswordStaffPayloadDto,
    @Req() request: express.Request,
  ) {
    try {
      const updatedStaff = await this.staffService.changePassword(
        updateStaffDto,
        request.user.id,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedStaff,
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

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @SetMetadata('permission', CARX_MODULES.STAFFS)
  @ApiOperation({ summary: 'Update Staff' })
  async updateStaff(
    @Res() response: express.Response,
    @Body() updateStaffDto: UpdateStaffPayloadDto,
    @Param('id') staffId: string,
    @Req() request: express.Request,
  ) {
    try {
      if (!havePermission(request.user, CARX_MODULES.STAFFS)) {
        throw new Error('user does not have permission');
      }
      const updatedStaff = await this.staffService.updateStaff(
        staffId,
        updateStaffDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedStaff.transformToResponse(),
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

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @SetMetadata('permission', CARX_MODULES.STAFFS)
  @ApiOperation({ summary: 'Delete A Staff' })
  async deleteStaff(
    @Res() response: express.Response,
    @Param('id') staffId: string,
    @Req() request: express.Request,
  ) {
    try {
      if (!havePermission(request.user, CARX_MODULES.STAFFS)) {
        throw new Error('user does not have permission');
      }
      await this.staffService.deleteStaff(staffId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a staff',
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

  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign In' })
  async signIn(
    @Res() response: express.Response,
    @Body() signInDto: SignInDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdAuth = await this.staffService.signIn(signInDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdAuth.transformToStaffAuth(),
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
