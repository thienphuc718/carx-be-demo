import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityModel } from '../../../models';
import { ActivityController } from '../controller/ActivityController';
import { ActivityRepositoryImplementation } from '../repository/ActivityRepositoryImplementation';
import { IActivityRepository } from '../repository/ActivityRepositoryInterface';
import { ActivityServiceImplementation } from '../service/ActivityServiceImplementation';
import { IActivityService } from '../service/ActivityServiceInteface';

@Module({
  imports: [SequelizeModule.forFeature([ActivityModel])],
  providers: [
    {
      provide: IActivityRepository,
      useClass: ActivityRepositoryImplementation,
    },
    {
      provide: IActivityService,
      useClass: ActivityServiceImplementation,
    },
  ],
  controllers: [ActivityController],
  exports: [IActivityService],
})
export class ActivityModule {}
