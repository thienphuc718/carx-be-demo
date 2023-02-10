import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionProductRelationModel } from '../../../../models';
import { ProductModule } from '../../../products/module';
import { SectionModule } from '../../sections/module/SectionModule';
import { SectionProductRelationController } from '../controller/SectionProductRelationController';
import { SectionProductRepositoryImplementation } from '../repository/SectionProductRelationRepositoryImplementation';
import { ISectionProductRepository } from '../repository/SectionProductRelationRepositoryInterface';
import { SectionProductServiceImplementation } from '../service/SectionProductRelationServiceImplementation';
import { ISectionProductRelationService } from '../service/SectionProductRelationServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([SectionProductRelationModel]),
    forwardRef(() => SectionModule),
    forwardRef(() => ProductModule),
  ],
  providers: [
    {
      provide: ISectionProductRepository,
      useClass: SectionProductRepositoryImplementation,
    },
    {
      provide: ISectionProductRelationService,
      useClass: SectionProductServiceImplementation,
    },
  ],
  controllers: [SectionProductRelationController],
  exports: [ISectionProductRelationService],
})
export class SectionProductRelationModule {}
