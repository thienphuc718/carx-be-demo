import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { TrailerFormerRescueResponseModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { ServiceModule } from '../../services/module/ServiceModule';
import { TrailerFormerRescueResponseController } from '../controller/TrailerFormerRescueResponseController';
import { TrailerFormerRescueResponseRepositoryImplementation } from '../repository/trailer-former-rescue-responses/TrailerFormerRescueResponseRepositoryImplementation';
import { ITrailerFormerRescueResponseRepository } from '../repository/trailer-former-rescue-responses/TrailerFormerRescueResponseRepositoryInterface';
import { TrailerFormerRescueResponseServiceImplementation } from '../service/trailer-former-rescue-responses/TrailerFormerRescueResponseServiceImplementation';
import { ITrailerFormerRescueResponseService } from '../service/trailer-former-rescue-responses/TrailerFormerRescueResponseServiceInterface';
import { TrailerRescueRequestModule } from './TrailerRescueRequestModule';

@Module({
  imports: [
    SequelizeModule.forFeature([TrailerFormerRescueResponseModel]),
    AgentModule,
    forwardRef(() => TrailerRescueRequestModule),
    ServiceModule,
    AppGatewayModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: ITrailerFormerRescueResponseRepository,
      useClass: TrailerFormerRescueResponseRepositoryImplementation,
    },
    {
      provide: ITrailerFormerRescueResponseService,
      useClass: TrailerFormerRescueResponseServiceImplementation,
    },
  ],
  exports: [ITrailerFormerRescueResponseService],
  controllers: [TrailerFormerRescueResponseController],
})
export class TrailerFormerRescueResponseModule {}
