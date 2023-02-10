import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CarModel } from '../../../models';
import { CarController } from '../controller/CarController';
import { CarRepositoryImplementation } from '../repository/CarRepositoryImplement';
import { ICarRepository } from '../repository/CarRepositoryInterface';
import { CarServiceImplementation } from '../service/CarServiceImplement';
import { ICarService } from '../service/CarServiceInterface';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';

@Module({
  imports: [
    SequelizeModule.forFeature([CarModel]),
    forwardRef(() => ForbiddenKeywordModule)
  ],
  providers: [
    {
      provide: ICarRepository,
      useClass: CarRepositoryImplementation,
    },
    {
      provide: ICarService,
      useClass: CarServiceImplementation,
    },
  ],
  controllers: [CarController],
  exports: [ICarService]
})
export class CarModule {}
