import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItemModel } from '../../../models';
import { ProductModule } from '../../products/module';
import { OrderItemController } from '../controller/OrderItemController';
import { OrderItemRepositoryImplementation } from '../repository/order-item/OrderItemRepositoryImplement';
import { IOrderItemRepository } from '../repository/order-item/OrderItemRepositoryInterface';
import { OrderItemServiceImplementation } from '../service/order-item/OrderItemServiceImplement';
import { IOrderItemService } from '../service/order-item/OrderItemServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderItemModel]),
    forwardRef(() => ProductModule),
  ],
  providers: [
    {
      provide: IOrderItemRepository,
      useClass: OrderItemRepositoryImplementation,
    },
    {
      provide: IOrderItemService,
      useClass: OrderItemServiceImplementation,
    },
  ],
  controllers: [OrderItemController],
  exports: [IOrderItemService],
})
export class OrderItemModule {}
