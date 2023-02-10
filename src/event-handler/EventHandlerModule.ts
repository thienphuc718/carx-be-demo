import { EventHandler } from './EventHandler';
import { Module, Global } from '@nestjs/common';
import { ProductModule } from '../modules/products/module/ProductModule';
import { ServiceModule,  } from '../modules/services/module/ServiceModule';
import { AgentModule } from "../modules/agents/module/AgentModule";
import { NotificationModule } from "../modules/notifications/module/NotificationModule";
import { PushNotificationModule } from "../modules/push-notifications/module/PushNotificationModule";

@Module({
  imports: [
    ProductModule,
    ServiceModule,
    AgentModule,
    NotificationModule,
    PushNotificationModule,
  ],
  controllers: [],
  providers: [EventHandler],
  exports: [EventHandler],
})
export class EventHandlerModule {}
