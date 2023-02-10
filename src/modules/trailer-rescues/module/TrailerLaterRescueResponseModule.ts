import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { TrailerLaterRescueResponseModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { PushNotificationModule } from '../../push-notifications/module/PushNotificationModule';
import { ServiceCategoryModule } from '../../services/module/ServiceCategoryModule';
import { ServiceModule } from '../../services/module/ServiceModule';
import { TrailerLaterRescueResponseController } from '../controller/TrailerLaterRescueResponseController';
import { TrailerLaterRescueResponseRepositoryImplementation } from '../repository/trailer-later-rescue-responses/TrailerLaterRescueResponseRepositoryImplementation';
import { ITrailerLaterRescueResponseRepository } from '../repository/trailer-later-rescue-responses/TrailerLaterRescueResponseRepositoryInterface';
import { TrailerLaterRescueResponseServiceImplementation } from '../service/trailer-later-rescue-responses/TrailerLaterRescueResponseServiceImplementation';
import { ITrailerLaterRescueResponseService } from '../service/trailer-later-rescue-responses/TrailerLaterRescueResponseServiceInterface';
import { TrailerRescueRequestModule } from './TrailerRescueRequestModule';

@Module({
  imports: [
    SequelizeModule.forFeature([TrailerLaterRescueResponseModel]),
    AgentModule,
    forwardRef(() => TrailerRescueRequestModule),
    ServiceModule,
    AppGatewayModule,
    NotificationModule,
    PushNotificationModule,
    ServiceCategoryModule
  ],
  providers: [
    {
      provide: ITrailerLaterRescueResponseRepository,
      useClass: TrailerLaterRescueResponseRepositoryImplementation,
    },
    {
      provide: ITrailerLaterRescueResponseService,
      useClass: TrailerLaterRescueResponseServiceImplementation,
    },
  ],
  exports: [ITrailerLaterRescueResponseService],
  controllers: [TrailerLaterRescueResponseController],
})
export class TrailerLaterRescueResponseModule {}
