import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AgentModel, SectionAgentRelationModel } from '../../../../models';
import { AgentModule } from '../../../agents/module/AgentModule';
import { SectionModule } from '../../sections/module/SectionModule';
import { SectionAgentRelationController } from '../controller/SectionAgentRelationController';
import { SectionAgentRelationRepositoryImplementation } from '../repository/SectionAgentRelationRepositoryImplementation';
import { ISectionAgentRelationRepository } from '../repository/SectionAgentRelationRepositoryInterface';
import { SectionAgentRelationServiceImplementation } from '../service/SectionAgentRelationServiceImplementation';
import { ISectionAgentRelationService } from '../service/SectionAgentRelationServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([SectionAgentRelationModel, AgentModel]),
    forwardRef(() => AgentModule),
    forwardRef(() => SectionModule),
  ],
  providers: [    
    {
      provide: ISectionAgentRelationRepository,
      useClass: SectionAgentRelationRepositoryImplementation,
    },
    {
      provide: ISectionAgentRelationService,
      useClass: SectionAgentRelationServiceImplementation,
    },
  ],
  controllers: [SectionAgentRelationController],
  exports: [ISectionAgentRelationService],
})
export class SectionAgentRelationModule {}
