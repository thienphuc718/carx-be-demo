import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { TrailerRescueRequestModel } from '../../../models';
import { AgentCategoryModule } from '../../agent-categories/module/AgentCategoryModule';
import { AgentModule } from '../../agents/module/AgentModule';
import { CustomerModule } from '../../customers/module';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { TrailerRescueRequestController } from '../controller/TrailerRescueRequestController';
import { TrailerRescueRequestRepositoryImplementation } from '../repository/trailer-rescue-requests/TrailerRescueRequestRepositoryImplementation';
import { ITrailerRescueRequestRepository } from '../repository/trailer-rescue-requests/TrailerRescueRequestRepositoryInterface';
import { TrailerRescueRequestServiceImplementation } from '../service/trailer-rescue-requests/TrailerRescueRequestServiceImplementation';
import { ITrailerRescueRequestService } from '../service/trailer-rescue-requests/TrailerRescueRequestServiceInterface';
import { TrailerFormerRescueResponseModule } from './TrailerFormerRescueResponseModule';
import { TrailerLaterRescueResponseModule } from './TrailerLaterRescueResponseModule';
import {BookingModule} from "../../bookings/module/BookingModule";

@Module({
  imports: [
    SequelizeModule.forFeature([TrailerRescueRequestModel]),
    forwardRef(() => TrailerFormerRescueResponseModule),
    forwardRef(() => TrailerLaterRescueResponseModule),
    AppGatewayModule,
    CustomerModule,
    NotificationModule,
    AgentModule,
    AgentCategoryModule,
    forwardRef(() => BookingModule),
  ],
  providers: [
    {
      provide: ITrailerRescueRequestRepository,
      useClass: TrailerRescueRequestRepositoryImplementation,
    },
    {
      provide: ITrailerRescueRequestService,
      useClass: TrailerRescueRequestServiceImplementation,
    },
  ],
  exports: [ITrailerRescueRequestService],
  controllers: [TrailerRescueRequestController],
})
export class TrailerRescueRequestModule {}
