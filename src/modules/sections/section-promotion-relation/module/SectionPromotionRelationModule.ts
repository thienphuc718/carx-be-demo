import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionPromotionRelationModel } from '../../../../models';
import { PromotionModule } from '../../../promotions/module/PromotionModule';
import { SectionModule } from '../../sections/module/SectionModule';
import { SectionPromotionRelationController } from '../controller/SectionPromotionRelationController';
import { SectionPromotionRelationRepositoryImplementation } from '../repository/SectionPromotionRelationRepositoryImplementation';
import { ISectionPromotionRelationRepository } from '../repository/SectionPromotionRelationRepositoryInterface';
import { SectionPromotionRelationServiceImplementation } from '../service/SectionPromotionRelationServiceImplementation';
import { ISectionPromotionRelationService } from '../service/SectionPromotionRelationServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([SectionPromotionRelationModel]),
    forwardRef(() => SectionModule),
    PromotionModule,
  ],
  providers: [
    {
      provide: ISectionPromotionRelationService,
      useClass: SectionPromotionRelationServiceImplementation,
    },
    {
      provide: ISectionPromotionRelationRepository,
      useClass: SectionPromotionRelationRepositoryImplementation,
    },
  ],
  controllers: [SectionPromotionRelationController],
  exports: [ISectionPromotionRelationService],
})
export class SectionPromotionRelationModule {}
