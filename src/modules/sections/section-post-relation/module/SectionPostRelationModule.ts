import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SectionPostRelationModel } from '../../../../models';
import { PostModule } from '../../../posts/module/PostModule';
import { SectionModule } from '../../sections/module/SectionModule';
import { SectionPostRelationController } from '../controller/SectionPostRelationController';
import { SectionPostRelationRepositoryImplementation } from '../repository/SectionPostRelationRepositoryImplementation';
import { ISectionPostRelationRepository } from '../repository/SectionPostRelationRepositoryInterface';
import { SectionPostRelationServiceImplementation } from '../service/SectionPostRelationServiceImplementation';
import { ISectionPostRelationService } from '../service/SectionPostRelationServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([SectionPostRelationModel]),
    forwardRef(() => SectionModule),
    forwardRef(() => PostModule),
  ],
  providers: [
    {
      provide: ISectionPostRelationRepository,
      useClass: SectionPostRelationRepositoryImplementation,
    },
    {
      provide: ISectionPostRelationService,
      useClass: SectionPostRelationServiceImplementation,
    },
  ],
  controllers: [SectionPostRelationController],
  exports: [ISectionPostRelationService],
})
export class SectionPostRelationModule {}
