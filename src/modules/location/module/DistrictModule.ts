import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { DistrictServiceImplementation } from '../service/districts/DistrictServiceImplement';
import { DistrictRepositoryImplementation } from '../repository/districts/DistrictRepositoryImplement';
import { IDistrictRepository } from '../repository/districts/DistrictRepositoryInterface';
import { DistrictModel } from '../../../models/Districts';
import { IDistrictService } from '../service/districts/DistrictServiceInterface';
import { DistrictController } from '../controller/DistrictController';

@Module({
  imports: [SequelizeModule.forFeature([DistrictModel])],
  providers: [
    {
      provide: IDistrictRepository,
      useClass: DistrictRepositoryImplementation,
    },
    {
      provide: IDistrictService,
      useClass: DistrictServiceImplementation,
    },
  ],
  controllers: [DistrictController],
  exports: [IDistrictService],
})
export class DistrictModule {}
