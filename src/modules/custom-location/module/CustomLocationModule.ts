import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomLocationModel } from '../../../models';
import { CustomLocationController } from '../controller/CustomLocationController';
import { CustomLocationRepositoryImplementation } from '../repository/CustomLocationRepositoryImplementation';
import { ICustomLocationRepository } from '../repository/CustomLocationRepositoryInterface';
import { CustomLocationServiceImplementation } from '../service/CustomLocationServiceImplementation';
import { ICustomLocationService } from '../service/CustomLocationServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([CustomLocationModel])],
  providers: [
    {
      provide: ICustomLocationRepository,
      useClass: CustomLocationRepositoryImplementation,
    },
    {
      provide: ICustomLocationService,
      useClass: CustomLocationServiceImplementation,
    },
  ],
  exports: [ICustomLocationService],
  controllers: [CustomLocationController],
})
export class CustomLocationModule { }
