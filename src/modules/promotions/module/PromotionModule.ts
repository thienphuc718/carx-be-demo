import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GiftModel, PromotionModel } from '../../../models';
import { PromotionController } from '../controller/PromotionController';
import { IPromotionRepository } from '../repository/promotion/PromotionRepositoryInterface';
import { PromotionRepositoryImplementation } from '../repository/promotion/PromotionRepositoryImplementation';
import { PromotionServiceImplementation } from '../service/promotion/PromotionServiceImplementation';
import { IPromotionService } from '../service/promotion/PromotionServiceInterface';
import { UserModule } from '../../users/module/UserModule';
import { AgentModule } from '../../agents/module/AgentModule';
import {
  SectionPromotionRelationModule
} from "../../sections/section-promotion-relation/module/SectionPromotionRelationModule";

@Module({
  imports: [SequelizeModule.forFeature([PromotionModel, GiftModel]), forwardRef(() => AgentModule), forwardRef(() => SectionPromotionRelationModule)],
  providers: [
    {
      provide: IPromotionRepository,
      useClass: PromotionRepositoryImplementation,
    },
    {
      provide: IPromotionService,
      useClass: PromotionServiceImplementation,
    },
  ],
  exports: [IPromotionService],
  controllers: [PromotionController],
})
export class PromotionModule {}
