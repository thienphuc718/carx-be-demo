import {
  Body,
  Controller,
  ForbiddenException,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { ISystemConfigurationService } from '../service/SystemConfigurationServiceInterface';
import * as express from 'express';
import {
  CreateSystemConfigurationDto,
  FilterSystemConfigurationDto,
  UpdateSystemConfigurationDto,
} from '../dto/SystemConfigurationDto';
import { Result } from '../../../results/Result';
import { IUserService } from '../../users/service/UserServiceInterface';
import { AuthGuard } from '../../../guards';

@Controller('/v1/system-configurations')
@ApiTags('System Configurations')
export class SystemConfigurationController extends BaseController {
  constructor(
    @Inject(ISystemConfigurationService)
    private systemConfigurationService: ISystemConfigurationService,
    @Inject(forwardRef(() => IUserService)) private userService: IUserService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All System Configurations' })
  async getSystemConfigurationList(
    @Res() response: express.Response,
    @Query() payload: FilterSystemConfigurationDto,
  ) {
    try {
      const systemConfigurations =
        await this.systemConfigurationService.getSystemConfigurationList(
          payload,
        );
      const total =
        await this.systemConfigurationService.countSystemConfigurationByCondition(
          payload,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          system_configuration_list: systemConfigurations,
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const result = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, result.error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get System Configuration Detail' })
  async getSystemConfigurationDetail(
    @Res() response: express.Response,
    @Param('id') systemConfigurationId: string,
    @Req() request: express.Request,
  ) {
    try {
      // const isStaffUser = await this.isStaffUser(request.user.id);
      // if (!isStaffUser) {
      //   throw new ForbiddenException({
      //     statusCode: HttpStatus.FORBIDDEN,
      //     message: 'User is not staff',
      //   });
      // }
      const systemConfiguration =
        await this.systemConfigurationService.getSystemConfigurationDetailById(
          systemConfigurationId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: systemConfiguration,
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create System Configuration' })
  async createNewSystemConfiguration(
    @Res() response: express.Response,
    @Body() createSystemConfigurationDto: CreateSystemConfigurationDto,
    @Req() request: express.Request,
  ) {
    try {
      const userId = request.user.id;
      const isStaffUser = await this.isStaffUser(userId);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      const createdSystemConfiguration =
        await this.systemConfigurationService.createSystemConfiguration(
          createSystemConfigurationDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdSystemConfiguration,
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update System Configuration' })
  async updateSystemConfiguration(
    @Res() response: express.Response,
    @Body() updateSystemConfigurationDto: UpdateSystemConfigurationDto,
    @Param('id') systemConfigurationId: string,
    @Req() request: express.Request,
  ) {
    try {
      const isStaffUser = await this.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      const updatedSystemConfiguration =
        await this.systemConfigurationService.updateSystemConfiguration(
          systemConfigurationId,
          updateSystemConfigurationDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedSystemConfiguration,
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

  private async isStaffUser(userId: string): Promise<boolean> {
    try {
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.staff_details) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
