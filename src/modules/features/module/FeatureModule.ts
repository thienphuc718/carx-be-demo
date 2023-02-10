import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FeatureModel } from '../../../models/Features';
import { FeatureController } from '../controller/FeatureController';
import { FeatureRepositoryImplementation } from '../repository/FeatureRepositoryImplementation';
import { IFeatureRepository } from '../repository/FeatureRepositoryInterface';
import { FeatureServiceImplementation } from '../service/FeatureServiceImplementation';
import { IFeatureService } from '../service/FeatureServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([FeatureModel])],
  providers: [
    {
      provide: IFeatureRepository,
      useClass: FeatureRepositoryImplementation,
    },
    {
      provide: IFeatureService,
      useClass: FeatureServiceImplementation,
    },
  ],
  controllers: [FeatureController],
  exports: [],
})
export class FeatureModule {}
