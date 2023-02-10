import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderModel } from '../../../models';
import { OrderController } from '../controller/OrderController';
import { OrderRepositoryImplementation } from '../repository/order/OrderRepositoryImplement';
import { IOrderRepository } from '../repository/order/OrderRepositoryInterface';
import { OrderServiceImplementation } from '../service/order/OrderServiceImplement';
import { IOrderService } from '../service/order/OrderServiceInterface';
import { OrderItemModule } from './OrderItemModule';
import { CustomerModule } from '../../customers/module';
import {InsuranceProductModule, ProductVariantModule} from '../../products/module';

import { TransportationMethodController } from '../controller/TransportationMethodController';
import { PaymentMethodController } from '../controller/PaymentMethodController';
import { FlashBuyRequestModule } from '../../flash-buy-requests/module/FlashBuyRequestModule';
import { SystemConfigurationModule } from '../../system-configurations/module/SystemConfigurationModule';
import { PromotionModule } from '../../promotions/module/PromotionModule';
import { AgentModule } from '../../agents/module/AgentModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { PushNotificationModule } from '../../push-notifications/module/PushNotificationModule';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import {CurlModule} from "../../curl/module/CurlModule";
import {InsuranceContractModule} from "../../insurance-contracts/module/InsuranceContractModule";

@Module({
  imports: [
    SequelizeModule.forFeature([OrderModel]),
    OrderItemModule,
    CustomerModule,
    ProductVariantModule,
    FlashBuyRequestModule,
    SystemConfigurationModule,
    PromotionModule,
    forwardRef(() => AgentModule),
    NotificationModule,
    PushNotificationModule,
    AppGatewayModule,
    CurlModule,
    forwardRef(() => InsuranceProductModule),
    InsuranceContractModule,
  ],
  providers: [
    {
      provide: IOrderRepository,
      useClass: OrderRepositoryImplementation,
    },
    {
      provide: IOrderService,
      useClass: OrderServiceImplementation,
    },
  ],
  controllers: [
    OrderController,
    TransportationMethodController,
    PaymentMethodController,
  ],
  exports: [IOrderService, IOrderRepository],
})
export class OrderModule {}
