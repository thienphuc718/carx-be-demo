import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PopUpModel } from '../../../models';
import { PopUpController } from '../controller/PopUpController';
import { PopUpRepositoryImplementation } from '../repository/PopUpRepositoryImplementation';
import { IPopUpRepository } from '../repository/PopUpRepositoryInterface';
import { PopUpServiceImplementation } from '../service/PopUpServiceImplementation';
import { IPopUpService } from '../service/PopUpServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([PopUpModel])],
  providers: [
    {
      provide: IPopUpRepository,
      useClass: PopUpRepositoryImplementation,
    },
    {
      provide: IPopUpService,
      useClass: PopUpServiceImplementation,
    },
  ],
  exports: [IPopUpService],
  controllers: [PopUpController],
})
export class PopUpModule {}
