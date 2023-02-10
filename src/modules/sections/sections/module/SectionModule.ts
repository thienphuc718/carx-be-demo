import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionModel } from '../../../../models';
import { ProductModule } from '../../../products/module';
import { ServiceModule } from '../../../services/module/ServiceModule';
import { SectionAgentRelationModule } from '../../section-agent-relation/module/SectionAgentRelationModule';
import { SectionDealRelationModule } from '../../section-deal-relation/module/SectionDealRelationModule';
import { SectionPostRelationModule } from '../../section-post-relation/module/SectionPostRelationModule';
import { SectionProductRelationModule } from '../../section-product-relation/module/SectionProductRelationModule';
import { SectionPromotionRelationModule } from '../../section-promotion-relation/module/SectionPromotionRelationModule';
import { SectionController } from '../controller/SectionController';
import { SectionRepositoryImplementation } from '../repository/SectionRepositoryImplementation';
import { ISectionRepository } from '../repository/SectionRepositoryInterface';
import { SectionServiceImplementation } from '../service/SectionServiceImplementation';
import { ISectionService } from '../service/SectionServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([SectionModel]),
    forwardRef(() => SectionAgentRelationModule),
    forwardRef(() => SectionProductRelationModule),
    forwardRef(() => SectionPromotionRelationModule),
    forwardRef(() => SectionPostRelationModule),
    forwardRef(() => SectionDealRelationModule),
    forwardRef(() => ProductModule),
    ServiceModule,
  ],
  providers: [
    {
      provide: ISectionRepository,
      useClass: SectionRepositoryImplementation,
    },
    {
      provide: ISectionService,
      useClass: SectionServiceImplementation,
    },
  ],
  exports: [ISectionService],
  controllers: [SectionController],
})
export class SectionModule {}
