import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { CityServiceImplementation } from './../service/cities/CityServiceImplement';
import { CityRepositoryImplementation } from './../repository/cities/CityRepositoryImplement';
import { ICityRepository } from './../repository/cities/CityRepositoryInterface';
import { CityModel } from '../../../models/Cities';
import { ICityService } from '../service/cities/CityServiceInterface';
import { CityController } from '../controller/CityController';

@Module({
  imports: [SequelizeModule.forFeature([CityModel])],
  providers: [
    {
      provide: ICityRepository,
      useClass: CityRepositoryImplementation,
    },
    {
      provide: ICityService,
      useClass: CityServiceImplementation,
    },
  ],
  controllers: [CityController],
  exports: [ICityService],
})
export class CityModule {}
