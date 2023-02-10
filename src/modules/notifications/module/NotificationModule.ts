import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { NotificationModel } from '../../../models';
import { PushNotificationModule } from '../../push-notifications/module/PushNotificationModule';
import { NotificationController } from '../controller/NotificationController';
import { NotificationRepositoryImplementation } from '../repository/NotificationRepositoryImplementation';
import { INotificationRepository } from '../repository/NotificationRepositoryInterface';
import { NotificationServiceImplementation } from '../service/NotificationServiceImplementation';
import { INotificationService } from '../service/NotificationServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel]), AppGatewayModule, PushNotificationModule],
  providers: [
    {
      provide: INotificationRepository,
      useClass: NotificationRepositoryImplementation,
    },
    {
      provide: INotificationService,
      useClass: NotificationServiceImplementation,
    },
  ],
  exports: [INotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
