import { Inject } from '@nestjs/common';
import { CreateNotificationBody } from 'onesignal-node/lib/types';
import { NotificationSegmentEnum } from '../../notifications/enum/NotificationEnum';
import { PushAgentNotificationServiceImplementation } from './PushAgentNotificationServiceImplementation';
import { PushCustomerNotificationServiceImplementation } from './PushCustomerNotificationService';
import { IPushNotificationService } from './PushNotificationInterface';

export class PushNotificationServiceImplementation
  implements IPushNotificationService
{
  constructor(
    @Inject(PushAgentNotificationServiceImplementation)
    private pushAgentNotificationService: PushAgentNotificationServiceImplementation,
    @Inject(PushCustomerNotificationServiceImplementation)
    private pushCustomerNotificationService: PushCustomerNotificationServiceImplementation,
  ) {}

  async pushNotification(
    payload: CreateNotificationBody,
    segment: NotificationSegmentEnum,
  ): Promise<any> {
    try {
      let result = null;
      if (segment === NotificationSegmentEnum.AGENT) {
        result = await this.pushAgentNotificationService.createPushNotification(payload);
      } else if (segment === NotificationSegmentEnum.CUSTOMER){
        result = await this.pushCustomerNotificationService.createPushNotification(payload);
      } else {
        await Promise.all([
          this.pushAgentNotificationService.createPushNotification(payload),
          this.pushCustomerNotificationService.createPushNotification(payload),
        ]);
      }
      console.log('ONESIGNAL RESPONSE: ', result);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
