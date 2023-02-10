import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SliderModel } from '../../../models';
import { SliderController } from '../controller/SliderController';
import { SliderRepositoryImplementation } from '../repository/SliderRepositoryImplementation';
import { ISliderRepository } from '../repository/SliderRepositoryInterface';
import { SliderServiceImplementation } from '../service/SliderServiceImplementation';
import { ISliderService } from '../service/SliderServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([SliderModel])],
  providers: [
    {
      provide: ISliderRepository,
      useClass: SliderRepositoryImplementation,
    },
    {
      provide: ISliderService,
      useClass: SliderServiceImplementation,
    },
  ],
  exports: [ISliderService],
  controllers: [SliderController],
})
export class SliderModule {}
