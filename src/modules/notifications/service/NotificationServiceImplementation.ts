import {Inject} from '@nestjs/common';
import {NotificationModel} from '../../../models';
import {
  CreateNotificationDto,
  FilterAppNotificationDto,
  FilterNotificationDto,
  UpdateNotificationDto,
} from '../dto/NotificationDto';
import {INotificationRepository} from '../repository/NotificationRepositoryInterface';
import {INotificationService} from './NotificationServiceInterface';
import {AppGateway} from '../../../gateway/AppGateway';
import {NotificationSegmentEnum, NotificationSendingTypeEnum, NotificationTypeEnum} from '../enum/NotificationEnum';
import {IPushNotificationService} from '../../push-notifications/service/PushNotificationInterface';
import {CreateNotificationBody} from "onesignal-node/lib/types";
import {CreateIndividualNotification} from "../types/NotificationTypes";

export class NotificationServiceImplementation implements INotificationService {
  constructor(
    @Inject(INotificationRepository)
    private notificationRepository: INotificationRepository,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(IPushNotificationService)
    private pushNotificationService: IPushNotificationService,
  ) {}
  async getNotificationList(
    payload: FilterNotificationDto,
  ): Promise<NotificationModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const queryCondition = this.buildSearchQueryCondition(rest);
      return await this.notificationRepository.findAllWithCondition(
        limit,
        (page - 1) * limit,
        queryCondition,
      );
    } catch (error) {
      throw error;
    }
  }

  async getAppNotificationList(
    payload: FilterAppNotificationDto,
  ): Promise<NotificationModel[]> {
    try {
      const { limit, page, target_group } = payload;
      return await this.notificationRepository.findAllWithCondition(
        limit,
        (page - 1) * limit,
        {
          type: NotificationTypeEnum.CARX,
          user_id: null,
          target_group: target_group
            ? [NotificationSegmentEnum.ALL, target_group]
            : NotificationSegmentEnum.ALL,
          is_deleted: false,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  countAppNotificationByCondition(condition: any): Promise<number> {
    try {
      const { limit, page, ...rest } = condition;
      return this.notificationRepository.count({
        type: NotificationTypeEnum.CARX,
        user_id: null,
        target_group: condition.target_group
          ? [NotificationSegmentEnum.ALL, condition.target_group]
          : NotificationSegmentEnum.ALL,
        is_deleted: false,
      });
    } catch (error) {
      throw error;
    }
  }

  getNotificationDetail(id: string): Promise<NotificationModel> {
    return this.notificationRepository.findById(id);
  }

  async createNotification(
    payload: CreateNotificationDto,
  ): Promise<NotificationModel> {
    try {
      const params: Record<string, any> = {
        ...payload,
      };
      const createdNotification = await this.notificationRepository.create(
        params,
      );

      // EMIT SOCKET EVENT
      let eventName = '';
      switch (payload.type) {
        case NotificationTypeEnum.CARX:
          eventName = `ROOM_CARX`;
          break;
        case NotificationTypeEnum.CUSTOMER_CREATE_FLASH_BUY_REQUEST:
          eventName = `ROOM_FLASH_BUY_REQUEST`;
          break;
        case NotificationTypeEnum.CUSTOMER_CREATE_RESCUE_REQUEST:
          eventName = `ROOM_RESCUE_REQUEST`;
          break;
        default:
          eventName = `ROOM_${payload.user_id}`;
      }
      this.appGateway.server.emit(eventName, {
        action: payload.type,
        data: {
          notification_id: createdNotification.id,
        },
        channel: 'CARX_NOTIFICATION',
      });
      return createdNotification;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createAppNotification(
    payload: CreateNotificationDto,
  ): Promise<NotificationModel> {
    try {
      const { set_day, set_time, ...rest } = payload;
      if (
        (!payload.set_day && payload.set_time) ||
        (payload.set_day && !payload.set_time)
      ) {
        throw new Error(
          'Set day and set time must be both specified or ignored',
        );
      }
      let sendingType = set_day && set_time
            ? NotificationSendingTypeEnum.EVENTUALLY
            : NotificationSendingTypeEnum.INSTANTLY;
      const params: Record<string, any> = {
        ...rest,
        sending_type: sendingType,
        set_day: set_day,
        set_time: set_time,
        type: NotificationTypeEnum.CARX,
      };
      params.push_message = payload.message;
      const createdNotification = await this.notificationRepository.create(params);
      if (!createdNotification) {
        throw new Error('Cannot create notification');
      }
      // PUSH NOTIFICATION PARAMS
      const pushNotificationParams: CreateNotificationBody = {
        included_segments: ['Subscribed Users'],
        ios_badgeType: 'Increase',
        ios_badgeCount: 1,
        contents: {
          en: payload.message,
          vi: payload.message,
        },
        headings: {
          en: payload.push_title || `CarX Announcement`,
          vi: payload.push_title || `Thông báo từ CarX`,
        },
        data: {
          notification_id: createdNotification.id,
          type: NotificationTypeEnum.CARX,
        },
      }
      if (payload.image) {
        pushNotificationParams.ios_attachments = { image : payload.image };
        pushNotificationParams.big_picture = payload.image
      }
      if (payload.data) {
        pushNotificationParams.data = {
          ...pushNotificationParams.data,
          ...payload.data
        }
      }
      const targetGroup = payload.target_group;
      if (sendingType === NotificationSendingTypeEnum.EVENTUALLY) {
        pushNotificationParams.send_after = `${set_day} ${set_time}:00 GMT+07:00`;
      }
      const onesignalResponse = await this.pushNotificationService.pushNotification(pushNotificationParams, targetGroup);
      if (onesignalResponse.body) {
        createdNotification.vendor_response = onesignalResponse.body;
        createdNotification.changed('vendor_response', true);
        await createdNotification.save();
      }
      return createdNotification;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateNotification(
    id: string,
    payload: UpdateNotificationDto,
  ): Promise<NotificationModel> {
    try {
      const params: Record<string, any> = {
        ...payload,
      }
      if (payload.message) {
        params.push_message = payload.message;
      }
      const [nModified, notifications] =
        await this.notificationRepository.update(id, payload);
      if (!nModified) {
        throw new Error(`Cannot update notification ${id}`);
      }
      const updatedNotification = notifications[0];
      return updatedNotification;
    } catch (error) {
      throw error;
    }
  }

  countNotificationByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.notificationRepository.count(queryCondition);
  }

  async createUserInAppAndPushNotification(payload: CreateIndividualNotification): Promise<void> {
    try {
      const { userId, heading, type, targetGroup, data, message, image} = payload;
      const createdNotification = await this.createNotification({
        type: type,
        user_id: userId,
        data: data || {},
        message: message,
        image: image,
        target_group: targetGroup,
        content: message,
        push_title: heading,
        push_message: message,
      });
      const pushNotificationPayload: CreateNotificationBody = {
        include_external_user_ids: [userId],
        channel_for_external_user_ids: 'push',
        ios_badgeType: 'Increase',
        ios_badgeCount: 1,
        contents: {
          en: message,
          vi: message,
        },
        headings: {
          en: heading,
          vi: heading,
        },
        data: {
          ...data,
          type,
        }
      }
      if (image) {
        pushNotificationPayload.ios_attachments = { image: image };
        pushNotificationPayload.big_picture = image;
      }
      const onesignalResponse =
        await this.pushNotificationService.pushNotification(pushNotificationPayload, targetGroup);
      if (onesignalResponse) {
        createdNotification.vendor_response = onesignalResponse.body;
        createdNotification.changed('vendor_response', true);
        await createdNotification.save();
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    };
    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    return queryCondition;
  }
}
