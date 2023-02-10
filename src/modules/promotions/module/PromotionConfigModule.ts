import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PromotionConfigModel } from '../../../models';
import { PromotionConfigController } from '../controller/PromotionConfigController';
import { IPromotionConfigRepository } from '../repository/promotion-config/PromotionConfigRepositoryInterface';
import { PromotionConfigRepositoryImplementation } from '../repository/promotion-config/PromotionConfigRepositoryImplementation';
import { PromotionConfigServiceImplementation } from '../service/promotion-config/PromotionConfigServiceImplementation';
import { IPromotionConfigService } from '../service/promotion-config/PromotionConfigServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([PromotionConfigModel])],
  providers: [
    {
      provide: IPromotionConfigRepository,
      useClass: PromotionConfigRepositoryImplementation,
    },
    {
      provide: IPromotionConfigService,
      useClass: PromotionConfigServiceImplementation,
    },
  ],
  controllers: [PromotionConfigController],
})
export class PromotionConfigModule {}
