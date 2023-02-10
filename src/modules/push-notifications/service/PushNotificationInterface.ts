import { CreateNotificationBody } from 'onesignal-node/lib/types';
import { NotificationSegmentEnum } from '../../notifications/enum/NotificationEnum';

export interface IPushNotificationService {
  pushNotification(
    payload: CreateNotificationBody,
    segment: NotificationSegmentEnum,
  ): Promise<any>;
}

export const IPushNotificationService = Symbol('IPushNotificationService');
