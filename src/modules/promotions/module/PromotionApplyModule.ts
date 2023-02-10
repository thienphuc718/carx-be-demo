import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PromotionApplyModel, PromotionModel } from '../../../models';
import { PromotionApplyController } from '../controller/PromotionApplyController';
import { IPromotionApplyRepository } from '../repository/promotion-apply/PromotionApplyRepositoryInterface';
import { PromotionApplyRepositoryImplementation } from '../repository/promotion-apply/PromotionApplyRepositoryImplementation';
import { PromotionApplyServiceImplementation } from '../service/promotion-apply/PromotionApplyServiceImplementation';
import { IPromotionApplyService } from '../service/promotion-apply/PromotionApplyServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([PromotionApplyModel, PromotionModel])],
  providers: [
    {
      provide: IPromotionApplyRepository,
      useClass: PromotionApplyRepositoryImplementation,
    },
    {
      provide: IPromotionApplyService,
      useClass: PromotionApplyServiceImplementation,
    },
  ],
  controllers: [PromotionApplyController],
})
export class PromotionApplyModule {}
