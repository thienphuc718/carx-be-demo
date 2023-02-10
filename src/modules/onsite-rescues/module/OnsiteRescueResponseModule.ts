import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { OnsiteRescueResponseModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { ServiceModule } from '../../services/module/ServiceModule';
import { OnsiteRescueResponseController } from '../controller/OnsiteRescueResponseController';
import { OnsiteRescueResponseRepositoryImplementation } from '../repository/onsite-rescue-responses/OnsiteRescueResponseRepositoryImplementation';
import { IOnsiteRescueResponseRepository } from '../repository/onsite-rescue-responses/OnsiteRescueResponseRepositoryInterface';
import { OnsiteRescueResponseServiceImplementation } from '../service/onsite-rescue-responses/OnsiteRescueResponseServiceImplementation';
import { IOnsiteRescueResponseService } from '../service/onsite-rescue-responses/OnsiteRescueResponseServiceInterface';
import { OnsiteRescueRequestModule } from './OnsiteRescueRequestModule';

@Module({
  imports: [
    SequelizeModule.forFeature([OnsiteRescueResponseModel]),
    AgentModule,
    forwardRef(() => OnsiteRescueRequestModule),
    ServiceModule,
    AppGatewayModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: IOnsiteRescueResponseRepository,
      useClass: OnsiteRescueResponseRepositoryImplementation,
    },
    {
      provide: IOnsiteRescueResponseService,
      useClass: OnsiteRescueResponseServiceImplementation,
    },
  ],
  exports: [IOnsiteRescueResponseService],
  controllers: [OnsiteRescueResponseController],
})
export class OnsiteRescueResponseModule {}
