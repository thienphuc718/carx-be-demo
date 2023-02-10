import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlashBuyRequestModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { ProductModule } from '../../products/module';
import { FlashBuyRequestController } from '../controller/FlashBuyRequestController';
import { FlashBuyRequestRepositoryImplementation } from '../repository/flash-buy-request/FlashBuyRequestRepositoryImplementation';
import { IFlashBuyRequestRepository } from '../repository/flash-buy-request/FlashBuyRequestRepositoryInterface';
import { FlashBuyRequestServiceImplementation } from '../service/flash-buy-request/FlashBuyRequestServiceImplementation';
import { IFlashBuyRequestService } from '../service/flash-buy-request/FlashBuyRequestServiceInterface';
import { FlashBuyResponseModule } from './FlashBuyResponseModule';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { PushNotificationModule } from '../../push-notifications/module/PushNotificationModule';
import { CustomerModule } from '../../customers/module';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';

@Module({
  imports: [
    SequelizeModule.forFeature([FlashBuyRequestModel]),
    forwardRef(() => FlashBuyResponseModule),
    AppGatewayModule,
    NotificationModule,
    forwardRef(() => AgentModule),
    PushNotificationModule,
    CustomerModule,
    ForbiddenKeywordModule,
  ],
  providers: [
    {
      provide: IFlashBuyRequestRepository,
      useClass: FlashBuyRequestRepositoryImplementation,
    },
    {
      provide: IFlashBuyRequestService,
      useClass: FlashBuyRequestServiceImplementation,
    },
  ],
  exports: [IFlashBuyRequestService],
  controllers: [FlashBuyRequestController],
})
export class FlashBuyRequestModule {}
