import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlashBuyResponseModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { ProductModule } from '../../products/module';
import { FlashBuyResponseController } from '../controller/FlashBuyResponseController';
import { FlashBuyResponseRepositoryImplementation } from '../repository/flash-buy-response/FlashBuyResponseRepositoryImplementation';
import { IFlashBuyResponseRepository } from '../repository/flash-buy-response/FlashBuyResponseRepositoryInterface';
import { FlashBuyResponseServiceImplementation } from '../service/flash-buy-response/FlashBuyResponseServiceImplementation';
import { IFlashBuyResponseService } from '../service/flash-buy-response/FlashBuyResponseServiceInterface';
import { FlashBuyRequestModule } from './FlashBuyRequestModule';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { PushNotificationModule } from '../../push-notifications/module/PushNotificationModule';

@Module({
  imports: [
    SequelizeModule.forFeature([FlashBuyResponseModel]),
    ProductModule,
    forwardRef(() => AgentModule),
    forwardRef(() => FlashBuyRequestModule),
    AppGatewayModule,
    NotificationModule,
    PushNotificationModule,
  ],
  providers: [
    {
      provide: IFlashBuyResponseRepository,
      useClass: FlashBuyResponseRepositoryImplementation,
    },
    {
      provide: IFlashBuyResponseService,
      useClass: FlashBuyResponseServiceImplementation,
    },
  ],
  exports: [IFlashBuyResponseService],
  controllers: [FlashBuyResponseController],
})
export class FlashBuyResponseModule {}
