import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { INotificationService } from '../service/NotificationServiceInterface';
import * as express from 'express';
import {
  CreateNotificationDto,
  FilterAppNotificationDto,
  FilterNotificationDto,
  UpdateNotificationDto,
} from '../dto/NotificationDto';
import { Result } from '../../../results/Result';
import { AuthGuard, PermissionGuard } from '../../../guards';
import { CARX_MODULES } from '../../../constants';

@Controller('/v1/notifications')
@ApiTags('Notifications')
export class NotificationController extends BaseController {
  constructor(
    @Inject(INotificationService)
    private notificationService: INotificationService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Notifications' })
  async getAllNotifications(
    @Res() response: express.Response,
    @Query() getNotificationsDto: FilterNotificationDto,
  ) {
    try {
      const notifications = await this.notificationService.getNotificationList(
        getNotificationsDto,
      );
      const total = await this.notificationService.countNotificationByCondition(
        getNotificationsDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          notification_list: notifications,
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

  @Get('/app')
  @ApiOperation({ summary: 'Get All App Notifications' })
  async getAllAppNotifications(
    @Res() response: express.Response,
    @Query() getNotificationsDto: FilterAppNotificationDto,
  ) {
    try {
      const notifications =
        await this.notificationService.getAppNotificationList(
          getNotificationsDto,
        );
      const total =
        await this.notificationService.countAppNotificationByCondition(
          getNotificationsDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          notification_list: notifications,
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Notification Detail' })
  async getNotificationDetail(
    @Res() response: express.Response,
    @Param('id') notificationId: string,
  ) {
    try {
      const notification = await this.notificationService.getNotificationDetail(
        notificationId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: notification,
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

  @Get('/users/:user_id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Notification Count Of Current User' })
  async getCurrentUserCountNotification(
    @Res() response: express.Response,
    @Param('user_id') userId: string,
  ) {
    try {
      const notification =
        await this.notificationService.countNotificationByCondition({
          user_id: userId,
          is_read: false,
        });
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: notification,
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
  @UseGuards(AuthGuard, PermissionGuard)
  @SetMetadata('permission', CARX_MODULES.NOTIFICATIONS)
  @ApiOperation({ summary: 'Create App Notification' })
  async createAppNotification(
    @Res() response: express.Response,
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdNotification =
        await this.notificationService.createAppNotification(
          createNotificationDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdNotification,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Notification' })
  async updateNotification(
    @Res() response: express.Response,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Param('id') notificationId: string,
  ) {
    try {
      const updatedNotification =
        await this.notificationService.updateNotification(
          notificationId,
          updateNotificationDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedNotification,
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
