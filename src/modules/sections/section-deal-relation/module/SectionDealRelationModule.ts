import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DealModel, SectionDealRelationModel } from '../../../../models';
import { DealModule } from '../../../deals/module/DealModule';
import { SectionModule } from '../../sections/module/SectionModule';
import { SectionDealRelationController } from '../controller/SectionDealRelationController';
import { SectionDealRelationRepositoryImplementation } from '../repository/SectionDealRelationRepositoryImplementation';
import { ISectionDealRelationRepository } from '../repository/SectionDealRelationRepositoryInterface';
import { SectionDealRelationServiceImplementation } from '../service/SectionDealRelationServiceImplementation';
import { ISectionDealRelationService } from '../service/SectionDealRelationServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([SectionDealRelationModel, DealModel]),
    forwardRef(() => SectionModule),
    forwardRef(() => DealModule),
  ],
  providers: [
    {
      provide: ISectionDealRelationRepository,
      useClass: SectionDealRelationRepositoryImplementation,
    },
    {
      provide: ISectionDealRelationService,
      useClass: SectionDealRelationServiceImplementation,
    },
  ],
  controllers: [SectionDealRelationController],
  exports: [ISectionDealRelationService],
})
export class SectionDealRelationModule {}
