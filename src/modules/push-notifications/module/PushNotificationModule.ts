import { Module } from '@nestjs/common';
import { PushAgentNotificationServiceImplementation } from '../service/PushAgentNotificationServiceImplementation';
import { PushCustomerNotificationServiceImplementation } from '../service/PushCustomerNotificationService';
import { IPushNotificationService } from '../service/PushNotificationInterface';
import { PushNotificationServiceImplementation } from '../service/PushNotificationServiceImplementation';

@Module({
  providers: [
    {
      provide: IPushNotificationService,
      useClass: PushNotificationServiceImplementation,
    },
    PushCustomerNotificationServiceImplementation,
    PushAgentNotificationServiceImplementation,
  ],
  exports: [IPushNotificationService]
})
export class PushNotificationModule {}
