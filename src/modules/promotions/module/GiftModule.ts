import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GiftModel, PromotionModel } from '../../../models';
import { GiftController } from '../controller/GiftController';
import { IGiftRepository } from '../repository/gift/GiftRepositoryInterface';
import { GiftRepositoryImplementation } from '../repository/gift/GiftRepositoryImplementation';
import { GiftServiceImplementation } from '../service/gift/GiftServiceImplementation';
import { IGiftService } from '../service/gift/GiftServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([GiftModel, PromotionModel])],
  providers: [
    {
      provide: IGiftRepository,
      useClass: GiftRepositoryImplementation,
    },
    {
      provide: IGiftService,
      useClass: GiftServiceImplementation,
    },
  ],
  controllers: [GiftController],
})
export class GiftModule {}
