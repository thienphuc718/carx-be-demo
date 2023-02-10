import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { OnsiteRescueRequestModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { CustomerModule } from '../../customers/module';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { PushNotificationModule } from '../../push-notifications/module/PushNotificationModule';
import { OnsiteRescueRequestController } from '../controller/OnsiteRescueRequestController';
import { OnsiteRescueRequestRepositoryImplementation } from '../repository/onsite-rescue-requests/OnsiteRescueRequestRepositoryImplementation';
import { IOnsiteRescueRequestRepository } from '../repository/onsite-rescue-requests/OnsiteRescueRequestRepositoryInterface';
import { OnsiteRescueRequestServiceImplementation } from '../service/onsite-rescue-requests/OnsiteRescueRequestServiceImplementation';
import { IOnsiteRescueRequestService } from '../service/onsite-rescue-requests/OnsiteRescueRequestServiceInterface';
import { OnsiteRescueResponseModule } from './OnsiteRescueResponseModule';
import { BookingModule } from "../../bookings/module/BookingModule";
import { ServiceModule } from "../../services/module/ServiceModule";

@Module({
  imports: [
    SequelizeModule.forFeature([OnsiteRescueRequestModel]),
    forwardRef(() => OnsiteRescueResponseModule),
    AppGatewayModule,
    CustomerModule,
    PushNotificationModule,
    NotificationModule,
    ForbiddenKeywordModule,
    AgentModule,
    forwardRef(() => BookingModule),
    ServiceModule,
  ],
  providers: [
    {
      provide: IOnsiteRescueRequestRepository,
      useClass: OnsiteRescueRequestRepositoryImplementation,
    },
    {
      provide: IOnsiteRescueRequestService,
      useClass: OnsiteRescueRequestServiceImplementation,
    },
  ],
  exports: [IOnsiteRescueRequestService],
  controllers: [OnsiteRescueRequestController],
})
export class OnsiteRescueRequestModule {}
