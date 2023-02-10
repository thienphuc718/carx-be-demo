import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookingModel } from '../../../models';
import { BookingController } from '../controller/BookingController';
import { BookingRepositoryImplementation } from '../repository/BookingRepositoryImplement';
import { IBookingRepository } from '../repository/BookingRepositoryInterface';
import { BookingServiceImplementation } from '../service/BookingServiceImplement';
import { IBookingService } from '../service/BookingServiceInterface';
import { CustomerModule } from '../../customers/module';
import { OrderModule } from '../../orders/module/OrderModule';
import { OnsiteRescueRequestModule } from '../../onsite-rescues/module/OnsiteRescueRequestModule';
import { OrderItemModule } from '../../orders/module/OrderItemModule';
import { AgentModule } from '../../agents/module/AgentModule';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';
import { TrailerRescueRequestModule } from '../../trailer-rescues/module/TrailerRescueRequestModule';

@Module({
  imports: [
    SequelizeModule.forFeature([BookingModel]),
    CustomerModule,
    AgentModule,
    OrderModule,
    OrderItemModule,
    AppGatewayModule,
    forwardRef(() => OnsiteRescueRequestModule),
    NotificationModule,
    forwardRef(() => ForbiddenKeywordModule),
    forwardRef(() => TrailerRescueRequestModule),
  ],
  providers: [
    {
      provide: IBookingRepository,
      useClass: BookingRepositoryImplementation,
    },
    {
      provide: IBookingService,
      useClass: BookingServiceImplementation,
    },
  ],
  exports: [IBookingService],
  controllers: [BookingController],
})
export class BookingModule {}
